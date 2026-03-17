import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import { squadClient } from "../lib/clients/squad.js";
import { resolveContext } from "../lib/context.js";
import { handleError } from "../lib/errors.js";
import { omitUndefined, output, outputJson } from "../lib/output.js";

export function registerOpportunityCommands(program: Command) {
  const opportunity = program
    .command("opportunity")
    .description("Manage opportunities (problem statements)");

  opportunity
    .command("list")
    .description("List all opportunities")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.listOpportunities({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
        });

        const items = result.data.map(o => ({
          id: o.id,
          title: o.title,
          status: o.status,
        }));

        output(items, opts.format, ["id", "title", "status"]);
      } catch (error) {
        await handleError(error);
      }
    });

  opportunity
    .command("get")
    .description("Get opportunity details")
    .argument("<id>", "Opportunity ID")
    .option(
      "--relationships <types>",
      "Include relationships (comma-separated: solutions,outcomes,insights)",
    )
    .action(async function (this: Command, id: string) {
      try {
        const opts = getGlobalOptions(this);
        const localOpts = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.getOpportunity({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          opportunityId: id,
          relationships: localOpts.relationships,
        });

        outputJson(result);
      } catch (error) {
        await handleError(error);
      }
    });

  opportunity
    .command("create")
    .description("Create a new opportunity")
    .requiredOption("--title <title>", "Opportunity title")
    .requiredOption(
      "--description <description>",
      "Problem statement description",
    )
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const localOpts = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.createOpportunity({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          createOpportunityPayload: {
            title: localOpts.title,
            description: localOpts.description,
            createdBy: "user",
          },
        });

        outputJson({
          id: result.id,
          title: result.title,
          message: "Opportunity created",
        });
      } catch (error) {
        await handleError(error);
      }
    });

  opportunity
    .command("update")
    .description("Update an opportunity")
    .argument("<id>", "Opportunity ID")
    .option("--title <title>", "Updated title")
    .option("--description <description>", "Updated description")
    .option(
      "--status <status>",
      "Updated status (new, solved, planned, in_progress)",
    )
    .action(async function (this: Command, id: string) {
      try {
        const opts = getGlobalOptions(this);
        const localOpts = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.updateOpportunity({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          opportunityId: id,
          updateOpportunityPayload: omitUndefined({
            title: localOpts.title,
            description: localOpts.description,
            status: localOpts.status,
          }),
        });

        outputJson({
          id: result.id,
          title: result.title,
          status: result.status,
          message: "Opportunity updated",
        });
      } catch (error) {
        await handleError(error);
      }
    });

  opportunity
    .command("delete")
    .description("Delete an opportunity")
    .argument("<id>", "Opportunity ID")
    .action(async function (this: Command, id: string) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        await client.deleteOpportunity({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          opportunityId: id,
        });

        outputJson({ id, message: "Opportunity deleted" });
      } catch (error) {
        await handleError(error);
      }
    });

  opportunity
    .command("generate-solutions")
    .description("Generate AI solutions for an opportunity")
    .argument("<id>", "Opportunity ID")
    .action(async function (this: Command, id: string) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        await client.generateSolutions({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          opportunityId: id,
        });

        outputJson({ id, message: "Solution generation started" });
      } catch (error) {
        await handleError(error);
      }
    });

  opportunity
    .command("relationships")
    .description("Manage opportunity relationships")
    .argument("<id>", "Opportunity ID")
    .requiredOption("--action <action>", "add or remove")
    .option("--solution-ids <ids>", "Comma-separated solution IDs")
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

        await client.manageOpportunityRelationships({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          opportunityId: id,
          action: localOpts.action,
          opportunityRelationshipsPayload: {
            solutionIds: splitIds(localOpts.solutionIds),
            outcomeIds: splitIds(localOpts.outcomeIds),
            insightIds: splitIds(localOpts.insightIds),
          },
        });

        outputJson({
          id,
          message: `Relationships ${localOpts.action === "add" ? "added" : "removed"}`,
        });
      } catch (error) {
        await handleError(error);
      }
    });
}
