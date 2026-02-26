import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import NotificationsClient, {
  type NotificationRow,
} from "./notifications-client";

export default async function NotificationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, type, reference_id, actor_id, message, read, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <NotificationsClient
      notifications={(notifications as unknown as NotificationRow[]) ?? []}
    />
  );
}
