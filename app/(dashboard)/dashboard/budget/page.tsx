import type { Metadata } from "next";
import { BudgetView } from "@/components/dashboard/budget-view";

export const metadata: Metadata = {
  title: "Budget · Kalyanam & Co.",
};

export default function BudgetPage() {
  return <BudgetView />;
}
