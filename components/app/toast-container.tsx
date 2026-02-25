"use client";

import { useToastStore } from "@/lib/toast-store";
import { Check, X } from "lucide-react";

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-[env(safe-area-inset-top,0px)] left-0 right-0 z-50 flex flex-col items-center gap-2 p-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-2 bg-gw-navy text-white pl-3 pr-2 py-2.5 rounded-xl shadow-lg shadow-gw-navy/20 animate-in slide-in-from-top-2 fade-in duration-200 max-w-sm w-full"
        >
          <Check className="w-4 h-4 text-gw-green shrink-0" />
          <span className="text-sm font-medium flex-1">{toast.message}</span>
          <button
            onClick={() => remove(toast.id)}
            className="w-6 h-6 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
