import { describe, it, expect } from "vitest";
import { cn, timeAgo } from "@/lib/utils";

describe("cn", () => {
  it("merges multiple class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("resolves conflicting Tailwind classes", () => {
    expect(cn("px-4", "px-2")).toBe("px-2");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("handles undefined and null inputs", () => {
    expect(cn("base", undefined, null, "end")).toBe("base end");
  });
});

describe("timeAgo", () => {
  function ago(seconds: number): string {
    return new Date(Date.now() - seconds * 1000).toISOString();
  }

  it('returns "just now" for < 60 seconds', () => {
    expect(timeAgo(ago(0))).toBe("just now");
    expect(timeAgo(ago(30))).toBe("just now");
    expect(timeAgo(ago(59))).toBe("just now");
  });

  it('returns "Xm ago" for < 60 minutes', () => {
    expect(timeAgo(ago(60))).toBe("1m ago");
    expect(timeAgo(ago(5 * 60))).toBe("5m ago");
    expect(timeAgo(ago(59 * 60))).toBe("59m ago");
  });

  it('returns "Xh ago" for < 24 hours', () => {
    expect(timeAgo(ago(60 * 60))).toBe("1h ago");
    expect(timeAgo(ago(12 * 60 * 60))).toBe("12h ago");
    expect(timeAgo(ago(23 * 60 * 60))).toBe("23h ago");
  });

  it('returns "yesterday" for 1 day', () => {
    expect(timeAgo(ago(24 * 60 * 60))).toBe("yesterday");
    expect(timeAgo(ago(47 * 60 * 60))).toBe("yesterday");
  });

  it('returns "Xd ago" for 2-6 days', () => {
    expect(timeAgo(ago(2 * 24 * 60 * 60))).toBe("2d ago");
    expect(timeAgo(ago(6 * 24 * 60 * 60))).toBe("6d ago");
  });

  it('returns "Xw ago" for 7-29 days', () => {
    expect(timeAgo(ago(7 * 24 * 60 * 60))).toBe("1w ago");
    expect(timeAgo(ago(14 * 24 * 60 * 60))).toBe("2w ago");
    expect(timeAgo(ago(29 * 24 * 60 * 60))).toBe("4w ago");
  });

  it("returns locale date for >= 30 days", () => {
    const date = ago(31 * 24 * 60 * 60);
    const result = timeAgo(date);
    // Should be a locale date string, not a relative format
    expect(result).not.toContain("ago");
    expect(result).not.toBe("just now");
    expect(result).not.toBe("yesterday");
  });
});
