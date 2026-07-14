import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import {
  CliClusterListDocument,
  CliGetClusterDocument,
} from "../gql/graphql.js";
import { resolveContext } from "../lib/context.js";
import { formatDisplayId } from "../lib/display-id.js";
import { handleError } from "../lib/errors.js";
import { execute } from "../lib/graphql/execute.js";
import { clampLimit, output, outputJson, parseOffset } from "../lib/output.js";

export function registerClusterCommands(program: Command) {
  const cluster = program
    .command("cluster")
    .description("Browse signal clusters (recurring themes)");

  cluster
    .command("list")
    .description("Browse signal clusters with sizes and labels")
    .option("--type <type>", "Filter by signal type")
    .option("--include-unlabeled", "Include clusters without a label")
    .option("--limit <n>", "Max results (default 25, max 100)")
    .option("--offset <n>", "Pagination offset")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const o = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);

        const data = await execute(
          CliClusterListDocument,
          {
            limit: clampLimit(o.limit),
            offset: parseOffset(o.offset),
            signalType: o.type,
            requireLabel: !o.includeUnlabeled,
          },
          ctx,
        );
        const rows = (data.clusterList ?? []).map(c => ({
          displayId: formatDisplayId("cluster", c.displayId) ?? c.id,
          label: c.label,
          members: c.memberCount,
          type: c.signalType,
          status: c.status,
        }));
        output(rows, opts.format, ["displayId", "label", "members", "type"]);
      } catch (error) {
        handleError(error);
      }
    });

  cluster
    .command("get")
    .description("A cluster's label, stats, member signals and linked insights")
    .argument("<clusterId>", "Cluster display ID (CL-N) or UUID")
    .action(async function (this: Command, clusterId: string) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const data = await execute(
          CliGetClusterDocument,
          { id: clusterId },
          ctx,
        );
        outputJson(data.cluster ?? null);
      } catch (error) {
        handleError(error);
      }
    });
}
