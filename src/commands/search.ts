import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import {
  CliCommandSearchDocument,
  CliDocumentTextSearchDocument,
} from "../gql/graphql.js";
import { resolveContext } from "../lib/context.js";
import { handleError } from "../lib/errors.js";
import { execute } from "../lib/graphql/execute.js";
import { clampLimit, output } from "../lib/output.js";

const SEARCH_TYPES = [
  "signal",
  "insight",
  "action",
  "goal",
  "document",
  "cluster",
] as const;

export function registerSearchCommands(program: Command) {
  program
    .command("search")
    .description(
      "Keyword search across signals, insights, actions, goals, documents and clusters",
    )
    .argument("<query>", "Search query")
    .option(
      "--types <list>",
      `Comma-separated types (${SEARCH_TYPES.join(",")}); default all`,
    )
    .option("--limit <n>", "Max results (default 25, max 100)")
    .action(async function (this: Command, query: string) {
      try {
        const opts = getGlobalOptions(this);
        const o = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);
        const limit = clampLimit(o.limit);
        const types: string[] = o.types
          ? o.types.split(",").map((s: string) => s.trim())
          : [...SEARCH_TYPES];

        const [command, documents] = await Promise.all([
          execute(
            CliCommandSearchDocument,
            { search: query, limitPerType: limit },
            ctx,
          ),
          types.includes("document")
            ? execute(
                CliDocumentTextSearchDocument,
                { search: query, limit },
                ctx,
              )
            : Promise.resolve(null),
        ]);

        const seen = new Set<string>();
        const results: Array<{
          displayId?: string | number | null;
          title?: string | null;
          type?: string | null;
        }> = [];
        for (const r of command.commandSearchEntities ?? []) {
          if (r.type && !types.includes(r.type)) continue;
          if (r.id && seen.has(r.id)) continue;
          if (r.id) seen.add(r.id);
          results.push({
            displayId: r.displayId ?? r.id,
            title: r.title,
            type: r.type,
          });
        }
        for (const d of documents?.documentSearch ?? []) {
          if (d.id && seen.has(d.id)) continue;
          if (d.id) seen.add(d.id);
          results.push({
            displayId: d.displayId ?? d.id,
            title: d.title,
            type: d.kind === "one_pager" ? "one_pager" : "document",
          });
        }

        output(results.slice(0, limit), opts.format, [
          "displayId",
          "title",
          "type",
        ]);
      } catch (error) {
        handleError(error);
      }
    });
}
