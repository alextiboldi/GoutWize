/**
 * Formats a count for display on the landing page.
 * Under 50: show exact number. 50–999: round to nearest 10 with "+".
 * 1000+: use "1K+", "2.5K+", etc.
 */
export function formatCount(count: number): string {
  if (count < 50) return String(count);
  if (count < 1000) return `${Math.floor(count / 10) * 10}+`;
  const k = count / 1000;
  return k % 1 === 0 ? `${k}K+` : `${k.toFixed(1).replace(/\.0$/, "")}K+`;
}
