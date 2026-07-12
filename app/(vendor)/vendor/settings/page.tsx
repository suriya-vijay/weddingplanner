import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VendorSettingsView } from "@/components/vendor/settings-view";
import { getMyVendor } from "@/lib/db/vendor-portal";

export const metadata: Metadata = {
  title: "Settings · Vendor Portal",
};

export default async function VendorSettingsPage() {
  const vendor = await getMyVendor();
  if (!vendor) notFound();
  return <VendorSettingsView vendor={vendor} />;
}
