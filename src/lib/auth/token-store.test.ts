import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  clearAuth,
  getCachedJwt,
  getOAuthSession,
  getStoredClient,
  isExpired,
  saveClient,
  saveJwt,
  saveOAuthSession,
} from "./token-store.js";

let tmp: string;
const original = process.env.XDG_CONFIG_HOME;

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "squad-cli-test-"));
  process.env.XDG_CONFIG_HOME = tmp;
});

afterEach(() => {
  process.env.XDG_CONFIG_HOME = original;
  fs.rmSync(tmp, { recursive: true, force: true });
});

describe("token store", () => {
  it("round-trips an OAuth session per environment", () => {
    expect(getOAuthSession("dev")).toBeNull();
    saveOAuthSession("dev", {
      accessToken: "opaque",
      refreshToken: "r",
      expiresAt: 999,
    });
    expect(getOAuthSession("dev")?.accessToken).toBe("opaque");
    expect(getOAuthSession("production")).toBeNull();
  });

  it("caches minted JWTs per org without dropping the session", () => {
    saveOAuthSession("dev", { accessToken: "opaque", expiresAt: 999 });
    saveJwt("dev", "org_1", { token: "jwt1", expiresAt: 111 });
    saveJwt("dev", "org_2", { token: "jwt2", expiresAt: 222 });
    expect(getCachedJwt("dev", "org_1")?.token).toBe("jwt1");
    expect(getCachedJwt("dev", "org_2")?.token).toBe("jwt2");
    expect(getOAuthSession("dev")?.accessToken).toBe("opaque");
  });

  it("clears all auth for an environment", () => {
    saveOAuthSession("dev", { accessToken: "opaque", expiresAt: 999 });
    saveJwt("dev", "org_1", { token: "jwt1", expiresAt: 111 });
    clearAuth("dev");
    expect(getOAuthSession("dev")).toBeNull();
    expect(getCachedJwt("dev", "org_1")).toBeNull();
  });

  it("stores the dynamically-registered client id", () => {
    saveClient("dev", { clientId: "abc" });
    expect(getStoredClient("dev")?.clientId).toBe("abc");
  });

  it("treats tokens within the 60s skew as expired", () => {
    const now = Math.floor(Date.now() / 1000);
    expect(isExpired(now + 30)).toBe(true);
    expect(isExpired(now + 3600)).toBe(false);
  });
});
