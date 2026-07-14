import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import {
  CliCreateResearchQuestionDocument,
  CliGetGoalDocument,
  CliResearchQuestionListDocument,
  CliResearchQuestionsByGoalDocument,
} from "../gql/graphql.js";
import { resolveContext } from "../lib/context.js";
import { formatDisplayId } from "../lib/display-id.js";
import { handleError } from "../lib/errors.js";
import { execute } from "../lib/graphql/execute.js";
import { clampLimit, output, outputJson } from "../lib/output.js";

export function registerResearchCommands(program: Command) {
  const research = program
    .command("research")
    .description("Manage research questions (knowledge gaps)");

  research
    .command("list")
    .description("List open knowledge gaps and their sufficiency status")
    .option("--goal <goalId>", "Scope to a goal (GL-N or UUID)")
    .option(
      "--sufficiency <status>",
      "Filter by sufficiency (e.g. insufficient)",
    )
    .option("--limit <n>", "Max results (default 25, max 100)")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const o = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);

        const rows = o.goal
          ? ((
              await execute(
                CliResearchQuestionsByGoalDocument,
                { goalId: o.goal },
                ctx,
              )
            ).researchQuestionsByGoal ?? [])
          : ((
              await execute(
                CliResearchQuestionListDocument,
                {
                  limit: clampLimit(o.limit),
                  sufficiencyStatus: o.sufficiency,
                },
                ctx,
              )
            ).researchQuestionList ?? []);

        output(
          rows.map(q => ({
            displayId:
              formatDisplayId("research_question", q.displayId) ?? q.id,
            question: q.question,
            category: q.category,
            sufficiency: q.sufficiencyStatus,
          })),
          opts.format,
          ["displayId", "question", "sufficiency"],
        );
      } catch (error) {
        handleError(error);
      }
    });

  research
    .command("create")
    .description("File a knowledge gap as a research question")
    .requiredOption("--question <question>", "The research question")
    .option("--goal <goalId>", "Link to a goal (GL-N or UUID)")
    .option("--category <category>", "Category")
    .option("--rationale <rationale>", "Why this matters")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const o = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);

        let goalId: string | undefined;
        if (o.goal) {
          const g = await execute(CliGetGoalDocument, { id: o.goal }, ctx);
          if (!g.goal?.id) throw new Error(`Goal "${o.goal}" not found.`);
          goalId = g.goal.id;
        }

        const data = await execute(
          CliCreateResearchQuestionDocument,
          {
            question: o.question,
            goalId,
            category: o.category,
            rationale: o.rationale,
          },
          ctx,
        );
        outputJson({
          message: "Research question created",
          researchQuestion: data.createResearchQuestion,
        });
      } catch (error) {
        handleError(error);
      }
    });
}
