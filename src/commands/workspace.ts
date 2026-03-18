import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import { squadClient } from "../lib/clients/squad.js";
import {
  resolveContext,
  resolveToken,
  setWorkspaceSelection,
} from "../lib/context.js";
import { handleError } from "../lib/errors.js";
import { omitUndefined, output, outputJson } from "../lib/output.js";

export function registerWorkspaceCommands(program: Command) {
  const workspace = program
    .command("workspace")
    .description("Manage workspaces");

  workspace
    .command("list")
    .description("List available workspaces across all organisations")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const token = await resolveToken(opts.env, opts.token);
        const client = squadClient(token, opts.env);

        const orgs = await client.listOrganisations();
        const results = await Promise.all(
          orgs.data.map(async org => {
            const ws = await client.listWorkspaces({ orgId: org.id });
            return (ws.data ?? []).map((w: { id: string; name?: string }) => ({
              orgId: org.id,
              orgName: org.name,
              workspaceId: w.id,
              workspaceName: w.name,
            }));
          }),
        );

        output(results.flat(), opts.format, [
          "orgId",
          "orgName",
          "workspaceId",
          "workspaceName",
        ]);
      } catch (error) {
        await handleError(error);
      }
    });

  workspace
    .command("select")
    .description("Select the active organisation and workspace")
    .argument("<orgId>", "Organisation ID")
    .argument("<workspaceId>", "Workspace ID")
    .action(async function (this: Command, orgId: string, workspaceId: string) {
      try {
        const opts = getGlobalOptions(this);
        const token = await resolveToken(opts.env, opts.token);
        const client = squadClient(token, opts.env);

        // Validate the org/workspace exists before persisting
        const workspace = await client.getWorkspace({ orgId, workspaceId });

        setWorkspaceSelection(opts.env, { orgId, workspaceId });
        outputJson({
          message: "Workspace selected",
          orgId,
          workspaceId,
          workspaceName: workspace.name,
        });
      } catch (error) {
        await handleError(error);
      }
    });

  workspace
    .command("get")
    .description("Get current workspace details")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.getWorkspace({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
        });

        outputJson(result);
      } catch (error) {
        await handleError(error);
      }
    });

  workspace
    .command("summary")
    .description("View a pre-rendered summary of the workspace strategy")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.getStrategyDocument({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          include: "solutions",
        });

        if (opts.format === "json") {
          outputJson(result);
        } else {
          console.log(result.data.report);
        }
      } catch (error) {
        await handleError(error);
      }
    });

  workspace
    .command("update")
    .description("Update current workspace")
    .option("--name <name>", "Workspace name")
    .option("--description <description>", "Workspace description")
    .option("--mission-statement <statement>", "Mission statement")
    .option("--homepage-url <url>", "Homepage URL")
    .option("--logo-url <url>", "Logo URL")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const localOpts = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.updateWorkspace({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          updateWorkspacePayload: omitUndefined({
            name: localOpts.name,
            description: localOpts.description,
            missionStatement: localOpts.missionStatement,
            homepageUrl: localOpts.homepageUrl,
            logoUrl: localOpts.logoUrl,
          }),
        });

        outputJson(result);
      } catch (error) {
        await handleError(error);
      }
    });
}
