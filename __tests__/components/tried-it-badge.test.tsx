import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TriedItBadge } from "@/components/app/tried-it-badge";

describe("TriedItBadge", () => {
  it('renders "Worked" badge with green styling', () => {
    const { container } = render(<TriedItBadge value="worked" />);
    const badge = container.querySelector("span");
    expect(badge).toHaveTextContent("Tried it: Worked");
    expect(badge?.className).toContain("text-gw-green");
  });

  it('renders "Didn\'t work" badge', () => {
    const { container } = render(<TriedItBadge value="didnt_work" />);
    const badge = container.querySelector("span");
    expect(badge).toHaveTextContent("Tried it: Didn't work");
    expect(badge?.className).toContain("text-red-500");
  });

  it('renders "Mixed results" badge', () => {
    const { container } = render(<TriedItBadge value="mixed" />);
    const badge = container.querySelector("span");
    expect(badge).toHaveTextContent("Tried it: Mixed results");
    expect(badge?.className).toContain("text-amber-600");
  });

  it("returns null for invalid value", () => {
    const { container } = render(<TriedItBadge value="invalid" />);
    expect(container.innerHTML).toBe("");
  });
});
