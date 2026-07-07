import type { Metadata } from "next";
import { InspirationManager } from "@/components/admin/inspiration-manager";
import { getInspiration } from "@/lib/db/inspiration";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Manage Inspiration · Admin",
};

export default async function AdminInspirationPage() {
  const items = await getInspiration();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <InspirationManager initialItems={items} adminId={user?.id ?? ""} />;
}
