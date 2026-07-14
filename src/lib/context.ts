import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { CliWorkspaceDirectoryDocument } from "../gql/graphql.js";
import { exchangeToken } from "./auth/exchange.js";
import { refreshOAuthSession } from "./auth/oauth.js";
import {
  getCachedJwt,
  getOAuthSession,
  isExpired,
  saveJwt,
} from "./auth/token-store.js";
import type { Environment } from "./config.js";
import { AuthError } from "./errors.js";
import { type ApiContext, execute } from "./graphql/execute.js";

export interface WorkspaceSelection {
  /** PropelAuth org ID — the org the service JWT is minted against. */
  orgId: string;
  workspaceId: string;
  orgSlug: string;
  workspaceSlug: string;
}

export interface CommandContext extends ApiContext {
  orgId: string;
  orgSlug: string;
  workspaceSlug: string;
}

interface OrgInfo {
  id: string;
  name: string;
  slug: string;
}

interface WorkspaceInfo {
  id: string;
  name: string;
  slug: string;
  orgId: string;
  orgName: string;
  orgSlug: string;
}

export interface WorkspaceDirectory {
  orgs: OrgInfo[];
  workspaces: WorkspaceInfo[];
}

type WorkspaceStore = Partial<Record<Environment, WorkspaceSelection>>;

/* ── Selection persistence ─────────────────────────────────────────── */

function getConfigDir(): string {
  const xdgConfig = process.env.XDG_CONFIG_HOME;
  const base = xdgConfig || path.join(os.homedir(), ".config");
  return path.join(base, "squad");
}

function getWorkspacePath(): string {
  return path.join(getConfigDir(), "workspace.json");
}

function readStore(): WorkspaceStore {
  const wsPath = getWorkspacePath();
  if (!fs.existsSync(wsPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(wsPath, "utf8"));
  } catch {
    return {};
  }
}

export function getWorkspaceSelection(
  env: Environment,
): WorkspaceSelection | null {
  return readStore()[env] ?? null;
}

export function setWorkspaceSelection(
  env: Environment,
  selection: WorkspaceSelection,
): void {
  const dir = getConfigDir();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  const store = readStore();
  store[env] = selection;
  fs.writeFileSync(getWorkspacePath(), JSON.stringify(store, null, 2), {
    mode: 0o600,
  });
}

export function clearWorkspaceSelection(env: Environment): void {
  const store = readStore();
  if (!store[env]) return;
  delete store[env];
  fs.writeFileSync(getWorkspacePath(), JSON.stringify(store, null, 2), {
    mode: 0o600,
  });
}

/* ── Token resolution ──────────────────────────────────────────────── */

/** Ensure a usable opaque OAuth token, refreshing it when expired. */
async function resolveOpaqueToken(env: Environment): Promise<string> {
  const session = getOAuthSession(env);
  if (!session) throw new AuthError("Not logged in. Run: squad auth login");
  if (isExpired(session.expiresAt)) {
    return (await refreshOAuthSession(env)).accessToken;
  }
  return session.accessToken;
}

/**
 * Resolve a minted service JWT for an org, reusing the cached one until it is
 * about to expire, otherwise exchanging the opaque token for a fresh JWT.
 * Passing no org mints against the user's default/only org (used to bootstrap
 * the workspace directory before a selection exists).
 */
async function resolveJwt(
  env: Environment,
  orgId?: string,
): Promise<{ token: string; activeOrgId: string }> {
  if (orgId) {
    const cached = getCachedJwt(env, orgId);
    if (cached && !isExpired(cached.expiresAt)) {
      return { token: cached.token, activeOrgId: orgId };
    }
  }

  const opaque = await resolveOpaqueToken(env);
  const result = await exchangeToken(env, opaque, orgId);
  saveJwt(env, result.activeOrgId, {
    token: result.accessToken,
    expiresAt: result.expiresAt,
  });
  return { token: result.accessToken, activeOrgId: result.activeOrgId };
}

/**
 * Resolve the full command context (minted JWT + selected workspace). A raw
 * JWT via --token / SQUAD_TOKEN overrides the exchange for headless use.
 */
export async function resolveContext(
  env: Environment,
  tokenOverride?: string,
): Promise<CommandContext> {
  const selection = getWorkspaceSelection(env);
  if (!selection) {
    throw new AuthError(
      "No workspace selected. Run: squad workspace list, then: squad workspace select <orgId> <workspaceId>",
    );
  }

  const token =
    tokenOverride ??
    process.env.SQUAD_TOKEN ??
    (await resolveJwt(env, selection.orgId)).token;

  return {
    token,
    env,
    workspaceId: selection.workspaceId,
    orgId: selection.orgId,
    orgSlug: selection.orgSlug,
    workspaceSlug: selection.workspaceSlug,
  };
}

/* ── Workspace directory ───────────────────────────────────────────── */

/**
 * Fetch every org and workspace the user can access in one query. The
 * workspaces query spans all accessible orgs, so a JWT minted for any one org
 * is sufficient.
 */
export async function fetchWorkspaceDirectory(
  env: Environment,
  orgId?: string,
): Promise<WorkspaceDirectory> {
  const { token } = await resolveJwt(env, orgId);
  const data = await execute(
    CliWorkspaceDirectoryDocument,
    {},
    { token, workspaceId: "", env },
  );

  const orgByInternalId = new Map<string, OrgInfo>();
  for (const org of data.organisations ?? []) {
    if (org.id && org.propelAuthOrgId) {
      orgByInternalId.set(org.id, {
        id: org.propelAuthOrgId,
        name: org.name ?? "Unnamed organisation",
        slug: org.slug ?? "",
      });
    }
  }

  const workspaces: WorkspaceInfo[] = [];
  for (const ws of data.workspaces ?? []) {
    if (!ws.id) continue;
    const org = ws.organisationId
      ? orgByInternalId.get(ws.organisationId)
      : undefined;
    if (!org) continue;
    workspaces.push({
      id: ws.id,
      name: ws.name ?? "Unnamed workspace",
      slug: ws.slug ?? ws.id,
      orgId: org.id,
      orgName: org.name,
      orgSlug: org.slug,
    });
  }

  return { orgs: Array.from(orgByInternalId.values()), workspaces };
}

/**
 * After login, persist a selection automatically when the user has exactly
 * one workspace. Returns the chosen selection, or the directory to choose
 * from when selection is required.
 */
export async function autoSelectWorkspace(
  env: Environment,
): Promise<
  | { selected: WorkspaceSelection }
  | { selected: null; directory: WorkspaceDirectory }
> {
  const directory = await fetchWorkspaceDirectory(env);
  if (directory.workspaces.length === 1) {
    const ws = directory.workspaces[0];
    const selection: WorkspaceSelection = {
      orgId: ws.orgId,
      workspaceId: ws.id,
      orgSlug: ws.orgSlug,
      workspaceSlug: ws.slug,
    };
    setWorkspaceSelection(env, selection);
    return { selected: selection };
  }
  return { selected: null, directory };
}
