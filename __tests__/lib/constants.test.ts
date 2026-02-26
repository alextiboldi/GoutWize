import { describe, it, expect } from "vitest";
import {
  POST_CATEGORIES,
  FLARE_JOINTS,
  FLARE_STATUSES,
  TRIED_IT_OPTIONS,
  MOOD_OPTIONS,
  HYDRATION_OPTIONS,
  ALCOHOL_OPTIONS,
} from "@/lib/constants";
import type {
  PostCategory,
  FlareJoint,
  FlareStatus,
  TriedIt,
} from "@/lib/constants";

describe("POST_CATEGORIES", () => {
  it("has 6 entries", () => {
    expect(POST_CATEGORIES).toHaveLength(6);
  });

  it("each entry has value, label, and emoji", () => {
    for (const cat of POST_CATEGORIES) {
      expect(cat).toHaveProperty("value");
      expect(cat).toHaveProperty("label");
      expect(cat).toHaveProperty("emoji");
    }
  });

  it("includes expected category values", () => {
    const values = POST_CATEGORIES.map((c) => c.value);
    expect(values).toContain("general");
    expect(values).toContain("has_anyone_tried");
    expect(values).toContain("tip");
  });
});

describe("FLARE_JOINTS", () => {
  it("has 6 entries", () => {
    expect(FLARE_JOINTS).toHaveLength(6);
  });

  it("each entry has value, label, and emoji", () => {
    for (const joint of FLARE_JOINTS) {
      expect(joint).toHaveProperty("value");
      expect(joint).toHaveProperty("label");
      expect(joint).toHaveProperty("emoji");
    }
  });
});

describe("FLARE_STATUSES", () => {
  it("has 3 entries", () => {
    expect(FLARE_STATUSES).toHaveLength(3);
  });

  it("includes active, improving, resolved", () => {
    const values = FLARE_STATUSES.map((s) => s.value);
    expect(values).toEqual(["active", "improving", "resolved"]);
  });
});

describe("TRIED_IT_OPTIONS", () => {
  it("has 3 entries", () => {
    expect(TRIED_IT_OPTIONS).toHaveLength(3);
  });

  it("includes worked, didnt_work, mixed", () => {
    const values = TRIED_IT_OPTIONS.map((o) => o.value);
    expect(values).toEqual(["worked", "didnt_work", "mixed"]);
  });
});

describe("MOOD_OPTIONS", () => {
  it("has 3 entries", () => {
    expect(MOOD_OPTIONS).toHaveLength(3);
  });
});

describe("HYDRATION_OPTIONS", () => {
  it("has 3 entries", () => {
    expect(HYDRATION_OPTIONS).toHaveLength(3);
  });
});

describe("ALCOHOL_OPTIONS", () => {
  it("has 3 entries", () => {
    expect(ALCOHOL_OPTIONS).toHaveLength(3);
  });
});

describe("type exports", () => {
  it("PostCategory type resolves to valid values", () => {
    const val: PostCategory = "general";
    expect(val).toBe("general");
  });

  it("FlareJoint type resolves to valid values", () => {
    const val: FlareJoint = "big_toe";
    expect(val).toBe("big_toe");
  });

  it("FlareStatus type resolves to valid values", () => {
    const val: FlareStatus = "active";
    expect(val).toBe("active");
  });

  it("TriedIt type resolves to valid values", () => {
    const val: TriedIt = "worked";
    expect(val).toBe("worked");
  });
});
