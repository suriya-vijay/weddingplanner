import type { Metadata } from "next";
import { VendorsManager } from "@/components/admin/vendors-manager";
import { getVendorsForAdmin } from "@/lib/db/vendors";

export const metadata: Metadata = { title: "Manage Vendors · Admin" };

export default async function AdminVendorsPage() {
  const vendors = await getVendorsForAdmin();
  return <VendorsManager initialVendors={vendors} />;
}
