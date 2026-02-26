import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useToastStore } from "@/lib/toast-store";

describe("useToastStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Reset store state between tests
    useToastStore.setState({ toasts: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with an empty toasts array", () => {
    expect(useToastStore.getState().toasts).toEqual([]);
  });

  it("add() creates a toast with incrementing id", () => {
    useToastStore.getState().add("First");
    useToastStore.getState().add("Second");
    const toasts = useToastStore.getState().toasts;
    expect(toasts).toHaveLength(2);
    expect(toasts[0].message).toBe("First");
    expect(toasts[1].message).toBe("Second");
    expect(toasts[1].id).toBeGreaterThan(toasts[0].id);
  });

  it("remove() removes a specific toast by id", () => {
    useToastStore.getState().add("To remove");
    useToastStore.getState().add("To keep");
    const toasts = useToastStore.getState().toasts;
    useToastStore.getState().remove(toasts[0].id);
    const remaining = useToastStore.getState().toasts;
    expect(remaining).toHaveLength(1);
    expect(remaining[0].message).toBe("To keep");
  });

  it("auto-dismisses after 3 seconds", () => {
    useToastStore.getState().add("Auto dismiss");
    expect(useToastStore.getState().toasts).toHaveLength(1);

    vi.advanceTimersByTime(2999);
    expect(useToastStore.getState().toasts).toHaveLength(1);

    vi.advanceTimersByTime(1);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it("stacks multiple toasts correctly", () => {
    useToastStore.getState().add("Toast A");
    vi.advanceTimersByTime(1000);
    useToastStore.getState().add("Toast B");
    vi.advanceTimersByTime(1000);
    useToastStore.getState().add("Toast C");

    expect(useToastStore.getState().toasts).toHaveLength(3);

    // Toast A auto-dismisses at 3000ms (1000 more from now)
    vi.advanceTimersByTime(1000);
    expect(useToastStore.getState().toasts).toHaveLength(2);

    // Toast B auto-dismisses at 4000ms (1000 more from now)
    vi.advanceTimersByTime(1000);
    expect(useToastStore.getState().toasts).toHaveLength(1);

    // Toast C auto-dismisses at 5000ms (1000 more from now)
    vi.advanceTimersByTime(1000);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});
