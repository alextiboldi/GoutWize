"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToastStore } from "@/lib/toast-store";
import { REPORT_REASONS } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import { ShieldX, Trash2, CheckCircle } from "lucide-react";

export interface ReportRow {
  id: string;
  reporter_id: string;
  post_id: string | null;
  comment_id: string | null;
  reason: string;
  details: string | null;
  status: string;
  created_at: string;
  reporter_username: string;
  content_preview: string;
  content_author: string;
  content_author_id: string | null;
}

interface AdminReportsClientProps {
  reports: ReportRow[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  reviewed: "bg-blue-100 text-blue-700",
  actioned: "bg-red-100 text-red-700",
};

export default function AdminReportsClient({
  reports: initialReports,
}: AdminReportsClientProps) {
  const [reports, setReports] = useState(initialReports);

  async function handleDismiss(reportId: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("reports")
      .update({ status: "reviewed" })
      .eq("id", reportId);

    if (!error) {
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: "reviewed" } : r))
      );
      useToastStore.getState().add("Report dismissed");
    }
  }

  async function handleRemoveContent(report: ReportRow) {
    const supabase = createClient();

    if (report.post_id) {
      await supabase.from("posts").delete().eq("id", report.post_id);
    } else if (report.comment_id) {
      await supabase.from("comments").delete().eq("id", report.comment_id);
    }

    const { error } = await supabase
      .from("reports")
      .update({ status: "actioned" })
      .eq("id", report.id);

    if (!error) {
      setReports((prev) =>
        prev.map((r) =>
          r.id === report.id ? { ...r, status: "actioned" } : r
        )
      );
      useToastStore.getState().add("Content removed");
    }
  }

  async function handleBanUser(report: ReportRow) {
    if (!report.content_author_id) return;
    const supabase = createClient();

    await supabase
      .from("profiles")
      .update({ banned: true })
      .eq("id", report.content_author_id);

    const { error } = await supabase
      .from("reports")
      .update({ status: "actioned" })
      .eq("id", report.id);

    if (!error) {
      setReports((prev) =>
        prev.map((r) =>
          r.id === report.id ? { ...r, status: "actioned" } : r
        )
      );
      useToastStore.getState().add(`User ${report.content_author} banned`);
    }
  }

  const reasonLabel = (value: string) =>
    REPORT_REASONS.find((r) => r.value === value)?.label ?? value;

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center">
        <p className="text-3xl mb-2">🎉</p>
        <p className="font-semibold text-gw-navy">No reports</p>
        <p className="text-sm text-gw-text-gray mt-1">
          The community is in good shape.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <div
          key={report.id}
          className="bg-white rounded-2xl p-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[report.status] ?? "bg-gw-bg-light text-gw-text-gray"}`}
            >
              {report.status}
            </span>
            <span className="text-xs text-gw-text-gray">
              {timeAgo(report.created_at)}
            </span>
          </div>

          {/* Reason */}
          <p className="text-sm font-medium text-gw-navy">
            {reasonLabel(report.reason)}
          </p>
          {report.details && (
            <p className="text-xs text-gw-text-gray mt-1">{report.details}</p>
          )}

          {/* Content preview */}
          <div className="mt-3 bg-gw-bg-light rounded-xl p-3">
            <p className="text-xs font-medium text-gw-text-gray mb-1">
              {report.post_id ? "Post" : "Comment"} by {report.content_author}
            </p>
            <p className="text-sm text-gw-navy line-clamp-3">
              {report.content_preview}
            </p>
          </div>

          {/* Reporter */}
          <p className="text-xs text-gw-text-gray mt-2">
            Reported by {report.reporter_username}
          </p>

          {/* Actions */}
          {report.status === "pending" && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleDismiss(report.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-gw-navy bg-gw-bg-light hover:bg-gw-bg-mid transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Dismiss
              </button>
              <button
                onClick={() => handleRemoveContent(report)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
              <button
                onClick={() => handleBanUser(report)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-white bg-gw-navy hover:bg-gw-navy/90 transition-colors"
              >
                <ShieldX className="w-3.5 h-3.5" />
                Ban User
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
