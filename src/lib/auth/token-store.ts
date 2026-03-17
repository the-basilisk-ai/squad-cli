import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { Environment } from "../config.js";

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp in seconds
}

export interface StoredClient {
  clientId: string;
}

type TokenStore = Partial<Record<Environment, StoredTokens>>;
type ClientStore = Partial<Record<Environment, StoredClient>>;

function getConfigDir(): string {
  const xdgConfig = process.env.XDG_CONFIG_HOME;
  const base = xdgConfig || path.join(os.homedir(), ".config");
  return path.join(base, "squad");
}

function getTokenPath(): string {
  return path.join(getConfigDir(), "auth.json");
}

function ensureConfigDir(): void {
  const dir = getConfigDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  }
}

function readStore(): TokenStore {
  const tokenPath = getTokenPath();
  if (!fs.existsSync(tokenPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(tokenPath, "utf8"));
  } catch {
    return {};
  }
}

function writeStore(store: TokenStore): void {
  ensureConfigDir();
  const tokenPath = getTokenPath();
  fs.writeFileSync(tokenPath, JSON.stringify(store, null, 2), { mode: 0o600 });
}

export function getTokens(env: Environment): StoredTokens | null {
  const store = readStore();
  return store[env] ?? null;
}

export function saveTokens(env: Environment, tokens: StoredTokens): void {
  const store = readStore();
  store[env] = tokens;
  writeStore(store);
}

export function clearTokens(env: Environment): void {
  const store = readStore();
  delete store[env];
  writeStore(store);
}

export function isTokenExpired(tokens: StoredTokens): boolean {
  // Consider expired 60 seconds early to avoid edge cases
  return Date.now() / 1000 >= tokens.expiresAt - 60;
}

function getClientPath(): string {
  return path.join(getConfigDir(), "client.json");
}

function readClientStore(): ClientStore {
  const clientPath = getClientPath();
  if (!fs.existsSync(clientPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(clientPath, "utf8"));
  } catch {
    return {};
  }
}

function writeClientStore(store: ClientStore): void {
  ensureConfigDir();
  fs.writeFileSync(getClientPath(), JSON.stringify(store, null, 2), {
    mode: 0o600,
  });
}

export function getStoredClient(env: Environment): StoredClient | null {
  return readClientStore()[env] ?? null;
}

export function saveClient(env: Environment, client: StoredClient): void {
  const store = readClientStore();
  store[env] = client;
  writeClientStore(store);
}
