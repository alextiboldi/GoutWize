"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Check,
  X,
  LogOut,
  Flame,
  ClipboardCheck,
  MessageCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export interface ProfileData {
  username: string;
  gout_duration: string | null;
  flare_frequency: string | null;
  approach: string | null;
  reason: string | null;
}

export interface Stats {
  flares: number;
  checkins: number;
  comments: number;
}

const DURATION_LABELS: Record<string, string> = {
  new: "New to it",
  "1-3": "1\u20133 years",
  "3-10": "3\u201310 years",
  "10+": "10+ years",
};

const FREQUENCY_LABELS: Record<string, string> = {
  monthly: "Monthly",
  few_months: "Every few months",
  yearly: "Yearly",
  unpredictable: "Unpredictable",
};

const APPROACH_LABELS: Record<string, string> = {
  diet: "Strict diet",
  medication: "Medication",
  both: "Both",
  freestyle: "Living freely & managing",
};

interface ProfileClientProps {
  profile: ProfileData;
  stats: Stats;
}

export default function ProfileClient({
  profile: initialProfile,
  stats,
}: ProfileClientProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData>(initialProfile);

  // Username editing
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(initialProfile.username);
  const [saving, setSaving] = useState(false);

  async function saveUsername() {
    if (!editValue.trim() || editValue.trim() === profile.username) {
      setIsEditing(false);
      setEditValue(profile.username);
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ username: editValue.trim() })
      .eq("id", user.id);

    if (!error) {
      setProfile((prev) => ({ ...prev, username: editValue.trim() }));
    }
    setIsEditing(false);
    setSaving(false);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  const summaryItems = [
    {
      label: "Duration",
      value: profile.gout_duration
        ? DURATION_LABELS[profile.gout_duration] ?? profile.gout_duration
        : null,
    },
    {
      label: "Flare frequency",
      value: profile.flare_frequency
        ? FREQUENCY_LABELS[profile.flare_frequency] ?? profile.flare_frequency
        : null,
    },
    {
      label: "Approach",
      value: profile.approach
        ? APPROACH_LABELS[profile.approach] ?? profile.approach
        : null,
    },
  ];

  const statItems = [
    {
      icon: Flame,
      label: "Flares logged",
      value: stats.flares,
      color: "text-gw-orange",
    },
    {
      icon: ClipboardCheck,
      label: "Check-ins",
      value: stats.checkins,
      color: "text-gw-blue",
    },
    {
      icon: MessageCircle,
      label: "Comments",
      value: stats.comments,
      color: "text-gw-green",
    },
  ];

  return (
    <div className="pt-2">
      <h1 className="font-heading text-2xl font-bold text-gw-navy mb-6">
        Profile
      </h1>

      {/* Username */}
      <div className="bg-white rounded-2xl p-5 mb-4">
        <p className="text-xs font-medium text-gw-text-gray mb-1">Username</p>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              autoFocus
              className="flex-1 px-3 py-2 bg-gw-bg-light border-2 border-gw-blue rounded-lg text-gw-navy text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-gw-blue/10"
            />
            <button
              onClick={saveUsername}
              disabled={saving}
              className="w-9 h-9 rounded-full bg-gw-green text-white flex items-center justify-center hover:bg-gw-green/90 transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditValue(profile.username);
              }}
              className="w-9 h-9 rounded-full bg-gw-bg-light text-gw-text-gray flex items-center justify-center hover:bg-gw-bg-mid transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gw-navy">
              {profile.username}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="w-8 h-8 rounded-full bg-gw-bg-light text-gw-text-gray flex items-center justify-center hover:bg-gw-bg-mid transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Gout profile summary */}
      <div className="bg-white rounded-2xl p-5 mb-4">
        <p className="text-xs font-medium text-gw-text-gray mb-3">
          Gout Profile
        </p>
        <div className="space-y-3">
          {summaryItems.map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <span className="text-sm text-gw-text-gray">{item.label}</span>
              <span className="text-sm font-medium text-gw-navy">
                {item.value ?? "Not set"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {statItems.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-4 text-center"
          >
            <stat.icon className={`w-5 h-5 mx-auto mb-1.5 ${stat.color}`} />
            <p className="text-2xl font-bold text-gw-navy">{stat.value}</p>
            <p className="text-[10px] text-gw-text-gray mt-0.5">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-red-500 bg-white border border-gw-border hover:bg-red-50 transition-colors mt-8"
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </button>
    </div>
  );
}
