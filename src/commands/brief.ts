import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import {
  CliGenerateOnePagerFromActionDocument,
  CliGenerateOnePagerFromInsightDocument,
  CliGetInsightDocument,
  CliGetOnePagerDocument,
  CliOnePagerListDocument,
  CliRetryOnePagerGenerationDocument,
  CliSetOnePagerStatusDocument,
} from "../gql/graphql.js";
import { resolveContext } from "../lib/context.js";
import { formatDisplayId } from "../lib/display-id.js";
import { handleError } from "../lib/errors.js";
import { execute } from "../lib/graphql/execute.js";
import { clampLimit, output, outputJson, parseOffset } from "../lib/output.js";

type OnePagerStatus =
  | "building"
  | "draft"
  | "in_review"
  | "finalised"
  | "failed";
type OnePagerType = "decision" | "prd";

export function registerBriefCommands(program: Command) {
  const brief = program
    .command("brief")
    .description("Manage decision briefs (one-pagers)");

  brief
    .command("list")
    .description("List decision briefs with status and recommendation")
    .option(
      "--status <list>",
      "Comma-separated: building,draft,in_review,finalised,failed",
    )
    .option("--type <type>", "decision or prd")
    .option(
      "--source-insight <insightId>",
      "Filter to briefs from an insight (IN-N or UUID)",
    )
    .option("--limit <n>", "Max results (default 25, max 100)")
    .option("--offset <n>", "Pagination offset")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const o = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);

        let sourceInsightId: string | undefined;
        if (o.sourceInsight) {
          const ins = await execute(
            CliGetInsightDocument,
            { id: o.sourceInsight, withEvidence: false },
            ctx,
          );
          sourceInsightId = ins.insight?.id ?? undefined;
        }

        const statuses = o.status
          ? (o.status
              .split(",")
              .map((s: string) => s.trim()) as OnePagerStatus[])
          : undefined;

        const data = await execute(
          CliOnePagerListDocument,
          {
            filters: {
              onePagerStatus: statuses,
              onePagerType: o.type as OnePagerType | undefined,
              sourceInsightId,
            },
            limit: clampLimit(o.limit),
            offset: parseOffset(o.offset),
          },
          ctx,
        );

        output(
          (data.onePagerList ?? []).map(p => ({
            displayId: formatDisplayId("one_pager", p.displayId) ?? p.id,
            title: p.title,
            status: p.onePagerStatus,
            type: p.onePagerType,
            recommendation: p.decisionRecommendation,
          })),
          opts.format,
          ["displayId", "title", "status", "type"],
        );
      } catch (error) {
        handleError(error);
      }
    });

  brief
    .command("generate")
    .description(
      "Kick off AI generation of a decision brief, or retry a failed one",
    )
    .option("--action <actionId>", "Generate from an action (AC-N or UUID)")
    .option("--insight <insightId>", "Generate from an insight (IN-N or UUID)")
    .option("--type <type>", "decision or prd")
    .option("--retry <onePagerId>", "Retry a failed brief (OP-N or UUID)")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const o = this.opts();
        const chosen = [o.action, o.insight, o.retry].filter(Boolean);
        if (chosen.length !== 1) {
          throw new Error(
            "Pass exactly one of --action, --insight or --retry.",
          );
        }
        const ctx = await resolveContext(opts.env, opts.token);
        const type = o.type as OnePagerType | undefined;

        let result: unknown;
        if (o.retry) {
          const found = await execute(
            CliGetOnePagerDocument,
            { displayId: o.retry },
            ctx,
          );
          if (!found.onePager?.id)
            throw new Error(`Decision brief "${o.retry}" not found.`);
          result = (
            await execute(
              CliRetryOnePagerGenerationDocument,
              { onePagerId: found.onePager.id },
              ctx,
            )
          ).retryOnePagerGeneration;
        } else if (o.action) {
          result = (
            await execute(
              CliGenerateOnePagerFromActionDocument,
              { actionId: o.action, type },
              ctx,
            )
          ).generateOnePagerFromAction;
        } else {
          result = (
            await execute(
              CliGenerateOnePagerFromInsightDocument,
              { insightId: o.insight, type },
              ctx,
            )
          ).generateOnePagerFromInsight;
        }

        outputJson({
          message: "Decision brief generation started",
          status: "building",
          checkWith: "squad get <OP-N>",
          brief: result,
        });
      } catch (error) {
        handleError(error);
      }
    });

  brief
    .command("status")
    .description("Move a decision brief through its review lifecycle")
    .argument("<onePagerId>", "Decision brief display ID (OP-N) or UUID")
    .argument("<status>", "draft | in_review | finalised")
    .action(async function (this: Command, onePagerId: string, status: string) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);

        const found = await execute(
          CliGetOnePagerDocument,
          { displayId: onePagerId },
          ctx,
        );
        if (!found.onePager?.id)
          throw new Error(`Decision brief "${onePagerId}" not found.`);

        const data = await execute(
          CliSetOnePagerStatusDocument,
          { onePagerId: found.onePager.id, status: status as OnePagerStatus },
          ctx,
        );
        outputJson({
          message: "Brief status updated",
          brief: data.setOnePagerStatus,
        });
      } catch (error) {
        handleError(error);
      }
    });
}
