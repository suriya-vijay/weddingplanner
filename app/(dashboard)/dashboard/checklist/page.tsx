import type { Metadata } from "next";
import { ChecklistView } from "@/components/dashboard/checklist-view";

export const metadata: Metadata = {
  title: "Checklist · Kalyanam & Co.",
};

export default function ChecklistPage() {
  return <ChecklistView />;
}
