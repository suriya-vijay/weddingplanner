import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PackagesView } from "@/components/vendor/packages-view";
import { getMyVendor } from "@/lib/db/vendor-portal";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Packages · Vendor Portal",
};

export default async function VendorPackagesPage() {
  const vendor = await getMyVendor();
  if (!vendor) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("vendor_packages")
    .select("id, name, price, features")
    .eq("vendor_id", vendor.id)
    .order("sort");

  return <PackagesView seed={(data ?? []) as { id: string; name: string; price: string; features: string[] }[]} />;
}
