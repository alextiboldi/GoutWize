import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PostCard } from "@/components/app/post-card";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/feed",
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  }),
}));

const defaultProps = {
  id: "post-1",
  title: "Test Post Title",
  body: "This is the body of the test post.",
  category: "general",
  authorUsername: "testuser",
  createdAt: new Date().toISOString(),
  commentCount: 3,
  upvotes: 12,
  hasVoted: false,
};

describe("PostCard", () => {
  it("renders post title", () => {
    render(<PostCard {...defaultProps} />);
    expect(screen.getByText("Test Post Title")).toBeInTheDocument();
  });

  it("renders category badge", () => {
    render(<PostCard {...defaultProps} />);
    expect(screen.getByText(/General/)).toBeInTheDocument();
  });

  it("renders author and comment count", () => {
    render(<PostCard {...defaultProps} />);
    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders timeAgo", () => {
    render(<PostCard {...defaultProps} />);
    expect(screen.getByText("just now")).toBeInTheDocument();
  });

  it("truncates body longer than 100 chars", () => {
    const longBody = "A".repeat(150);
    render(<PostCard {...defaultProps} body={longBody} />);
    const truncated = screen.getByText(/A+\u2026/);
    expect(truncated.textContent).toHaveLength(101); // 100 chars + ellipsis
  });

  it("does not truncate short body", () => {
    render(<PostCard {...defaultProps} body="Short body" />);
    expect(screen.getByText("Short body")).toBeInTheDocument();
  });

  it("click navigates to /post/[id]", async () => {
    const user = userEvent.setup();
    render(<PostCard {...defaultProps} />);

    const card = screen.getByRole("link");
    await user.click(card);

    expect(mockPush).toHaveBeenCalledWith("/post/post-1");
  });
});
