"use client";

import Link from "next/link";
import { Flame } from "lucide-react";

export function FlareButton() {
  return (
    <Link
      href="/flare"
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-gw-orange to-red-500 text-white shadow-lg shadow-gw-orange/40 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 animate-pulse-subtle"
      aria-label="Log a flare"
    >
      <Flame className="w-6 h-6" />
    </Link>
  );
}
