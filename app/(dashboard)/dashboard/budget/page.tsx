import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BudgetView } from "@/components/dashboard/budget-view";
import { getOrCreateWedding } from "@/lib/db/weddings";
import { getBudgetItems } from "@/lib/db/budget";

export const metadata: Metadata = {
  title: "Budget · Kalyanam & Co.",
};

export default async function BudgetPage() {
  const wedding = await getOrCreateWedding();
  if (!wedding) notFound();
  const items = await getBudgetItems(wedding.id);
  return <BudgetView initialItems={items} totalBudget={wedding.totalBudget} />;
}
