import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import { squadClient } from "../lib/clients/squad.js";
import { resolveContext } from "../lib/context.js";
import { handleError } from "../lib/errors.js";
import { output, outputJson } from "../lib/output.js";

export function registerSolutionCommands(program: Command) {
  const solution = program.command("solution").description("Manage solutions");

  solution
    .command("list")
    .description("List all solutions")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.listSolutions({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
        });

        const items = result.data.map(s => ({
          id: s.id,
          title: s.title,
          status: s.status,
        }));

        output(items, opts.format, ["id", "title", "status"]);
      } catch (error) {
        handleError(error);
      }
    });

  solution
    .command("get")
    .description("Get solution details")
    .argument("<id>", "Solution ID")
    .option(
      "--relationships <types>",
      "Include relationships (comma-separated: opportunities,outcomes,insights)",
    )
    .action(async function (this: Command, id: string) {
      try {
        const opts = getGlobalOptions(this);
        const localOpts = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.getSolution({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          solutionId: id,
          relationships: localOpts.relationships,
        });

        outputJson(result);
      } catch (error) {
        handleError(error);
      }
    });

  solution
    .command("create")
    .description("Create a new solution")
    .requiredOption("--title <title>", "Solution title")
    .requiredOption("--description <description>", "Solution description")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const localOpts = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.createSolution({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          createSolutionPayload: {
            title: localOpts.title,
            description: localOpts.description,
          },
        });

        outputJson({
          id: result.id,
          title: result.title,
          message: "Solution created",
        });
      } catch (error) {
        handleError(error);
      }
    });

  solution
    .command("update")
    .description("Update a solution")
    .argument("<id>", "Solution ID")
    .option("--title <title>", "Updated title")
    .option("--description <description>", "Updated description")
    .option("--status <status>", "Updated status")
    .action(async function (this: Command, id: string) {
      try {
        const opts = getGlobalOptions(this);
        const localOpts = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.updateSolution({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          solutionId: id,
          updateSolutionPayload: {
            title: localOpts.title,
            description: localOpts.description,
            status: localOpts.status,
          },
        });

        outputJson({
          id: result.id,
          title: result.title,
          status: result.status,
          message: "Solution updated",
        });
      } catch (error) {
        handleError(error);
      }
    });

  solution
    .command("delete")
    .description("Delete a solution")
    .argument("<id>", "Solution ID")
    .action(async function (this: Command, id: string) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        await client.deleteSolution({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          solutionId: id,
        });

        outputJson({ id, message: "Solution deleted" });
      } catch (error) {
        handleError(error);
      }
    });

  solution
    .command("edit-prd")
    .description("Edit a solution's PRD (Product Requirements Document)")
    .argument("<id>", "Solution ID")
    .requiredOption("--content <content>", "PRD content")
    .action(async function (this: Command, id: string) {
      try {
        const opts = getGlobalOptions(this);
        const localOpts = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.editSolutionPrd({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          solutionId: id,
          editSolutionPrdPayload: { content: localOpts.content },
        });

        outputJson(result);
      } catch (error) {
        handleError(error);
      }
    });

  solution
    .command("relationships")
    .description("Manage solution relationships")
    .argument("<id>", "Solution ID")
    .requiredOption("--action <action>", "add or remove")
    .option("--opportunity-ids <ids>", "Comma-separated opportunity IDs")
    .option("--outcome-ids <ids>", "Comma-separated outcome/goal IDs")
    .option("--insight-ids <ids>", "Comma-separated insight IDs")
    .action(async function (this: Command, id: string) {
      try {
        const opts = getGlobalOptions(this);
        const localOpts = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const splitIds = (s?: string) =>
          s ? s.split(",").map(i => i.trim()) : [];

        await client.manageSolutionRelationships({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          solutionId: id,
          action: localOpts.action,
          solutionRelationshipsPayload: {
            opportunityIds: splitIds(localOpts.opportunityIds),
            outcomeIds: splitIds(localOpts.outcomeIds),
            insightIds: splitIds(localOpts.insightIds),
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

  solution
    .command("prioritise")
    .description("Prioritise solutions in the workspace")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.prioritiseSolutions({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
        });

        outputJson(result);
      } catch (error) {
        handleError(error);
      }
    });
}
