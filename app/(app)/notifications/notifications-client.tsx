"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  MessageCircle,
  ThumbsUp,
  BarChart3,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { timeAgo } from "@/lib/utils";
import { useToastStore } from "@/lib/toast-store";
import { useNotificationStore } from "@/lib/notification-store";

export interface NotificationRow {
  id: string;
  type: string;
  reference_id: string | null;
  actor_id: string | null;
  message: string;
  read: boolean;
  created_at: string;
}

interface NotificationsClientProps {
  notifications: NotificationRow[];
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "comment_on_post":
    case "comment_on_poll":
      return <MessageCircle className="w-4 h-4" />;
    case "upvote_post":
    case "upvote_comment":
      return <ThumbsUp className="w-4 h-4" />;
    case "poll_result":
      return <BarChart3 className="w-4 h-4" />;
    default:
      return <Bell className="w-4 h-4" />;
  }
}

function getNotificationHref(type: string, referenceId: string | null): string {
  if (!referenceId) return "/feed";
  switch (type) {
    case "comment_on_post":
    case "upvote_post":
      return `/post/${referenceId}`;
    case "comment_on_poll":
    case "poll_result":
      return `/poll/${referenceId}`;
    case "upvote_comment":
      // For comment upvotes, reference_id is the comment id — go to feed as fallback
      return "/feed";
    default:
      return "/feed";
  }
}

export default function NotificationsClient({
  notifications: initialNotifications,
}: NotificationsClientProps) {
  const router = useRouter();
  const [notifications, setNotifications] =
    useState<NotificationRow[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function handleMarkAllRead() {
    const supabase = createClient();
    const { error } = await supabase.rpc("mark_all_notifications_read");

    if (!error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      useNotificationStore.getState().reset();
      useToastStore.getState().add("All marked as read");
    }
  }

  async function handleNotificationClick(notification: NotificationRow) {
    // Mark as read if unread
    if (!notification.read) {
      const supabase = createClient();
      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notification.id);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, read: true } : n,
        ),
      );
      useNotificationStore.getState().decrement();
    }

    // Navigate to relevant content
    const href = getNotificationHref(
      notification.type,
      notification.reference_id,
    );
    router.push(href);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between pt-2 mb-4">
        <h1 className="font-heading text-2xl font-bold text-gw-navy">
          Notifications
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 text-sm font-medium text-gw-blue hover:text-gw-blue-dark transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Notification list */}
      {notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`w-full text-left flex items-start gap-3 p-4 rounded-2xl transition-all ${
                notification.read
                  ? "bg-white"
                  : "bg-gw-blue/5 border-l-4 border-gw-blue"
              }`}
            >
              {/* Icon */}
              <div
                className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  notification.read
                    ? "bg-gw-bg-light text-gw-text-gray"
                    : "bg-gw-blue/10 text-gw-blue"
                }`}
              >
                {getNotificationIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm leading-snug ${
                    notification.read
                      ? "text-gw-text-gray"
                      : "text-gw-navy font-medium"
                  }`}
                >
                  {notification.message}
                </p>
                <p className="text-xs text-gw-text-gray/60 mt-1">
                  {timeAgo(notification.created_at)}
                </p>
              </div>

              {/* Unread dot */}
              {!notification.read && (
                <div className="w-2.5 h-2.5 bg-gw-blue rounded-full shrink-0 mt-1.5" />
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="w-14 h-14 bg-gw-bg-light rounded-full flex items-center justify-center mx-auto mb-3">
            <Bell className="w-7 h-7 text-gw-text-gray" />
          </div>
          <p className="font-semibold text-gw-navy">No notifications yet</p>
          <p className="text-sm text-gw-text-gray mt-1">
            You&apos;ll be notified when someone interacts with your posts.
          </p>
        </div>
      )}
    </div>
  );
}
