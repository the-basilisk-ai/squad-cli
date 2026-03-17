import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { refreshAccessToken } from "./auth/oauth.js";
import { getTokens, isTokenExpired } from "./auth/token-store.js";
import type { Environment } from "./config.js";
import { AuthError } from "./errors.js";

export interface WorkspaceSelection {
  orgId: string;
  workspaceId: string;
}

export interface CommandContext {
  token: string;
  env: Environment;
  orgId: string;
  workspaceId: string;
}

type WorkspaceStore = Partial<Record<Environment, WorkspaceSelection>>;

function getConfigDir(): string {
  const xdgConfig = process.env.XDG_CONFIG_HOME;
  const base = xdgConfig || path.join(os.homedir(), ".config");
  return path.join(base, "squad");
}

function getWorkspacePath(): string {
  return path.join(getConfigDir(), "workspace.json");
}

export function getWorkspaceSelection(
  env: Environment,
): WorkspaceSelection | null {
  const wsPath = getWorkspacePath();
  if (!fs.existsSync(wsPath)) return null;
  try {
    const store: WorkspaceStore = JSON.parse(fs.readFileSync(wsPath, "utf8"));
    return store[env] ?? null;
  } catch {
    return null;
  }
}

export function setWorkspaceSelection(
  env: Environment,
  selection: WorkspaceSelection,
): void {
  const dir = getConfigDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  }
  const wsPath = getWorkspacePath();
  let store: WorkspaceStore = {};
  if (fs.existsSync(wsPath)) {
    try {
      store = JSON.parse(fs.readFileSync(wsPath, "utf8"));
    } catch {
      // ignore
    }
  }
  store[env] = selection;
  fs.writeFileSync(wsPath, JSON.stringify(store, null, 2), { mode: 0o600 });
}

export function clearWorkspaceSelection(env: Environment): void {
  const wsPath = getWorkspacePath();
  if (!fs.existsSync(wsPath)) return;
  try {
    const store: WorkspaceStore = JSON.parse(fs.readFileSync(wsPath, "utf8"));
    delete store[env];
    fs.writeFileSync(wsPath, JSON.stringify(store, null, 2), { mode: 0o600 });
  } catch {
    // ignore
  }
}

/**
 * Resolve an access token from (in priority order):
 * 1. --token CLI flag
 * 2. SQUAD_TOKEN env var
 * 3. Stored token (auto-refreshing if expired)
 */
export async function resolveToken(
  env: Environment,
  tokenFlag?: string,
): Promise<string> {
  if (tokenFlag) return tokenFlag;

  const envToken = process.env.SQUAD_TOKEN;
  if (envToken) return envToken;

  const stored = getTokens(env);
  if (!stored) {
    throw new AuthError("Not logged in. Run: squad auth login");
  }

  if (isTokenExpired(stored)) {
    const refreshed = await refreshAccessToken(env, stored.refreshToken);
    return refreshed.accessToken;
  }

  return stored.accessToken;
}

/**
 * Resolve the full command context (token + workspace).
 * Used by commands that need both auth and a workspace selection.
 */
export async function resolveContext(
  env: Environment,
  tokenFlag?: string,
): Promise<CommandContext> {
  const token = await resolveToken(env, tokenFlag);
  const workspace = getWorkspaceSelection(env);

  if (!workspace) {
    throw new AuthError(
      "No workspace selected. Run: squad workspace list, then: squad workspace select <orgId> <workspaceId>",
    );
  }

  return { token, env, ...workspace };
}
