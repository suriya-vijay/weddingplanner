import type { Metadata } from "next";
import { InspirationManager } from "@/components/admin/inspiration-manager";

export const metadata: Metadata = {
  title: "Manage Inspiration · Admin",
};

export default function AdminInspirationPage() {
  return <InspirationManager />;
}
