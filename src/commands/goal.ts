import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import {
  CliCreateGoalDocument,
  CliGoalListDocument,
  CliUpdateGoalDocument,
} from "../gql/graphql.js";
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

export function registerGoalCommands(program: Command) {
  const goal = program.command("goal").description("Manage strategic goals");

  goal
    .command("list")
    .description("List strategic goals ordered by importance")
    .option("--min-importance <n>", "Only goals at or above this importance")
    .option("--limit <n>", "Max results (default 25, max 100)")
    .option("--offset <n>", "Pagination offset")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const o = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);

        const data = await execute(
          CliGoalListDocument,
          {
            limit: clampLimit(o.limit),
            offset: parseOffset(o.offset),
            minImportance:
              o.minImportance != null ? Number(o.minImportance) : undefined,
          },
          ctx,
        );
        const rows = (data.goalList ?? []).map(g => ({
          displayId: formatDisplayId("goal", g.displayId) ?? g.id,
          title: g.title,
          importance: g.importance,
        }));
        output(rows, opts.format, ["displayId", "title", "importance"]);
      } catch (error) {
        handleError(error);
      }
    });

  goal
    .command("create")
    .description("Create a strategic goal")
    .requiredOption("--title <title>", "Goal title")
    .requiredOption(
      "--description <description>",
      "What success looks like and why",
    )
    .option("--importance <n>", "Importance 1-5 (default 3)", "3")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const o = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);

        const data = await execute(
          CliCreateGoalDocument,
          {
            input: {
              title: o.title,
              content: o.description,
              importance: Number(o.importance),
            },
          },
          ctx,
        );
        outputJson({ message: "Goal created", goal: data.createGoal });
      } catch (error) {
        handleError(error);
      }
    });

  goal
    .command("update")
    .description("Update a goal's title, description or importance")
    .argument("<goalId>", "Goal display ID (GL-N) or UUID")
    .option("--title <title>", "Updated title")
    .option("--description <description>", "Updated description")
    .option("--importance <n>", "Updated importance 1-5")
    .action(async function (this: Command, goalId: string) {
      try {
        const opts = getGlobalOptions(this);
        const o = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);

        const data = await execute(
          CliUpdateGoalDocument,
          {
            id: goalId,
            input: omitUndefined({
              title: o.title,
              content: o.description,
              importance:
                o.importance != null ? Number(o.importance) : undefined,
              createVersion: true,
            }),
          },
          ctx,
        );
        outputJson({ message: "Goal updated", goal: data.updateGoal });
      } catch (error) {
        handleError(error);
      }
    });
}
