import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";

interface NotificationStore {
  unreadCount: number;
  fetchCount: () => Promise<void>;
  decrement: (by?: number) => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  unreadCount: 0,
  fetchCount: async () => {
    const supabase = createClient();
    const { data } = await supabase.rpc("get_unread_notification_count");
    if (typeof data === "number") {
      set({ unreadCount: data });
    }
  },
  decrement: (by = 1) =>
    set((state) => ({
      unreadCount: Math.max(0, state.unreadCount - by),
    })),
  reset: () => set({ unreadCount: 0 }),
}));
