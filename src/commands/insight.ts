import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import {
  CliGetGoalDocument,
  CliGetInsightDocument,
  CliGoalInsightsDocument,
  CliInsightListDocument,
  CliLinkEntitiesDocument,
  CliUnlinkEntitiesDocument,
  CliUpdateInsightMetaDocument,
} from "../gql/graphql.js";
import type { CommandContext } from "../lib/context.js";
import { resolveContext } from "../lib/context.js";
import { formatDisplayId } from "../lib/display-id.js";
import { handleError } from "../lib/errors.js";
import { execute } from "../lib/graphql/execute.js";
import {
  clampLimit,
  omitUndefined,
  output,
  outputJson,
  parseOffset,
} from "../lib/output.js";

async function resolveGoalUuid(
  goalId: string,
  ctx: CommandContext,
): Promise<string> {
  const data = await execute(CliGetGoalDocument, { id: goalId }, ctx);
  if (!data.goal?.id) throw new Error(`Goal "${goalId}" not found.`);
  return data.goal.id;
}

export function registerInsightCommands(program: Command) {
  const insight = program
    .command("insight")
    .description("Browse and curate insights");

  insight
    .command("list")
    .description("Browse distilled insights ranked by combined score")
    .option(
      "--goal <goalId>",
      "Scope to insights supporting a goal (GL-N or UUID)",
    )
    .option("--category <category>", "Filter by category")
    .option("--min-score <n>", "Minimum combined score")
    .option("--status <status>", "Filter by status")
    .option("--limit <n>", "Max results (default 25, max 100)")
    .option("--offset <n>", "Pagination offset")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const o = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);

        const rows = o.goal
          ? ((await execute(CliGoalInsightsDocument, { goalId: o.goal }, ctx))
              .goal?.insights ?? [])
          : ((
              await execute(
                CliInsightListDocument,
                {
                  limit: clampLimit(o.limit),
                  offset: parseOffset(o.offset),
                  category: o.category,
                  minCombinedScore:
                    o.minScore != null ? Number(o.minScore) : undefined,
                  status: o.status,
                },
                ctx,
              )
            ).insightList ?? []);

        output(
          rows.map(i => ({
            displayId: formatDisplayId("insight", i.displayId) ?? i.id,
            title: i.title,
            category: i.category,
            status: "status" in i ? i.status : undefined,
            combinedScore: i.combinedScore,
          })),
          opts.format,
          ["displayId", "title", "category", "combinedScore"],
        );
      } catch (error) {
        handleError(error);
      }
    });

  insight
    .command("update")
    .description(
      "Curate an insight: set category/status and link or unlink its supported goal",
    )
    .argument("<insightId>", "Insight display ID (IN-N) or UUID")
    .option("--category <category>", "Set the category")
    .option("--status <status>", "Set the status")
    .option("--link-goal <goalId>", "Link to a goal (GL-N or UUID)")
    .option("--unlink-goal <goalId>", "Unlink from a goal (GL-N or UUID)")
    .action(async function (this: Command, insightId: string) {
      try {
        const opts = getGlobalOptions(this);
        const o = this.opts();
        if (!o.category && !o.status && !o.linkGoal && !o.unlinkGoal) {
          throw new Error(
            "Provide at least one of --category, --status, --link-goal, --unlink-goal",
          );
        }
        const ctx = await resolveContext(opts.env, opts.token);

        const found = await execute(
          CliGetInsightDocument,
          { id: insightId, withEvidence: false },
          ctx,
        );
        const insightUuid = found.insight?.id;
        if (!insightUuid) throw new Error(`Insight "${insightId}" not found.`);

        const changes: string[] = [];
        if (o.category || o.status) {
          await execute(
            CliUpdateInsightMetaDocument,
            {
              id: insightUuid,
              input: omitUndefined({ category: o.category, status: o.status }),
            },
            ctx,
          );
          changes.push("metadata updated");
        }

        const edge = (goalUuid: string) => ({
          sourceType: "Insight" as const,
          sourceId: insightUuid,
          targetType: "Goal" as const,
          targetId: goalUuid,
          edgeLabel: "SUPPORTS_GOAL" as const,
        });

        if (o.linkGoal) {
          const goalUuid = await resolveGoalUuid(o.linkGoal, ctx);
          const res = await execute(
            CliLinkEntitiesDocument,
            { input: edge(goalUuid) },
            ctx,
          );
          if (!res.linkEntities?.success) {
            throw new Error(
              `Goal link failed: ${res.linkEntities?.error ?? "unknown error"}`,
            );
          }
          changes.push("goal linked");
        }
        if (o.unlinkGoal) {
          const goalUuid = await resolveGoalUuid(o.unlinkGoal, ctx);
          const res = await execute(
            CliUnlinkEntitiesDocument,
            { input: edge(goalUuid) },
            ctx,
          );
          if (!res.unlinkEntities?.success) {
            throw new Error(
              `Goal unlink failed: ${res.unlinkEntities?.error ?? "unknown error"}`,
            );
          }
          changes.push("goal unlinked");
        }

        outputJson({
          message: "Insight updated",
          displayId:
            formatDisplayId("insight", found.insight?.displayId) ?? insightId,
          changes,
        });
      } catch (error) {
        handleError(error);
      }
    });
}
