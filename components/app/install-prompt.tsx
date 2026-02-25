"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

const DISMISSED_KEY = "gw-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    // Don't show if dismissed
    if (localStorage.getItem(DISMISSED_KEY)) return;

    // Detect iOS Safari
    const ua = navigator.userAgent;
    const isiOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|Chrome/.test(ua);

    if (isiOS && isSafari) {
      setIsIOS(true);
      setVisible(true);
      return;
    }

    // Android / Chrome — listen for beforeinstallprompt
    function handlePrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handlePrompt);
    return () =>
      window.removeEventListener("beforeinstallprompt", handlePrompt);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  async function handleInstall() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        dismiss();
      }
      setDeferredPrompt(null);
    }
  }

  if (!visible) return null;

  return (
    <div className="relative flex items-start gap-3 bg-gradient-to-r from-gw-blue/10 to-gw-green/10 rounded-2xl p-4 border border-gw-blue/20">
      <div className="w-10 h-10 bg-gw-blue/10 rounded-full flex items-center justify-center shrink-0">
        <Download className="w-5 h-5 text-gw-blue" />
      </div>
      <div className="flex-1 min-w-0 pr-6">
        <p className="font-semibold text-sm text-gw-navy">
          Add GoutWize to your home screen
        </p>
        {isIOS ? (
          <p className="text-xs text-gw-text-gray mt-0.5">
            Tap the share button, then &quot;Add to Home Screen&quot;
          </p>
        ) : deferredPrompt ? (
          <button
            onClick={handleInstall}
            className="mt-2 bg-gw-blue text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-gw-blue-dark transition-colors"
          >
            Install app
          </button>
        ) : (
          <p className="text-xs text-gw-text-gray mt-0.5">
            Use your browser menu to add this app
          </p>
        )}
      </div>
      <button
        onClick={dismiss}
        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/60 flex items-center justify-center text-gw-text-gray hover:bg-white transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
