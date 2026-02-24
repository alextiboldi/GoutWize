import { TRIED_IT_OPTIONS } from "@/lib/constants";

const BADGE_STYLES: Record<string, string> = {
  worked: "bg-gw-green/10 text-gw-green",
  didnt_work: "bg-red-50 text-red-500",
  mixed: "bg-amber-50 text-amber-600",
};

export function TriedItBadge({ value }: { value: string }) {
  const option = TRIED_IT_OPTIONS.find((o) => o.value === value);
  if (!option) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${BADGE_STYLES[value] ?? ""}`}
    >
      {option.emoji} Tried it: {option.label}
    </span>
  );
}
