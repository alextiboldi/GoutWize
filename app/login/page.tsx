import { createClient } from "@/lib/supabase/server";
import { formatCount } from "@/lib/format-count";
import { LoginClient } from "./login-client";

export default async function LoginPage() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });

  const memberLabel = formatCount(count ?? 0);

  return <LoginClient memberLabel={memberLabel} />;
}
