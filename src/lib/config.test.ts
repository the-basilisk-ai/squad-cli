import { afterEach, describe, expect, it } from "vitest";
import {
  getPropelAuthUrl,
  getSquadApiUrl,
  getSquadAppUrl,
  getSquadGraphqlUrl,
} from "./config.js";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("config URL resolution", () => {
  it("resolves dev endpoints when env is dev", () => {
    expect(getSquadApiUrl("dev")).toBe("https://dev.api.v2.meetsquad.ai");
    expect(getSquadGraphqlUrl("dev")).toBe(
      "https://dev.api.v2.meetsquad.ai/graphql",
    );
    expect(getPropelAuthUrl("dev")).toBe("https://48820142.propelauthtest.com");
    expect(getSquadAppUrl("dev")).toBe("https://dev.v2.meetsquad.ai");
  });

  it("resolves production endpoints when env is production", () => {
    expect(getSquadApiUrl("production")).toBe("https://api.meetsquad.ai");
    expect(getSquadGraphqlUrl("production")).toBe(
      "https://api.meetsquad.ai/graphql",
    );
    expect(getPropelAuthUrl("production")).toBe("https://auth.meetsquad.ai");
  });

  it("defaults to production when no env is given", () => {
    delete process.env.SQUAD_GRAPHQL_URL;
    expect(getSquadApiUrl()).toBe("https://api.meetsquad.ai");
  });

  it("honours SQUAD_GRAPHQL_URL override", () => {
    process.env.SQUAD_GRAPHQL_URL = "http://localhost:4000/graphql";
    expect(getSquadGraphqlUrl("dev")).toBe("http://localhost:4000/graphql");
  });
});
