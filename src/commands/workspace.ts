import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import {
  CliOrgMemberListDocument,
  CliUpdateWorkspaceDocument,
  CliWorkspaceOverviewDocument,
} from "../gql/graphql.js";
import {
  fetchWorkspaceDirectory,
  getWorkspaceSelection,
  resolveContext,
  setWorkspaceSelection,
} from "../lib/context.js";
import { formatDisplayId } from "../lib/display-id.js";
import { handleError } from "../lib/errors.js";
import { appLink } from "../lib/format.js";
import { execute } from "../lib/graphql/execute.js";
import { omitUndefined, output, outputJson } from "../lib/output.js";

export function registerWorkspaceCommands(program: Command) {
  const workspace = program
    .command("workspace")
    .description("Manage workspaces");

  workspace
    .command("list")
    .description("List every organisation and workspace you can access")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const directory = await fetchWorkspaceDirectory(opts.env);
        const current = getWorkspaceSelection(opts.env);

        const rows = directory.workspaces.map(ws => ({
          orgId: ws.orgId,
          orgName: ws.orgName,
          workspaceId: ws.id,
          workspaceName: ws.name,
          selected:
            current?.orgId === ws.orgId && current?.workspaceId === ws.id,
        }));

        output(rows, opts.format, [
          "orgId",
          "orgName",
          "workspaceId",
          "workspaceName",
          "selected",
        ]);
      } catch (error) {
        handleError(error);
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
        const directory = await fetchWorkspaceDirectory(opts.env, orgId);
        const ws = directory.workspaces.find(
          w => w.id === workspaceId && w.orgId === orgId,
        );
        if (!ws) {
          throw new Error(
            `Workspace ${workspaceId} not found in organisation ${orgId}. Run: squad workspace list`,
          );
        }

        setWorkspaceSelection(opts.env, {
          orgId,
          workspaceId,
          orgSlug: ws.orgSlug,
          workspaceSlug: ws.slug,
        });
        outputJson({
          message: "Workspace selected",
          orgId,
          orgName: ws.orgName,
          workspaceId,
          workspaceName: ws.name,
        });
      } catch (error) {
        handleError(error);
      }
    });

  workspace
    .command("overview")
    .description(
      "One-call orientation: mission, top goals, recent signal activity, evidence-chain health and open work",
    )
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const data = await execute(
          CliWorkspaceOverviewDocument,
          { workspaceId: ctx.workspaceId, days: 7 },
          ctx,
        );

        const ws = data.workspaces?.[0];
        const cap = (n: number) => (n >= 50 ? "50+" : n);
        outputJson({
          workspace: ws
            ? {
                name: ws.name,
                description: ws.description,
                missionStatement: ws.missionStatement,
                onboardingStatus: ws.onboardingStatus,
              }
            : null,
          topGoals: (data.goalList ?? []).map(g => ({
            displayId: formatDisplayId("goal", g.displayId),
            title: g.title,
            importance: g.importance,
          })),
          signalActivityLast7Days: (data.signalActivitySummary ?? []).flatMap(
            row =>
              row.source ? [{ source: row.source, count: row.count ?? 0 }] : [],
          ),
          chainHealth: data.chainHealth ?? null,
          openActionCount: cap(data.openActions?.length ?? 0),
          pendingDecisionBriefCount: cap(data.pendingBriefs?.length ?? 0),
          link: appLink(opts.env, ctx.orgSlug, ctx.workspaceSlug),
        });
      } catch (error) {
        handleError(error);
      }
    });

  workspace
    .command("update")
    .description("Update the current workspace")
    .option("--name <name>", "Workspace name")
    .option("--description <description>", "Workspace description")
    .option("--mission-statement <statement>", "Mission statement")
    .option("--logo-url <url>", "Logo URL (https:// or data URL)")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const localOpts = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);

        const data = await execute(
          CliUpdateWorkspaceDocument,
          {
            where: { id: { eq: ctx.workspaceId } },
            update: omitUndefined({
              name: localOpts.name,
              description: localOpts.description,
              missionStatement: localOpts.missionStatement,
              logoUrl: localOpts.logoUrl,
            }),
          },
          ctx,
        );

        const updated = data.updateWorkspaces?.workspaces?.[0];
        outputJson({
          message: "Workspace updated",
          workspace: updated ?? null,
        });
      } catch (error) {
        handleError(error);
      }
    });

  workspace
    .command("members")
    .description("List people in the current organisation with their user IDs")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const data = await execute(CliOrgMemberListDocument, {}, ctx);

        const rows = (data.orgMemberList ?? []).map(m => ({
          userId: m.userId,
          name: m.displayName ?? m.email,
          email: m.email,
        }));
        output(rows, opts.format, ["userId", "name", "email"]);
      } catch (error) {
        handleError(error);
      }
    });
}
