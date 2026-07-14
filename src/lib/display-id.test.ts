import { describe, expect, it } from "vitest";
import { formatDisplayId, parseEntityRef } from "./display-id.js";

describe("parseEntityRef", () => {
  it("parses a display ID into its entity type", () => {
    expect(parseEntityRef("AC-12")).toEqual({
      kind: "display",
      type: "action",
      displayId: 12,
      formatted: "AC-12",
    });
  });

  it("is case-insensitive on the prefix", () => {
    const ref = parseEntityRef("in-4");
    expect(ref).toMatchObject({ type: "insight", formatted: "IN-4" });
  });

  it("recognises a UUID", () => {
    const uuid = "3f2504e0-4f89-41d3-9a0c-0305e82c3301";
    expect(parseEntityRef(uuid)).toEqual({ kind: "uuid", id: uuid });
  });

  it("rejects an unknown prefix", () => {
    expect(() => parseEntityRef("ZZ-1")).toThrow();
  });

  it("rejects garbage", () => {
    expect(() => parseEntityRef("not-an-id!")).toThrow();
  });
});

describe("formatDisplayId", () => {
  it("formats a known type + number", () => {
    expect(formatDisplayId("goal", 7)).toBe("GL-7");
    expect(formatDisplayId("one_pager", 3)).toBe("OP-3");
  });

  it("returns undefined for null/undefined", () => {
    expect(formatDisplayId("signal", null)).toBeUndefined();
    expect(formatDisplayId("signal", undefined)).toBeUndefined();
  });
});
