import fs from "node:fs";
import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import {
  CliDeleteSignalDocument,
  CliGetSignalDocument,
  CliGetSignalRelatedDocument,
  CliSignalListDocument,
} from "../gql/graphql.js";
import { resolveContext } from "../lib/context.js";
import { formatDisplayId } from "../lib/display-id.js";
import { handleError } from "../lib/errors.js";
import { execute } from "../lib/graphql/execute.js";
import { type IngestItem, ingestSignals } from "../lib/ingest.js";
import { clampLimit, output, outputJson, parseOffset } from "../lib/output.js";

export function registerSignalCommands(program: Command) {
  const signal = program
    .command("signal")
    .description("Browse and capture feedback signals");

  signal
    .command("list")
    .description("Browse raw feedback signals with filters")
    .option("--source <source>", "Filter by source (e.g. slack, zendesk, api)")
    .option(
      "--type <type>",
      "Filter by signal type (e.g. pain_point, bug_report)",
    )
    .option("--sentiment <sentiment>", "positive, neutral, negative or mixed")
    .option("--cluster <clusterId>", "Filter to a cluster (UUID)")
    .option("--since <iso>", "Only signals on/after this ISO-8601 timestamp")
    .option("--until <iso>", "Only signals on/before this ISO-8601 timestamp")
    .option("--include-dismissed", "Include dismissed signals")
    .option("--limit <n>", "Max results (default 25, max 100)")
    .option("--offset <n>", "Pagination offset")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const o = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);

        const data = await execute(
          CliSignalListDocument,
          {
            limit: clampLimit(o.limit),
            offset: parseOffset(o.offset),
            source: o.source,
            signalType: o.type,
            clusterId: o.cluster,
            createdAfter: o.since,
            createdBefore: o.until,
            sentiment: o.sentiment,
            status: o.includeDismissed ? undefined : ["active", "stale"],
          },
          ctx,
        );

        const rows = (data.signalList ?? []).map(s => ({
          displayId: formatDisplayId("signal", s.displayId) ?? s.id,
          title: s.contentSummary,
          source: s.source,
          type: s.signalType,
          sentiment: s.sentiment,
          status: s.status,
          cluster: formatDisplayId("cluster", s.cluster?.displayId),
        }));
        output(rows, opts.format, [
          "displayId",
          "title",
          "source",
          "type",
          "status",
        ]);
      } catch (error) {
        handleError(error);
      }
    });

  signal
    .command("similar")
    .description("Find signals semantically similar to a given signal")
    .argument("<signalId>", "Signal display ID (SI-N) or UUID")
    .option("--limit <n>", "Max results (default 5, max 20)")
    .action(async function (this: Command, signalId: string) {
      try {
        const opts = getGlobalOptions(this);
        const limit = Math.min(Number(this.opts().limit) || 5, 20);
        const ctx = await resolveContext(opts.env, opts.token);

        const data = await execute(
          CliGetSignalRelatedDocument,
          { id: signalId, limit },
          ctx,
        );
        const rows = (data.signal?.relatedSignals ?? []).map(s => ({
          displayId: formatDisplayId("signal", s.displayId) ?? s.id,
          title: s.contentSummary,
          source: s.source,
          type: s.signalType,
        }));
        output(rows, opts.format, ["displayId", "title", "source", "type"]);
      } catch (error) {
        handleError(error);
      }
    });

  signal
    .command("ingest")
    .description(
      "Pipe feedback into the evidence chain (deduped and clustered asynchronously)",
    )
    .option("--content <content>", "Feedback verbatim or a faithful summary")
    .option("--source <source>", "Source of the feedback (default: api)")
    .option("--title <title>", "Short title")
    .option("--source-url <url>", "Link to the original feedback")
    .option("--author <author>", "Who gave the feedback")
    .option("--occurred-at <iso>", "When the feedback occurred (ISO-8601)")
    .option("--strength <n>", "Signal strength 0-1 (default 0.5)")
    .option(
      "--file <path>",
      "Path to a JSON file with an array of signals (1-50)",
    )
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const o = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);

        let items: IngestItem[];
        if (o.file) {
          const parsed = JSON.parse(fs.readFileSync(o.file, "utf8"));
          if (!Array.isArray(parsed)) {
            throw new Error("--file must contain a JSON array of signals");
          }
          items = parsed;
        } else {
          if (!o.content) {
            throw new Error(
              "Provide --content, or --file with a batch of signals",
            );
          }
          const metadata: Record<string, string | number | boolean> = {};
          if (o.sourceUrl) metadata.sourceUrl = o.sourceUrl;
          if (o.author) metadata.author = o.author;
          if (o.occurredAt) metadata.occurredAt = o.occurredAt;
          items = [
            {
              content: o.content,
              title: o.title,
              source: o.source ?? "api",
              strength: o.strength != null ? Number(o.strength) : undefined,
              metadata: Object.keys(metadata).length ? metadata : undefined,
            },
          ];
        }

        const result = await ingestSignals(items, ctx);
        outputJson(result);
      } catch (error) {
        handleError(error);
      }
    });

  signal
    .command("dismiss")
    .description("Permanently delete a signal (noise/spam) - unrecoverable")
    .argument("<signalId>", "Signal display ID (SI-N) or UUID")
    .option("--reason <reason>", "Why the signal is being dismissed")
    .action(async function (this: Command, signalId: string) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);

        const found = await execute(
          CliGetSignalDocument,
          { id: signalId },
          ctx,
        );
        if (!found.signal?.id) {
          throw new Error(`Signal "${signalId}" not found.`);
        }
        await execute(CliDeleteSignalDocument, { id: found.signal.id }, ctx);
        outputJson({
          message: "Signal dismissed",
          displayId:
            formatDisplayId("signal", found.signal.displayId) ?? signalId,
          reason: this.opts().reason,
        });
      } catch (error) {
        handleError(error);
      }
    });
}
