import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastContainer } from "@/components/app/toast-container";
import { useToastStore } from "@/lib/toast-store";

describe("ToastContainer", () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it("renders nothing when toasts array is empty", () => {
    const { container } = render(<ToastContainer />);
    expect(container.innerHTML).toBe("");
  });

  it("renders toast messages when store has toasts", () => {
    useToastStore.setState({
      toasts: [
        { id: 1, message: "Saved!" },
        { id: 2, message: "Posted!" },
      ],
    });

    render(<ToastContainer />);
    expect(screen.getByText("Saved!")).toBeInTheDocument();
    expect(screen.getByText("Posted!")).toBeInTheDocument();
  });

  it("dismiss button calls remove(id)", async () => {
    const user = userEvent.setup();
    useToastStore.setState({
      toasts: [{ id: 42, message: "Dismiss me" }],
    });

    render(<ToastContainer />);
    expect(screen.getByText("Dismiss me")).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);

    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});
