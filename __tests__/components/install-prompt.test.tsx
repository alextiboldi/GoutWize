import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InstallPrompt } from "@/components/app/install-prompt";

describe("InstallPrompt", () => {
  let matchMediaMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    localStorage.clear();

    matchMediaMock = vi.fn().mockReturnValue({ matches: false });
    window.matchMedia = matchMediaMock as unknown as typeof window.matchMedia;

    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 Chrome/120",
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, "platform", {
      value: "Win32",
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, "maxTouchPoints", {
      value: 0,
      writable: true,
      configurable: true,
    });
  });

  it("is hidden by default (no beforeinstallprompt event)", () => {
    const { container } = render(<InstallPrompt />);
    expect(container.querySelector("[class*=bg-gradient]")).toBeNull();
  });

  it("shows banner when beforeinstallprompt fires", async () => {
    render(<InstallPrompt />);

    // Fire the beforeinstallprompt event
    const event = new Event("beforeinstallprompt", {
      cancelable: true,
    });
    window.dispatchEvent(event);

    expect(
      await screen.findByText("Add GoutWize to your home screen"),
    ).toBeInTheDocument();
    expect(screen.getByText("Install app")).toBeInTheDocument();
  });

  it("shows iOS instructions when iOS Safari detected", () => {
    Object.defineProperty(navigator, "userAgent", {
      value:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605 Safari/605",
      configurable: true,
    });
    Object.defineProperty(navigator, "platform", {
      value: "iPhone",
      configurable: true,
    });

    render(<InstallPrompt />);

    expect(
      screen.getByText("Add GoutWize to your home screen"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Tap the share button, then/),
    ).toBeInTheDocument();
  });

  it("dismiss stores to localStorage and hides banner", async () => {
    const user = userEvent.setup();
    render(<InstallPrompt />);

    // Fire beforeinstallprompt to show the banner
    window.dispatchEvent(new Event("beforeinstallprompt"));
    await screen.findByText("Add GoutWize to your home screen");

    // Click dismiss
    const dismissButtons = screen.getAllByRole("button");
    const dismissBtn = dismissButtons.find(
      (btn) => !btn.textContent?.includes("Install"),
    )!;
    await user.click(dismissBtn);

    expect(localStorage.getItem("gw-install-dismissed")).toBe("1");
    expect(
      screen.queryByText("Add GoutWize to your home screen"),
    ).not.toBeInTheDocument();
  });

  it("hidden in standalone mode", () => {
    matchMediaMock.mockReturnValue({ matches: true });

    const { container } = render(<InstallPrompt />);
    expect(container.querySelector("[class*=bg-gradient]")).toBeNull();
  });

  it("hidden when previously dismissed", () => {
    localStorage.setItem("gw-install-dismissed", "1");

    render(<InstallPrompt />);
    window.dispatchEvent(new Event("beforeinstallprompt"));

    expect(
      screen.queryByText("Add GoutWize to your home screen"),
    ).not.toBeInTheDocument();
  });
});
