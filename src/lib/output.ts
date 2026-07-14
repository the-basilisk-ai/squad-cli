const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

/** Clamp a user-supplied --limit to [1, 100], defaulting to 25. */
export function clampLimit(value?: string | number): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return DEFAULT_LIMIT;
  return Math.min(Math.floor(n), MAX_LIMIT);
}

/** Parse a --offset into a non-negative integer (default 0). */
export function parseOffset(value?: string | number): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

/** Strip undefined values so PATCH payloads only include fields the user set. */
export function omitUndefined<T extends Record<string, unknown>>(
  obj: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined),
  ) as Partial<T>;
}

export function outputJson(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}

function outputTable(
  items: Record<string, unknown>[],
  columns: string[],
): void {
  if (items.length === 0) {
    console.log("No results.");
    return;
  }

  const widths = columns.map(col =>
    Math.max(col.length, ...items.map(item => String(item[col] ?? "").length)),
  );

  const header = columns.map((col, i) => col.padEnd(widths[i])).join("  ");
  const separator = widths.map(w => "-".repeat(w)).join("  ");

  console.log(header);
  console.log(separator);
  for (const item of items) {
    const row = columns
      .map((col, i) => String(item[col] ?? "").padEnd(widths[i]))
      .join("  ");
    console.log(row);
  }
}

export function output(
  data: unknown,
  format: string,
  tableColumns?: string[],
): void {
  if (format === "table" && Array.isArray(data) && tableColumns) {
    outputTable(data, tableColumns);
  } else {
    outputJson(data);
  }
}
