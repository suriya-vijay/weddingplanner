import type { Metadata } from "next";
import { InspirationManager } from "@/components/admin/inspiration-manager";
import { getInspiration } from "@/lib/db/inspiration";

export const metadata: Metadata = {
  title: "Manage Inspiration · Admin",
};

export default async function AdminInspirationPage() {
  const items = await getInspiration();
  return <InspirationManager initialItems={items} />;
}
