import { describe, it, expect } from "vitest";
import { seedInsights, reliefTips, getRandomInsights } from "@/lib/seed-data";

describe("seedInsights", () => {
  it("has 10 entries", () => {
    expect(seedInsights).toHaveLength(10);
  });

  it("each entry has icon, stat, text, and source", () => {
    for (const insight of seedInsights) {
      expect(insight).toHaveProperty("icon");
      expect(insight).toHaveProperty("stat");
      expect(insight).toHaveProperty("text");
      expect(insight).toHaveProperty("source");
      expect(typeof insight.icon).toBe("string");
      expect(typeof insight.stat).toBe("string");
      expect(typeof insight.text).toBe("string");
      expect(typeof insight.source).toBe("string");
    }
  });
});

describe("reliefTips", () => {
  it("has 6 entries", () => {
    expect(reliefTips).toHaveLength(6);
  });

  it("each entry has icon, tip, helpfulPct, and memberCount", () => {
    for (const tip of reliefTips) {
      expect(tip).toHaveProperty("icon");
      expect(tip).toHaveProperty("tip");
      expect(tip).toHaveProperty("helpfulPct");
      expect(tip).toHaveProperty("memberCount");
      expect(typeof tip.icon).toBe("string");
      expect(typeof tip.tip).toBe("string");
      expect(typeof tip.helpfulPct).toBe("number");
      expect(typeof tip.memberCount).toBe("number");
    }
  });
});

describe("getRandomInsights", () => {
  it("returns 3 items by default", () => {
    const result = getRandomInsights();
    expect(result).toHaveLength(3);
  });

  it("returns the requested count", () => {
    expect(getRandomInsights(1)).toHaveLength(1);
    expect(getRandomInsights(5)).toHaveLength(5);
  });

  it("returns items that are a subset of seedInsights", () => {
    const result = getRandomInsights(3);
    for (const item of result) {
      expect(seedInsights).toContainEqual(item);
    }
  });

  it("returns unique items (no duplicates)", () => {
    const result = getRandomInsights(5);
    const texts = result.map((r) => r.text);
    expect(new Set(texts).size).toBe(texts.length);
  });
});
