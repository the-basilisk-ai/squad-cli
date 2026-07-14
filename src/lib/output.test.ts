import { describe, expect, it } from "vitest";
import { clampLimit, omitUndefined, parseOffset } from "./output.js";

describe("clampLimit", () => {
  it("defaults to 25 for missing or invalid input", () => {
    expect(clampLimit(undefined)).toBe(25);
    expect(clampLimit("abc")).toBe(25);
    expect(clampLimit(0)).toBe(25);
  });

  it("caps at 100 and floors fractional values", () => {
    expect(clampLimit(250)).toBe(100);
    expect(clampLimit("40")).toBe(40);
    expect(clampLimit(12.9)).toBe(12);
  });
});

describe("parseOffset", () => {
  it("defaults to 0 for missing/negative input", () => {
    expect(parseOffset(undefined)).toBe(0);
    expect(parseOffset(-5)).toBe(0);
  });

  it("parses a valid offset", () => {
    expect(parseOffset("30")).toBe(30);
  });
});

describe("omitUndefined", () => {
  it("drops only undefined values", () => {
    expect(omitUndefined({ a: 1, b: undefined, c: null })).toEqual({
      a: 1,
      c: null,
    });
  });
});
