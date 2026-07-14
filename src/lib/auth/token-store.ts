import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { Environment } from "../config.js";

/** The opaque PropelAuth OAuth 2.1 session obtained from the login flow. */
export interface OAuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // Unix seconds
}

/** A minted service JWT for a single org, cached until it expires. */
export interface MintedJwt {
  token: string;
  expiresAt: number; // Unix seconds
}

interface EnvAuth {
  oauth?: OAuthSession;
  jwts?: Record<string, MintedJwt>;
}

interface StoredClient {
  clientId: string;
}

type AuthStore = Partial<Record<Environment, EnvAuth>>;
type ClientStore = Partial<Record<Environment, StoredClient>>;

function getConfigDir(): string {
  const xdgConfig = process.env.XDG_CONFIG_HOME;
  const base = xdgConfig || path.join(os.homedir(), ".config");
  return path.join(base, "squad");
}

function ensureConfigDir(): void {
  const dir = getConfigDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  }
}

function readJson<T>(file: string, fallback: T): T {
  const p = path.join(getConfigDir(), file);
  if (!fs.existsSync(p)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(file: string, data: unknown): void {
  ensureConfigDir();
  fs.writeFileSync(
    path.join(getConfigDir(), file),
    JSON.stringify(data, null, 2),
    { mode: 0o600 },
  );
}

export function isExpired(expiresAt: number): boolean {
  // Treat as expired 60s early to avoid edge cases mid-request.
  return Date.now() / 1000 >= expiresAt - 60;
}

/* ── OAuth session ─────────────────────────────────────────────────── */

export function getOAuthSession(env: Environment): OAuthSession | null {
  return readJson<AuthStore>("auth.json", {})[env]?.oauth ?? null;
}

export function saveOAuthSession(
  env: Environment,
  session: OAuthSession,
): void {
  const store = readJson<AuthStore>("auth.json", {});
  store[env] = { ...store[env], oauth: session };
  writeJson("auth.json", store);
}

export function clearAuth(env: Environment): void {
  const store = readJson<AuthStore>("auth.json", {});
  delete store[env];
  writeJson("auth.json", store);
}

/* ── Minted service JWT cache (per org) ────────────────────────────── */

export function getCachedJwt(
  env: Environment,
  orgId: string,
): MintedJwt | null {
  return readJson<AuthStore>("auth.json", {})[env]?.jwts?.[orgId] ?? null;
}

export function saveJwt(env: Environment, orgId: string, jwt: MintedJwt): void {
  const store = readJson<AuthStore>("auth.json", {});
  const envAuth = store[env] ?? {};
  envAuth.jwts = { ...envAuth.jwts, [orgId]: jwt };
  store[env] = envAuth;
  writeJson("auth.json", store);
}

/* ── Dynamically-registered OAuth client ───────────────────────────── */

export function getStoredClient(env: Environment): StoredClient | null {
  return readJson<ClientStore>("client.json", {})[env] ?? null;
}

export function saveClient(env: Environment, client: StoredClient): void {
  const store = readJson<ClientStore>("client.json", {});
  store[env] = client;
  writeJson("client.json", store);
}
