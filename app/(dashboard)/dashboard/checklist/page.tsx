import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChecklistView } from "@/components/dashboard/checklist-view";
import { getOrCreateWedding } from "@/lib/db/weddings";
import { getChecklist } from "@/lib/db/checklist";

export const metadata: Metadata = {
  title: "Checklist · Kalyanam & Co.",
};

export default async function ChecklistPage() {
  const wedding = await getOrCreateWedding();
  if (!wedding) notFound();
  const items = await getChecklist(wedding.id);
  return <ChecklistView initialItems={items} />;
}
