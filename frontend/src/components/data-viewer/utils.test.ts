import { describe, expect, test } from "bun:test";
import { toJsonSafe } from "./utils";

describe("toJsonSafe", () => {
  test("converts BigInt to Number", () => {
    const input = { id: 123n, name: "test" };
    const output = toJsonSafe(input);
    expect(output.id).toBe(123);
    expect(typeof output.id).toBe("number");
  });

  test("handles nested objects", () => {
    const input = { data: { id: 123n } };
    const output = toJsonSafe(input);
    expect(output.data.id).toBe(123);
  });

  test("handles arrays", () => {
    const input = [1n, 2n, 3n];
    const output = toJsonSafe(input);
    expect(output).toEqual([1, 2, 3]);
  });

  test("handles null and undefined", () => {
    expect(toJsonSafe(null)).toBeNull();
    expect(toJsonSafe(undefined)).toBeUndefined();
  });
});
