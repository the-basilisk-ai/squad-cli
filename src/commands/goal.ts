import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import { squadClient } from "../lib/clients/squad.js";
import { resolveContext } from "../lib/context.js";
import { handleError } from "../lib/errors.js";
import { output, outputJson } from "../lib/output.js";

export function registerGoalCommands(program: Command) {
  const goal = program
    .command("goal")
    .description("Manage goals (business outcomes)");

  goal
    .command("list")
    .description("List all goals")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.listGoals({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
        });

        const items = result.data.map(g => ({
          id: g.id,
          title: g.title,
          priority: g.priority,
        }));

        output(items, opts.format, ["id", "title", "priority"]);
      } catch (error) {
        handleError(error);
      }
    });

  goal
    .command("get")
    .description("Get goal details")
    .argument("<id>", "Goal ID")
    .option(
      "--relationships <types>",
      "Include relationships (comma-separated: opportunities,solutions)",
    )
    .action(async function (this: Command, id: string) {
      try {
        const opts = getGlobalOptions(this);
        const localOpts = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.getGoal({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          goalId: id,
          relationships: localOpts.relationships,
        });

        outputJson(result);
      } catch (error) {
        handleError(error);
      }
    });

  goal
    .command("create")
    .description("Create a new goal")
    .requiredOption("--title <title>", "Goal title")
    .option("--description <description>", "Goal description")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const localOpts = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.createGoal({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          createGoalPayload: {
            title: localOpts.title,
            description: localOpts.description,
          },
        });

        outputJson({
          id: result.id,
          title: result.title,
          message: "Goal created",
        });
      } catch (error) {
        handleError(error);
      }
    });

  goal
    .command("update")
    .description("Update a goal")
    .argument("<id>", "Goal ID")
    .option("--title <title>", "Updated title")
    .option("--description <description>", "Updated description")
    .action(async function (this: Command, id: string) {
      try {
        const opts = getGlobalOptions(this);
        const localOpts = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.updateGoal({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          goalId: id,
          updateGoalPayload: {
            title: localOpts.title,
            description: localOpts.description,
          },
        });

        outputJson({
          id: result.id,
          title: result.title,
          message: "Goal updated",
        });
      } catch (error) {
        handleError(error);
      }
    });

  goal
    .command("delete")
    .description("Delete a goal")
    .argument("<id>", "Goal ID")
    .action(async function (this: Command, id: string) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        await client.deleteGoal({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          goalId: id,
        });

        outputJson({ id, message: "Goal deleted" });
      } catch (error) {
        handleError(error);
      }
    });

  goal
    .command("relationships")
    .description("Manage goal relationships")
    .argument("<id>", "Goal ID")
    .requiredOption("--action <action>", "add or remove")
    .option("--opportunity-ids <ids>", "Comma-separated opportunity IDs")
    .option("--solution-ids <ids>", "Comma-separated solution IDs")
    .action(async function (this: Command, id: string) {
      try {
        const opts = getGlobalOptions(this);
        const localOpts = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const splitIds = (s?: string) =>
          s ? s.split(",").map(i => i.trim()) : [];

        await client.manageGoalRelationships({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          goalId: id,
          action: localOpts.action,
          goalRelationshipsPayload: {
            opportunityIds: splitIds(localOpts.opportunityIds),
            solutionIds: splitIds(localOpts.solutionIds),
          },
        });

        outputJson({
          id,
          message: `Relationships ${localOpts.action === "add" ? "added" : "removed"}`,
        });
      } catch (error) {
        handleError(error);
      }
    });
}
