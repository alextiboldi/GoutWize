"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PenSquare, ClipboardCheck, Bell, User } from "lucide-react";
import { useNotificationStore } from "@/lib/notification-store";

const TABS = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/post/new", label: "Post", icon: PenSquare },
  { href: "/checkin", label: "Log", icon: ClipboardCheck },
  { href: "/notifications", label: "Alerts", icon: Bell },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { unreadCount, fetchCount } = useNotificationStore();

  // Fetch unread count on mount and when navigating
  useEffect(() => {
    fetchCount();
  }, [pathname, fetchCount]);

  function handleTabClick(e: React.MouseEvent, href: string) {
    if (href === "/feed" && pathname === "/feed") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gw-border">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
        {TABS.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          const showBadge =
            tab.href === "/notifications" && unreadCount > 0;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={(e) => handleTabClick(e, tab.href)}
              className={`relative flex flex-col items-center justify-center gap-0.5 w-16 py-1 rounded-lg transition-colors ${
                isActive
                  ? "text-gw-blue"
                  : "text-gw-text-gray hover:text-gw-navy"
              }`}
            >
              <div className="relative">
                <tab.icon
                  className="w-5 h-5"
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {showBadge && (
                  <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
      {/* Bottom safe area for phones with home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
