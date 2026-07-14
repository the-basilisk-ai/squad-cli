import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import { CliIntegrationListDocument } from "../gql/graphql.js";
import { resolveContext } from "../lib/context.js";
import { handleError } from "../lib/errors.js";
import { execute } from "../lib/graphql/execute.js";
import { output } from "../lib/output.js";

export function registerIntegrationCommands(program: Command) {
  program
    .command("integration")
    .description("Connected feedback sources and their sync health")
    .command("list")
    .description("List connected integrations and their sync health")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const data = await execute(CliIntegrationListDocument, {}, ctx);

        const rows = (data.integrationList ?? []).map(i => {
          const triggers = i.triggers ?? [];
          const lastSyncedAt = triggers
            .map(t => t.lastSyncedAt)
            .filter(Boolean)
            .sort()
            .at(-1);
          const signalsPulled = triggers.reduce(
            (sum, t) => sum + (t.syncTotal ?? 0),
            0,
          );
          return {
            name: i.name,
            provider: i.provider,
            status: i.status,
            lastSyncedAt,
            signalsPulled,
          };
        });
        output(rows, opts.format, [
          "name",
          "provider",
          "status",
          "signalsPulled",
        ]);
      } catch (error) {
        handleError(error);
      }
    });
}
