import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import type { ActionStatus } from "../gql/graphql.js";
import {
  CliActionContextDocument,
  CliAssignActionDocument,
  CliDismissActionDocument,
  CliGetActionDocument,
  CliGetInsightDocument,
  CliGetOnePagerDocument,
  CliLinkActionDocument,
  CliListActionsDocument,
  CliListActionsForInsightDocument,
  CliMarkActionDoneDocument,
  CliSnoozeActionDocument,
  CliStartActionDocument,
  CliUpdateActionMetaDocument,
  CliUpdateActionNotesDocument,
} from "../gql/graphql.js";
import { resolveContext } from "../lib/context.js";
import { formatDisplayId } from "../lib/display-id.js";
import { handleError } from "../lib/errors.js";
import type { ApiContext } from "../lib/graphql/execute.js";
import { execute } from "../lib/graphql/execute.js";
import {
  clampLimit,
  omitUndefined,
  output,
  outputJson,
  parseOffset,
} from "../lib/output.js";

const CONTEXT_EVIDENCE_CAP = 8;

function splitCsv(value?: string): string[] | undefined {
  return value
    ? value
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)
    : undefined;
}

/** Decode the `user_id`/`sub` claim from the minted JWT for --assignee me. */
function currentUserId(token: string): string | undefined {
  const payload = token.split(".")[1];
  if (!payload) return undefined;
  try {
    const json = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { user_id?: string; sub?: string };
    return json.user_id ?? json.sub;
  } catch {
    return undefined;
  }
}

export function registerActionCommands(program: Command) {
  const action = program
    .command("action")
    .description("Work the action queue (what the evidence says to do next)");

  action
    .command("list")
    .description(
      "Ranked actions filtered by status, assignee, priority or insight",
    )
    .option(
      "--statuses <list>",
      "Comma-separated: suggested,in_progress,completed,dismissed",
    )
    .option("--assignee <who>", 'User ID, or "me" for the authenticated user')
    .option(
      "--insight <insightId>",
      "Scope to one insight's actions (IN-N or UUID)",
    )
    .option("--priority <list>", "Comma-separated: P0,P1,P2")
    .option("--include-snoozed", "Include snoozed actions")
    .option("--limit <n>", "Max results (default 25, max 100)")
    .option("--offset <n>", "Pagination offset")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const o = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);
        const statuses = (splitCsv(o.statuses) ?? [
          "suggested",
          "in_progress",
        ]) as ActionStatus[];

        const rows = o.insight
          ? ((
              await execute(
                CliListActionsForInsightDocument,
                {
                  insightId: o.insight,
                  limit: clampLimit(o.limit),
                  offset: parseOffset(o.offset),
                  status: statuses,
                  includeSnoozed: o.includeSnoozed,
                },
                ctx,
              )
            ).actionList ?? [])
          : ((
              await execute(
                CliListActionsDocument,
                {
                  limit: clampLimit(o.limit),
                  offset: parseOffset(o.offset),
                  statuses,
                  assigneeUserId:
                    o.assignee === "me" ? currentUserId(ctx.token) : o.assignee,
                  includeSnoozed: o.includeSnoozed,
                  priority: splitCsv(o.priority),
                },
                ctx,
              )
            ).actions ?? []);

        output(
          rows.map(a => ({
            displayId: formatDisplayId("action", a.displayId) ?? a.id,
            title: a.title,
            status: a.status,
            priority: a.priority,
            effort: a.effort,
            assignee: a.assignee?.displayName ?? null,
            insight: formatDisplayId("insight", a.insight?.displayId),
          })),
          opts.format,
          ["displayId", "title", "status", "priority", "assignee"],
        );
      } catch (error) {
        handleError(error);
      }
    });

  action
    .command("context")
    .description(
      "Everything to execute an action in one call: the action, its insight, the evidence and the goals it serves",
    )
    .argument("<actionId>", "Action display ID (AC-N) or UUID")
    .action(async function (this: Command, actionId: string) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);
        const data = await execute(
          CliActionContextDocument,
          { id: actionId },
          ctx,
        );
        const a = data.action;
        if (!a) throw new Error(`Action "${actionId}" not found.`);

        const signals = a.insight?.signals ?? [];
        outputJson({
          action: {
            displayId: formatDisplayId("action", a.displayId) ?? a.id,
            title: a.title,
            status: a.status,
            priority: a.priority,
            category: a.category,
            effort: a.effort,
            body: a.body,
            rationale: a.rationale,
            notes: a.notes,
            assignee: a.assignee?.displayName ?? null,
            dueAt: a.dueAt,
          },
          why: a.insight
            ? {
                insight:
                  formatDisplayId("insight", a.insight.displayId) ??
                  a.insight.id,
                title: a.insight.title,
                description: a.insight.description,
                category: a.insight.category,
                combinedScore: a.insight.combinedScore,
                totalEvidence: a.insight.evidenceCount,
              }
            : null,
          evidence: signals.slice(0, CONTEXT_EVIDENCE_CAP).map(s => ({
            displayId: formatDisplayId("signal", s.displayId) ?? s.id,
            quote: s.contentSummary ?? s.content,
            source: s.source,
            sourceUrl: s.externalSource?.sourceUri ?? null,
            capturedAt: s.createdAt,
          })),
          strategy: (a.insight?.goals ?? []).map(g => ({
            displayId: formatDisplayId("goal", g.displayId) ?? g.id,
            title: g.title,
            importance: g.importance,
          })),
        });
      } catch (error) {
        handleError(error);
      }
    });

  action
    .command("status")
    .description(
      "Move an action through its lifecycle, optionally appending a note",
    )
    .argument("<actionId>", "Action display ID (AC-N) or UUID")
    .argument("<status>", "start | complete | dismiss | snooze")
    .option("--note <note>", "Note appended to the action")
    .action(async function (this: Command, actionId: string, status: string) {
      try {
        const opts = getGlobalOptions(this);
        const ctx = await resolveContext(opts.env, opts.token);

        const found = await execute(
          CliGetActionDocument,
          { id: actionId },
          ctx,
        );
        const a = found.action;
        if (!a?.id) throw new Error(`Action "${actionId}" not found.`);

        switch (status) {
          case "start":
            await execute(CliStartActionDocument, { id: a.id }, ctx);
            break;
          case "complete":
            await execute(CliMarkActionDoneDocument, { id: a.id }, ctx);
            break;
          case "dismiss":
            await execute(CliDismissActionDocument, { actionId: a.id }, ctx);
            break;
          case "snooze":
            await execute(CliSnoozeActionDocument, { actionId: a.id }, ctx);
            break;
          default:
            throw new Error(
              `Unknown status "${status}". Use start, complete, dismiss or snooze.`,
            );
        }

        const note = this.opts().note as string | undefined;
        if (note) {
          const combined = a.notes ? `${a.notes}\n${note}` : note;
          await execute(
            CliUpdateActionNotesDocument,
            { actionId: a.id, notes: combined },
            ctx,
          );
        }

        outputJson({
          message: `Action ${status}`,
          displayId: formatDisplayId("action", a.displayId) ?? actionId,
        });
      } catch (error) {
        handleError(error);
      }
    });

  action
    .command("update")
    .description(
      "Edit an action's priority/effort/category/notes, assign it, or link it",
    )
    .argument("<actionId>", "Action display ID (AC-N) or UUID")
    .option("--priority <priority>", "P0, P1 or P2")
    .option("--effort <effort>", "low, medium or high")
    .option(
      "--category <category>",
      "comms, operational, product, strategic or workspace",
    )
    .option("--notes <notes>", "Replace the notes field")
    .option("--assignee <who>", 'User ID, "me", or "none" to unassign')
    .option("--link-insight <insightId>", "Link to an insight (IN-N or UUID)")
    .option(
      "--link-one-pager <onePagerId>",
      "Link to a decision brief (OP-N or UUID)",
    )
    .action(async function (this: Command, actionId: string) {
      try {
        const opts = getGlobalOptions(this);
        const o = this.opts();
        const fields = [
          o.priority,
          o.effort,
          o.category,
          o.notes,
          o.assignee,
          o.linkInsight,
          o.linkOnePager,
        ];
        if (fields.every(f => f === undefined)) {
          throw new Error("Provide at least one field to update.");
        }
        const ctx = await resolveContext(opts.env, opts.token);

        const found = await execute(
          CliGetActionDocument,
          { id: actionId },
          ctx,
        );
        const a = found.action;
        if (!a?.id) throw new Error(`Action "${actionId}" not found.`);

        const changes: string[] = [];
        if (o.priority || o.effort || o.category) {
          await execute(
            CliUpdateActionMetaDocument,
            {
              actionId: a.id,
              input: omitUndefined({
                priority: o.priority,
                effort: o.effort,
                category: o.category,
              }),
            },
            ctx,
          );
          changes.push("metadata updated");
        }
        if (o.notes !== undefined) {
          await execute(
            CliUpdateActionNotesDocument,
            { actionId: a.id, notes: o.notes },
            ctx,
          );
          changes.push("notes replaced");
        }
        if (o.assignee !== undefined) {
          const assigneeUserId =
            o.assignee === "none" || o.assignee === ""
              ? null
              : o.assignee === "me"
                ? currentUserId(ctx.token)
                : o.assignee;
          await execute(
            CliAssignActionDocument,
            { actionId: a.id, assigneeUserId },
            ctx,
          );
          changes.push(assigneeUserId ? "assigned" : "unassigned");
        }
        if (o.linkInsight || o.linkOnePager) {
          const target = await resolveLinkTarget(
            o.linkInsight,
            o.linkOnePager,
            ctx,
          );
          await execute(CliLinkActionDocument, { actionId: a.id, target }, ctx);
          changes.push("linked");
        }

        outputJson({
          message: "Action updated",
          displayId: formatDisplayId("action", a.displayId) ?? actionId,
          changes,
        });
      } catch (error) {
        handleError(error);
      }
    });
}

async function resolveLinkTarget(
  insightId: string | undefined,
  onePagerId: string | undefined,
  ctx: ApiContext,
): Promise<{ insightId?: string; onePagerId?: string }> {
  if (insightId) {
    const data = await execute(
      CliGetInsightDocument,
      { id: insightId, withEvidence: false },
      ctx,
    );
    if (!data.insight?.id) throw new Error(`Insight "${insightId}" not found.`);
    return { insightId: data.insight.id };
  }
  if (onePagerId) {
    const data = await execute(
      CliGetOnePagerDocument,
      { displayId: onePagerId },
      ctx,
    );
    if (!data.onePager?.id)
      throw new Error(`Decision brief "${onePagerId}" not found.`);
    return { onePagerId: data.onePager.id };
  }
  return {};
}
