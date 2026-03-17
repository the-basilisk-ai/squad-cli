import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import { squadClient } from "../lib/clients/squad.js";
import { resolveContext } from "../lib/context.js";
import { handleError } from "../lib/errors.js";
import { outputJson } from "../lib/output.js";

export function registerViewCommands(program: Command) {
  const view = program
    .command("view")
    .description("View aggregated workspace data");

  view
    .command("strategy-context")
    .description("View the full strategy context for the workspace")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.viewStrategyContext({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
        });

        outputJson(result);
      } catch (error) {
        await handleError(error);
      }
    });

  view
    .command("roadmap")
    .description("View the workspace roadmap")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.viewRoadmap({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
        });

        outputJson(result);
      } catch (error) {
        await handleError(error);
      }
    });
}
