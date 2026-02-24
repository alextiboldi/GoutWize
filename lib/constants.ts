export const POST_CATEGORIES = [
  { value: "general", label: "General", emoji: "💬" },
  { value: "has_anyone_tried", label: "Has anyone tried...?", emoji: "🧪" },
  { value: "why_do_i", label: "Why do I...?", emoji: "🤔" },
  { value: "what_would_you_do", label: "What would you do?", emoji: "🤷" },
  { value: "just_venting", label: "Just venting", emoji: "😤" },
  { value: "tip", label: "Tip / What worked", emoji: "💡" },
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number]["value"];

export const FLARE_JOINTS = [
  { value: "big_toe", label: "Big toe", emoji: "🦶" },
  { value: "ankle", label: "Ankle", emoji: "🦶" },
  { value: "knee", label: "Knee", emoji: "🦵" },
  { value: "wrist", label: "Wrist", emoji: "🤚" },
  { value: "top_of_foot", label: "Top of foot", emoji: "🦶" },
  { value: "other", label: "Other", emoji: "📍" },
] as const;

export type FlareJoint = (typeof FLARE_JOINTS)[number]["value"];

export const FLARE_STATUSES = [
  { value: "active", label: "Active" },
  { value: "improving", label: "Improving" },
  { value: "resolved", label: "Resolved" },
] as const;

export type FlareStatus = (typeof FLARE_STATUSES)[number]["value"];

export const TRIED_IT_OPTIONS = [
  { value: "worked", label: "Worked", emoji: "✅" },
  { value: "didnt_work", label: "Didn't work", emoji: "❌" },
  { value: "mixed", label: "Mixed results", emoji: "⚠️" },
] as const;

export type TriedIt = (typeof TRIED_IT_OPTIONS)[number]["value"];

export const MOOD_OPTIONS = [
  { value: "good", label: "Good", emoji: "😊" },
  { value: "okay", label: "Okay", emoji: "😐" },
  { value: "bad", label: "Bad", emoji: "😣" },
] as const;

export const HYDRATION_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "ok", label: "OK" },
  { value: "good", label: "Good" },
] as const;

export const ALCOHOL_OPTIONS = [
  { value: "none", label: "None" },
  { value: "light", label: "Light" },
  { value: "heavy", label: "Heavy" },
] as const;
