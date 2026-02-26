import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BottomNav } from "@/components/app/bottom-nav";

const mockPush = vi.fn();
let currentPathname = "/feed";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => currentPathname,
}));

describe("BottomNav", () => {
  beforeEach(() => {
    currentPathname = "/feed";
    mockPush.mockReset();
  });

  it("renders 4 navigation tabs", () => {
    render(<BottomNav />);
    expect(screen.getByText("Feed")).toBeInTheDocument();
    expect(screen.getByText("Post")).toBeInTheDocument();
    expect(screen.getByText("Log")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("highlights active tab based on current pathname", () => {
    currentPathname = "/profile";
    render(<BottomNav />);

    const profileLink = screen.getByText("Profile").closest("a");
    expect(profileLink?.className).toContain("text-gw-blue");

    const feedLink = screen.getByText("Feed").closest("a");
    expect(feedLink?.className).toContain("text-gw-text-gray");
  });

  it("Feed tab click when already on /feed scrolls to top", async () => {
    const user = userEvent.setup();
    const scrollToMock = vi.fn();
    window.scrollTo = scrollToMock;

    currentPathname = "/feed";
    render(<BottomNav />);

    const feedLink = screen.getByText("Feed").closest("a")!;
    await user.click(feedLink);

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  it("renders correct hrefs", () => {
    render(<BottomNav />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toEqual(["/feed", "/post/new", "/checkin", "/profile"]);
  });
});
