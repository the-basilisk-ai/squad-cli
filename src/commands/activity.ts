import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import { CliActivityStreamDocument } from "../gql/graphql.js";
import { resolveContext } from "../lib/context.js";
import { handleError } from "../lib/errors.js";
import { execute } from "../lib/graphql/execute.js";
import { clampLimit, outputJson } from "../lib/output.js";

export function registerActivityCommands(program: Command) {
  program
    .command("activity")
    .description("Workspace change feed (humans and agents), newest first")
    .option(
      "--entity-types <list>",
      "Comma-separated entity types (e.g. signal,insight)",
    )
    .option("--actor-type <type>", "human or agent")
    .option("--agent-id <id>", "Filter to one agent")
    .option("--limit <n>", "Max events (default 25, max 100)")
    .option("--after <cursor>", "Pagination cursor from a previous page")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const o = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);
        const csv = (v?: string) =>
          v
            ? v
                .split(",")
                .map(s => s.trim())
                .filter(Boolean)
            : undefined;

        const data = await execute(
          CliActivityStreamDocument,
          {
            first: clampLimit(o.limit),
            after: o.after,
            entityType: csv(o.entityTypes),
            actorType: o.actorType ? [o.actorType] : undefined,
            agentId: o.agentId,
          },
          ctx,
        );

        const stream = data.activityStream;
        outputJson({
          events: (stream?.events ?? []).map(e => ({
            action: e.action,
            actorType: e.actorType,
            actor: e.actorUser?.displayName ?? e.agentName,
            entityType: e.entityType,
            entityId: e.entityId,
            createdAt: e.createdAt,
          })),
          nextCursor: stream?.hasNextPage ? stream.endCursor : null,
        });
      } catch (error) {
        handleError(error);
      }
    });
}
