"use client";

import { useRef, useEffect, useCallback, type ReactNode } from "react";

interface PullToRefreshProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  children: ReactNode;
}

const THRESHOLD = 80;
const MAX_PULL = 120;

export function PullToRefresh({
  onRefresh,
  isRefreshing,
  children,
}: PullToRefreshProps) {
  const startYRef = useRef(0);
  const pullDistanceRef = useRef(0);
  const pullingRef = useRef(false);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const updateIndicator = useCallback((distance: number) => {
    if (!indicatorRef.current) return;
    const clamped = Math.min(distance, MAX_PULL);
    indicatorRef.current.style.transform = `translateY(${clamped - 40}px)`;
    indicatorRef.current.style.opacity = String(
      Math.min(clamped / THRESHOLD, 1),
    );
  }, []);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY !== 0 || isRefreshing) return;
      startYRef.current = e.touches[0].clientY;
      pullingRef.current = true;
      pullDistanceRef.current = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!pullingRef.current) return;
      const delta = e.touches[0].clientY - startYRef.current;
      if (delta <= 0) {
        pullDistanceRef.current = 0;
        updateIndicator(0);
        return;
      }
      pullDistanceRef.current = delta;
      updateIndicator(delta);
    };

    const onTouchEnd = () => {
      if (!pullingRef.current) return;
      pullingRef.current = false;
      if (pullDistanceRef.current >= THRESHOLD) {
        onRefresh();
      } else {
        updateIndicator(0);
      }
      pullDistanceRef.current = 0;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isRefreshing, onRefresh, updateIndicator]);

  // Reset indicator position when refresh completes
  useEffect(() => {
    if (!isRefreshing) {
      updateIndicator(0);
    }
  }, [isRefreshing, updateIndicator]);

  return (
    <div className="relative">
      {/* Pull indicator */}
      <div
        ref={indicatorRef}
        className="absolute left-1/2 -translate-x-1/2 top-0 z-10 opacity-0"
        style={{ transform: "translateY(-40px)" }}
      >
        <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center">
          {isRefreshing ? (
            <svg className="animate-spin h-5 w-5 text-gw-blue" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-gw-text-gray"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
