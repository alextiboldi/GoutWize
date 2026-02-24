"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PenSquare, ClipboardCheck, User } from "lucide-react";

const TABS = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/post/new", label: "Post", icon: PenSquare },
  { href: "/checkin", label: "Log", icon: ClipboardCheck },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gw-border">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
        {TABS.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1 rounded-lg transition-colors ${
                isActive
                  ? "text-gw-blue"
                  : "text-gw-text-gray hover:text-gw-navy"
              }`}
            >
              <tab.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
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
