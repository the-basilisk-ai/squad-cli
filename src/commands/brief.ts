import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import {
  CliBriefListDocument,
  CliGenerateBriefFromActionDocument,
  CliGenerateBriefFromInsightDocument,
  CliGetBriefDocument,
  CliGetInsightDocument,
  CliRetryBriefGenerationDocument,
  CliSetBriefStatusDocument,
} from "../gql/graphql.js";
import { resolveContext } from "../lib/context.js";
import { formatDisplayId } from "../lib/display-id.js";
import { handleError } from "../lib/errors.js";
import { execute } from "../lib/graphql/execute.js";
import { clampLimit, output, outputJson, parseOffset } from "../lib/output.js";

type BriefStatus = "building" | "draft" | "in_review" | "finalised" | "failed";
type BriefType = "decision" | "prd";

export function registerBriefCommands(program: Command) {
  const brief = program.command("brief").description("Manage decision briefs");

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
          ? (o.status.split(",").map((s: string) => s.trim()) as BriefStatus[])
          : undefined;

        const data = await execute(
          CliBriefListDocument,
          {
            filters: {
              briefStatus: statuses,
              briefType: o.type as BriefType | undefined,
              sourceInsightId,
            },
            limit: clampLimit(o.limit),
            offset: parseOffset(o.offset),
          },
          ctx,
        );

        output(
          (data.briefList ?? []).map(p => ({
            displayId: formatDisplayId("brief", p.displayId) ?? p.id,
            title: p.title,
            status: p.briefStatus,
            type: p.briefType,
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
    .option("--retry <briefId>", "Retry a failed brief (BR-N or UUID)")
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
        const type = o.type as BriefType | undefined;

        let result: unknown;
        if (o.retry) {
          const found = await execute(
            CliGetBriefDocument,
            { displayId: o.retry },
            ctx,
          );
          if (!found.brief?.id)
            throw new Error(`Decision brief "${o.retry}" not found.`);
          result = (
            await execute(
              CliRetryBriefGenerationDocument,
              { briefId: found.brief.id },
              ctx,
            )
          ).retryBriefGeneration;
        } else if (o.action) {
          result = (
            await execute(
              CliGenerateBriefFromActionDocument,
              { actionId: o.action, type },
              ctx,
            )
          ).generateBriefFromAction;
        } else {
          result = (
            await execute(
              CliGenerateBriefFromInsightDocument,
              { insightId: o.insight, type },
              ctx,
            )
          ).generateBriefFromInsight;
        }

        outputJson({
          message: "Decision brief generation started",
          status: "building",
          checkWith: "squad get <BR-N>",
          brief: result,
        });
      } catch (error) {
        handleError(error);
      }
    });

  brief
    .command("status")
    .description("Move a decision brief through its review lifecycle")
    .argument("<briefId>", "Decision brief display ID (BR-N) or UUID")
    .argument("<status>", "draft | in_review | finalised")
    .action(async function (this: Command, briefId: string, status: string) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);

        const found = await execute(
          CliGetBriefDocument,
          { displayId: briefId },
          ctx,
        );
        if (!found.brief?.id)
          throw new Error(`Decision brief "${briefId}" not found.`);

        const data = await execute(
          CliSetBriefStatusDocument,
          { briefId: found.brief.id, status: status as BriefStatus },
          ctx,
        );
        outputJson({
          message: "Brief status updated",
          brief: data.setBriefStatus,
        });
      } catch (error) {
        handleError(error);
      }
    });
}
