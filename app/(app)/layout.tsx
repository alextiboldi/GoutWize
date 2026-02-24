import { BottomNav } from "@/components/app/bottom-nav";
import { FlareButton } from "@/components/app/flare-button";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gw-bg-light">
      {/* Top safe area for mobile notch */}
      <div className="h-[env(safe-area-inset-top)]" />

      {/* Scrollable content area */}
      <main className="max-w-md mx-auto px-4 pb-36 pt-4">
        {children}
      </main>

      {/* Floating flare button */}
      <FlareButton />

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}
