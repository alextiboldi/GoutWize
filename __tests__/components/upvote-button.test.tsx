import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UpvoteButton } from "@/components/app/upvote-button";

const mockRpc = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    rpc: mockRpc,
  }),
}));

describe("UpvoteButton", () => {
  beforeEach(() => {
    mockRpc.mockReset();
  });

  it("renders initial count and not-voted state", () => {
    render(
      <UpvoteButton postId="1" initialUpvotes={5} initialVoted={false} />,
    );
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByLabelText("Upvote")).toBeInTheDocument();
  });

  it("renders voted state", () => {
    render(
      <UpvoteButton postId="1" initialUpvotes={10} initialVoted={true} />,
    );
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByLabelText("Remove upvote")).toBeInTheDocument();
  });

  it("click toggles voted state optimistically", async () => {
    const user = userEvent.setup();
    mockRpc.mockResolvedValue({
      data: { voted: true, upvotes: 6 },
      error: null,
    });

    render(
      <UpvoteButton postId="1" initialUpvotes={5} initialVoted={false} />,
    );
    const button = screen.getByRole("button");
    await user.click(button);

    // Optimistic: count goes up by 1
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("calls supabase.rpc with toggle_post_vote on click", async () => {
    const user = userEvent.setup();
    mockRpc.mockResolvedValue({
      data: { voted: true, upvotes: 6 },
      error: null,
    });

    render(
      <UpvoteButton postId="abc" initialUpvotes={5} initialVoted={false} />,
    );
    await user.click(screen.getByRole("button"));

    expect(mockRpc).toHaveBeenCalledWith("toggle_post_vote", {
      p_post_id: "abc",
    });
  });

  it("calls toggle_comment_vote when commentId is provided", async () => {
    const user = userEvent.setup();
    mockRpc.mockResolvedValue({
      data: { voted: true, upvotes: 3 },
      error: null,
    });

    render(
      <UpvoteButton commentId="c1" initialUpvotes={2} initialVoted={false} />,
    );
    await user.click(screen.getByRole("button"));

    expect(mockRpc).toHaveBeenCalledWith("toggle_comment_vote", {
      p_comment_id: "c1",
    });
  });

  it("stops event propagation on click", async () => {
    const user = userEvent.setup();
    const parentClick = vi.fn();
    mockRpc.mockResolvedValue({ data: null, error: null });

    render(
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div onClick={parentClick}>
        <UpvoteButton postId="1" initialUpvotes={5} initialVoted={false} />
      </div>,
    );
    await user.click(screen.getByRole("button"));

    expect(parentClick).not.toHaveBeenCalled();
  });
});
