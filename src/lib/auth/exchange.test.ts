import { afterEach, describe, expect, it, vi } from "vitest";
import { exchangeToken } from "./exchange.js";

afterEach(() => {
  vi.restoreAllMocks();
});

/** A minimal Response stub — the one cast expresses "this is a partial mock". */
function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

/** Stub global fetch, typed as fetch so mock.calls are correctly typed. */
function stubFetch(status: number, body: unknown) {
  const mock = vi
    .fn<typeof fetch>()
    .mockResolvedValue(jsonResponse(status, body));
  vi.stubGlobal("fetch", mock);
  return mock;
}

describe("exchangeToken", () => {
  it("returns the minted JWT and derives expiry from expires_in", async () => {
    stubFetch(200, {
      access_token: "jwt",
      token_type: "Bearer",
      expires_in: 3600,
      active_org_id: "org_9",
    });
    const before = Math.floor(Date.now() / 1000);
    const result = await exchangeToken("dev", "opaque", "org_9");
    expect(result.accessToken).toBe("jwt");
    expect(result.activeOrgId).toBe("org_9");
    expect(result.expiresAt).toBeGreaterThanOrEqual(before + 3600);
  });

  it("posts the target org id and bearer token", async () => {
    const fetchMock = stubFetch(200, {
      access_token: "jwt",
      token_type: "Bearer",
      expires_in: 60,
      active_org_id: "org_1",
    });
    await exchangeToken("dev", "opaque", "org_1");

    const [, init] = fetchMock.mock.calls[0];
    expect(JSON.parse(String(init?.body))).toEqual({ org_id: "org_1" });
    expect(new Headers(init?.headers).get("authorization")).toBe(
      "Bearer opaque",
    );
  });

  it("throws an AuthError carrying the server error message", async () => {
    stubFetch(403, { error: "Organisation not accessible" });
    await expect(exchangeToken("dev", "opaque", "org_x")).rejects.toThrow(
      "Organisation not accessible",
    );
  });
});
