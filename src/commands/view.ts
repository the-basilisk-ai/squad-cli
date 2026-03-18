import type { Command } from "commander";
import { getGlobalOptions } from "../cli.js";
import { squadClient } from "../lib/clients/squad.js";
import { resolveContext } from "../lib/context.js";
import { handleError } from "../lib/errors.js";
import { outputJson } from "../lib/output.js";

const RESOLVED_STATUSES = new Set(["Complete", "Cancelled"]);
const HORIZON_ORDER = ["now", "next", "later"] as const;

export function registerViewCommands(program: Command) {
  const view = program
    .command("view")
    .description("View aggregated workspace data");

  view
    .command("strategy-context")
    .description(
      "View an entity in its strategy hierarchy (workspace → goal → opportunity → solution)",
    )
    .option("--type <type>", "Entity type", "workspace")
    .option("--id <id>", "Entity ID (not required for workspace)")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const localOpts = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);
        const { orgId, workspaceId } = ctx;

        const entityType: string = localOpts.type;
        const entityId: string | undefined = localOpts.id;

        if (entityType !== "workspace" && !entityId) {
          console.error(
            `Error: --id is required for entity type "${entityType}"`,
          );
          process.exit(1);
        }

        const data = await buildStrategyContext(
          client,
          orgId,
          workspaceId,
          entityType,
          entityId ?? workspaceId,
        );

        if (opts.format === "json") {
          outputJson(data);
        } else {
          printStrategyContext(data);
        }
      } catch (error) {
        await handleError(error);
      }
    });

  view
    .command("roadmap")
    .description(
      "View solutions organized by time horizon (Now / Next / Later)",
    )
    .option("--goal-id <id>", "Filter to solutions linked to this goal")
    .option("--status <statuses>", "Filter by statuses (comma-separated)")
    .option("--show-resolved", "Include completed/cancelled solutions")
    .action(async function (this: Command) {
      try {
        const opts = getGlobalOptions(this);
        const localOpts = this.opts();
        const ctx = await resolveContext(opts.env, opts.token);
        const client = squadClient(ctx.token, opts.env);
        const { orgId, workspaceId } = ctx;

        const [goalsResp, solutionsResp] = await Promise.all([
          client.listGoals({ orgId, workspaceId }),
          client.listSolutions({
            orgId,
            workspaceId,
            built: "true",
            relationships: "outcomes",
          }),
        ]);

        // Map solutions with goalId from outcomes
        let solutions = solutionsResp.data.map(
          (s: {
            id: string;
            title: string;
            status: string;
            horizon?: string;
            outcomes?: Array<{ id: string }>;
          }) => ({
            id: s.id,
            title: s.title,
            status: s.status,
            horizon: s.horizon,
            goalId: s.outcomes?.[0]?.id,
          }),
        );

        // Apply filters
        if (localOpts.goalId) {
          solutions = solutions.filter(
            (s: { goalId?: string }) => s.goalId === localOpts.goalId,
          );
        }
        if (localOpts.status) {
          const allowed = new Set(localOpts.status.split(","));
          solutions = solutions.filter((s: { status: string }) =>
            allowed.has(s.status),
          );
        }
        if (!localOpts.showResolved) {
          solutions = solutions.filter(
            (s: { status: string }) => !RESOLVED_STATUSES.has(s.status),
          );
        }

        // Group by horizon
        const groups = new Map<string, typeof solutions>();
        for (const s of solutions) {
          const h = s.horizon || "later";
          const bucket = groups.get(h) ?? [];
          bucket.push(s);
          groups.set(h, bucket);
        }

        const columns = HORIZON_ORDER.filter(h => groups.has(h)).map(h => ({
          horizon: h,
          solutions: (groups.get(h) ?? []).map(s => ({
            id: s.id,
            title: s.title,
            status: s.status,
            goalId: s.goalId,
          })),
        }));

        const goals = goalsResp.data
          .map(g => ({ id: g.id, title: g.title, priority: g.priority ?? 0 }))
          .sort((a, b) => b.priority - a.priority);

        const data = { goals, columns, totalSolutions: solutions.length };

        if (opts.format === "json") {
          outputJson(data);
        } else {
          printRoadmap(data);
        }
      } catch (error) {
        await handleError(error);
      }
    });
}

/* ─── Strategy context builder ─────────────────────────────────────── */

type EntityRef = { id: string; type: string; title: string; status?: string };

type StrategyContextData = {
  id: string;
  type: string;
  title: string;
  description?: string;
  status?: string;
  priority?: number;
  missionStatement?: string;
  workspace?: EntityRef;
  goal?: EntityRef;
  opportunity?: EntityRef;
  children?: EntityRef[];
};

async function buildStrategyContext(
  client: ReturnType<typeof squadClient>,
  orgId: string,
  workspaceId: string,
  entityType: string,
  entityId: string,
): Promise<StrategyContextData> {
  switch (entityType) {
    case "workspace": {
      const [wsResp, goalsResp] = await Promise.all([
        client.getWorkspace({ orgId, workspaceId }),
        client.listGoals({ orgId, workspaceId }),
      ]);
      const ws = wsResp.data;
      return {
        id: ws.id,
        type: "workspace",
        title: ws.name,
        description: ws.description,
        missionStatement: ws.missionStatement,
        children: goalsResp.data.map(g => ({
          id: g.id,
          type: "goal",
          title: g.title,
        })),
      };
    }
    case "goal": {
      const [wsNode, goalResp] = await Promise.all([
        fetchWorkspaceRef(client, orgId, workspaceId),
        client.getGoal({
          orgId,
          workspaceId,
          outcomeId: entityId,
          relationships: "opportunities",
        }),
      ]);
      const goal = goalResp.data;
      return {
        id: goal.id,
        type: "goal",
        title: goal.title,
        description: goal.description,
        priority: goal.priority,
        workspace: wsNode,
        children: (goal.opportunities || []).map(
          (o: { id: string; title: string; status?: string }) => ({
            id: o.id,
            type: "opportunity",
            title: o.title,
            status: o.status,
          }),
        ),
      };
    }
    case "opportunity": {
      const oppResp = await client.getOpportunity({
        orgId,
        workspaceId,
        opportunityId: entityId,
        relationships: "solutions,outcomes",
      });
      const opp = oppResp.data;
      const data: StrategyContextData = {
        id: opp.id,
        type: "opportunity",
        title: opp.title,
        description: opp.description,
        status: opp.status,
        workspace: await fetchWorkspaceRef(client, orgId, workspaceId),
        children: (opp.solutions || []).map(
          (s: { id: string; title: string; status?: string }) => ({
            id: s.id,
            type: "solution",
            title: s.title,
            status: s.status,
          }),
        ),
      };
      const parentGoal = opp.outcomes?.[0];
      if (parentGoal) {
        data.goal = await fetchGoalRef(
          client,
          orgId,
          workspaceId,
          parentGoal.id,
        );
      }
      return data;
    }
    case "solution": {
      const solResp = await client.getSolution({
        orgId,
        workspaceId,
        solutionId: entityId,
        relationships: "opportunities,outcomes",
      });
      const sol = solResp.data;
      const data: StrategyContextData = {
        id: sol.id,
        type: "solution",
        title: sol.title,
        description: sol.description,
        status: sol.status,
        workspace: await fetchWorkspaceRef(client, orgId, workspaceId),
      };
      const parentOpp = sol.opportunities?.[0];
      if (parentOpp) {
        const oppResp2 = await client.getOpportunity({
          orgId,
          workspaceId,
          opportunityId: parentOpp.id,
          relationships: "outcomes",
        });
        const opp2 = oppResp2.data;
        data.opportunity = {
          id: opp2.id,
          type: "opportunity",
          title: opp2.title,
          status: opp2.status,
        };
        const parentGoal = opp2.outcomes?.[0];
        if (parentGoal) {
          data.goal = await fetchGoalRef(
            client,
            orgId,
            workspaceId,
            parentGoal.id,
          );
        }
      } else {
        const parentGoal = sol.outcomes?.[0];
        if (parentGoal) {
          data.goal = await fetchGoalRef(
            client,
            orgId,
            workspaceId,
            parentGoal.id,
          );
        }
      }
      return data;
    }
    default:
      throw new Error(`Unsupported entity type: ${entityType}`);
  }
}

async function fetchWorkspaceRef(
  client: ReturnType<typeof squadClient>,
  orgId: string,
  workspaceId: string,
): Promise<EntityRef> {
  const ws = (await client.getWorkspace({ orgId, workspaceId })).data;
  return { id: ws.id, type: "workspace", title: ws.name };
}

async function fetchGoalRef(
  client: ReturnType<typeof squadClient>,
  orgId: string,
  workspaceId: string,
  goalId: string,
): Promise<EntityRef> {
  const goal = (await client.getGoal({ orgId, workspaceId, outcomeId: goalId }))
    .data;
  return { id: goal.id, type: "goal", title: goal.title };
}

/* ─── Table formatters ─────────────────────────────────────────────── */

function printStrategyContext(data: StrategyContextData) {
  // Build breadcrumb from parent refs
  const parts: string[] = [];
  if (data.workspace) parts.push(`workspace: ${data.workspace.title}`);
  if (data.goal) parts.push(`goal: ${data.goal.title}`);
  if (data.opportunity) parts.push(`opportunity: ${data.opportunity.title}`);
  parts.push(`${data.type}: ${data.title}`);
  console.log(parts.join(" → "));
  console.log();

  if (data.missionStatement) console.log(`Mission: ${data.missionStatement}`);
  if (data.description) console.log(`Description: ${data.description}`);
  if (data.status) console.log(`Status: ${data.status}`);
  if (data.priority != null) console.log(`Priority: ${data.priority}`);

  if (data.children && data.children.length > 0) {
    console.log();
    console.log(`Children (${data.children.length}):`);
    for (const c of data.children) {
      const status = c.status ? ` [${c.status}]` : "";
      console.log(`  - ${c.title}${status}`);
    }
  }
}

function printRoadmap(data: {
  goals: Array<{ id: string; title: string; priority: number }>;
  columns: Array<{
    horizon: string;
    solutions: Array<{
      id: string;
      title: string;
      status: string;
      goalId?: string;
    }>;
  }>;
  totalSolutions: number;
}) {
  const goalMap = new Map(data.goals.map(g => [g.id, g.title]));

  console.log(`Goals (${data.goals.length}):`);
  for (const g of data.goals) {
    console.log(`  P${g.priority} ${g.title}`);
  }

  console.log();
  console.log(`Solutions (${data.totalSolutions}):`);

  for (const col of data.columns) {
    console.log();
    console.log(`── ${col.horizon.toUpperCase()} ──`);
    for (const s of col.solutions) {
      const goal = s.goalId ? goalMap.get(s.goalId) : undefined;
      const goalLabel = goal ? ` (${goal})` : "";
      console.log(`  [${s.status}] ${s.title}${goalLabel}`);
    }
  }
}
