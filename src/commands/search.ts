import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import { squadClient } from "../lib/clients/squad.js";
import { resolveContext } from "../lib/context.js";
import { handleError } from "../lib/errors.js";
import { outputJson } from "../lib/output.js";

export function registerSearchCommands(program: Command) {
  program
    .command("search")
    .description("Similarity search across workspace content")
    .argument("<query>", "Search query")
    .action(async function (this: Command, query: string) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);

        const result = await client.similaritySearch({
          orgId: ctx.orgId,
          workspaceId: ctx.workspaceId,
          similaritySearchPayload: { query },
        });

        outputJson(result);
      } catch (error) {
        await handleError(error);
      }
    });
}
