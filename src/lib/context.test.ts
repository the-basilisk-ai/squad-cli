import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const fetchAccessibleOrgs = vi.fn();
const exchangeToken = vi.fn();
const execute = vi.fn();
const getOAuthSession = vi.fn();
const getCachedJwt = vi.fn();
const saveJwt = vi.fn();
const isExpired = vi.fn();
const refreshOAuthSession = vi.fn();

vi.mock("./auth/exchange.js", () => ({ fetchAccessibleOrgs, exchangeToken }));
vi.mock("./auth/oauth.js", () => ({ refreshOAuthSession }));
vi.mock("./auth/token-store.js", () => ({
  getOAuthSession,
  getCachedJwt,
  saveJwt,
  isExpired,
}));
vi.mock("./graphql/execute.js", () => ({ execute }));

const { fetchWorkspaceDirectory, autoSelectWorkspace } = await import(
  "./context.js"
);

// One org-scoped query returns every org + workspace the user can access.
const directoryData = {
  organisations: [
    { id: "int-a", name: "Acme", slug: "acme", propelAuthOrgId: "org-a" },
    { id: "int-b", name: "Beta", slug: "beta", propelAuthOrgId: "org-b" },
  ],
  workspaces: [
    { id: "ws-1", name: "Main", slug: "main", organisationId: "int-a" },
    { id: "ws-2", name: "Side", slug: "side", organisationId: "int-b" },
  ],
};

const origXdg = process.env.XDG_CONFIG_HOME;

beforeEach(() => {
  vi.clearAllMocks();
  getOAuthSession.mockReturnValue({
    accessToken: "opaque",
    expiresAt: 9999999999,
  });
  isExpired.mockReturnValue(false);
  getCachedJwt.mockReturnValue(null);
  exchangeToken.mockResolvedValue({
    accessToken: "jwt",
    expiresAt: 9999999999,
    activeOrgId: "org-a",
  });
  fetchAccessibleOrgs.mockResolvedValue([
    { id: "org-a", name: "Acme", slug: "acme" },
    { id: "org-b", name: "Beta", slug: "beta" },
  ]);
  execute.mockResolvedValue(directoryData);
});

afterEach(() => {
  if (origXdg === undefined) delete process.env.XDG_CONFIG_HOME;
  else process.env.XDG_CONFIG_HOME = origXdg;
});

describe("fetchWorkspaceDirectory", () => {
  it("discovers a bootstrap org then reads the whole directory in one query", async () => {
    const dir = await fetchWorkspaceDirectory("dev");

    // The dedup fix: exactly one mint + one query, never per-org.
    expect(fetchAccessibleOrgs).toHaveBeenCalledTimes(1);
    expect(exchangeToken).toHaveBeenCalledTimes(1);
    expect(exchangeToken).toHaveBeenCalledWith("dev", "opaque", "org-a");
    expect(execute).toHaveBeenCalledTimes(1);

    expect(dir.orgs).toEqual([
      { id: "org-a", name: "Acme", slug: "acme" },
      { id: "org-b", name: "Beta", slug: "beta" },
    ]);
    expect(dir.workspaces).toEqual([
      {
        id: "ws-1",
        name: "Main",
        slug: "main",
        orgId: "org-a",
        orgName: "Acme",
        orgSlug: "acme",
      },
      {
        id: "ws-2",
        name: "Side",
        slug: "side",
        orgId: "org-b",
        orgName: "Beta",
        orgSlug: "beta",
      },
    ]);
  });

  it("scopes to a given org without hitting discovery", async () => {
    await fetchWorkspaceDirectory("dev", "org-b");
    expect(fetchAccessibleOrgs).not.toHaveBeenCalled();
    expect(exchangeToken).toHaveBeenCalledWith("dev", "opaque", "org-b");
    expect(execute).toHaveBeenCalledTimes(1);
  });

  it("returns empty when the user has no accessible orgs", async () => {
    fetchAccessibleOrgs.mockResolvedValue([]);
    const dir = await fetchWorkspaceDirectory("dev");
    expect(dir).toEqual({ orgs: [], workspaces: [] });
    expect(execute).not.toHaveBeenCalled();
  });
});

describe("autoSelectWorkspace", () => {
  it("returns the directory without selecting when multiple workspaces exist", async () => {
    const result = await autoSelectWorkspace("dev");
    expect(result.selected).toBeNull();
    if (!result.selected) {
      expect(result.directory.workspaces).toHaveLength(2);
    }
  });

  it("auto-selects and persists when exactly one workspace exists", async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "squad-cli-ctx-"));
    process.env.XDG_CONFIG_HOME = tmp;
    execute.mockResolvedValue({
      organisations: [
        { id: "int-a", name: "Acme", slug: "acme", propelAuthOrgId: "org-a" },
      ],
      workspaces: [
        { id: "ws-1", name: "Main", slug: "main", organisationId: "int-a" },
      ],
    });

    const result = await autoSelectWorkspace("dev");

    expect(result.selected).toEqual({
      orgId: "org-a",
      workspaceId: "ws-1",
      orgSlug: "acme",
      workspaceSlug: "main",
    });
    const stored = JSON.parse(
      fs.readFileSync(path.join(tmp, "squad", "workspace.json"), "utf8"),
    );
    expect(stored.dev.workspaceId).toBe("ws-1");
  });
});
