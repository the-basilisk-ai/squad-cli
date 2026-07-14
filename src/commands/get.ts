import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import {
  CliGetActionDocument,
  CliGetClusterDocument,
  CliGetDocumentMarkdownDocument,
  CliGetDocumentMetaDocument,
  CliGetGoalDocument,
  CliGetInsightDocument,
  CliGetOnePagerDocument,
  CliGetSignalDocument,
  CliResearchQuestionListDocument,
} from "../gql/graphql.js";
import type { CommandContext } from "../lib/context.js";
import { resolveContext } from "../lib/context.js";
import { type EntityType, parseEntityRef } from "../lib/display-id.js";
import { handleError } from "../lib/errors.js";
import { execute } from "../lib/graphql/execute.js";
import { outputJson } from "../lib/output.js";

const UUID_PROBE_ORDER: EntityType[] = [
  "action",
  "insight",
  "signal",
  "goal",
  "document",
];

async function fetchByType(
  type: EntityType,
  id: string,
  ctx: CommandContext,
  withEvidence: boolean,
): Promise<unknown> {
  switch (type) {
    case "signal":
      return (await execute(CliGetSignalDocument, { id }, ctx)).signal;
    case "insight":
      return (await execute(CliGetInsightDocument, { id, withEvidence }, ctx))
        .insight;
    case "action":
      return (await execute(CliGetActionDocument, { id }, ctx)).action;
    case "goal":
      return (await execute(CliGetGoalDocument, { id }, ctx)).goal;
    case "cluster":
      return (await execute(CliGetClusterDocument, { id }, ctx)).cluster;
    case "one_pager":
      return (await execute(CliGetOnePagerDocument, { displayId: id }, ctx))
        .onePager;
    case "document": {
      const meta = (await execute(CliGetDocumentMetaDocument, { id }, ctx))
        .document;
      if (!meta?.id) return null;
      const markdown = (
        await execute(
          CliGetDocumentMarkdownDocument,
          { documentId: meta.id },
          ctx,
        )
      ).documentMarkdownExport;
      return { ...meta, markdown };
    }
    case "research_question": {
      const list = (
        await execute(CliResearchQuestionListDocument, { limit: 100 }, ctx)
      ).researchQuestionList;
      return (
        list?.find(q => q.displayId != null && `${q.displayId}` === id) ?? null
      );
    }
  }
}

export function registerGetCommand(program: Command) {
  program
    .command("get")
    .description(
      "Fetch any workspace entity by display ID (e.g. AC-12) or UUID",
    )
    .argument("<id>", "Display ID or UUID")
    .option(
      "--include <list>",
      'Comma-separated expansions (insights support "evidence")',
    )
    .action(async function (this: Command, id: string) {
      try {
        const opts = getGlobalOptions(this);
        const include: string[] = this.opts().include
          ? this.opts()
              .include.split(",")
              .map((s: string) => s.trim())
          : [];
        const withEvidence = include.includes("evidence");
        const ctx = await resolveContext(opts.env, opts.token);

        const ref = parseEntityRef(id);
        if (ref.kind === "display") {
          const lookup =
            ref.type === "research_question"
              ? `${ref.displayId}`
              : ref.formatted;
          const entity = await fetchByType(ref.type, lookup, ctx, withEvidence);
          if (!entity) throw new Error(`${ref.formatted} not found.`);
          outputJson({ type: ref.type, entity });
          return;
        }

        for (const type of UUID_PROBE_ORDER) {
          try {
            const entity = await fetchByType(type, ref.id, ctx, withEvidence);
            if (entity) {
              outputJson({ type, entity });
              return;
            }
          } catch {
            // try the next type
          }
        }
        throw new Error(`No entity found for ${ref.id}.`);
      } catch (error) {
        handleError(error);
      }
    });
}
