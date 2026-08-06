import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins plain class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    expect(cn("a", undefined, null, false, "", "b")).toBe("a b");
  });

  it("supports conditional object and array syntax", () => {
    expect(cn(["a", { b: true, c: false }], ["d"])).toBe("a b d");
  });

  it("keeps the last conflicting tailwind utility", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm text-red-500", "text-blue-500")).toBe(
      "text-sm text-blue-500"
    );
  });

  it("keeps non conflicting tailwind utilities", () => {
    expect(cn("px-2", "py-4")).toBe("px-2 py-4");
  });

  it("returns an empty string with no input", () => {
    expect(cn()).toBe("");
  });
});
