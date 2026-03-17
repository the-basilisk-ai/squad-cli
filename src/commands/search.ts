import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import { squadClient } from "../lib/clients/squad.js";
import { resolveContext } from "../lib/context.js";
import { handleError } from "../lib/errors.js";
import { outputJson } from "../lib/output.js";

const ALL_FILTERS = [
  "knowledge-base",
  "insights",
  "opportunities",
  "solutions",
];

export function registerSearchCommands(program: Command) {
  program
    .command("search")
    .description("Similarity search across workspace content")
    .argument("<query>", "Search query")
    .option(
      "--filters <filters>",
      "Comma-separated sources to search (knowledge-base,insights,opportunities,solutions)",
    )
    .action(async function (this: Command, query: string) {
      try {
        const opts = getGlobalOptions(this);
        const localOpts = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const filters = localOpts.filters
          ? localOpts.filters.split(",").map((s: string) => s.trim())
          : ALL_FILTERS;

        const result = await client.similaritySearch({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          similaritySearchRequest: { query, filters },
        });

        outputJson(result);
      } catch (error) {
        await handleError(error);
      }
    });
}
