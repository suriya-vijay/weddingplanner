import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PackagesView } from "@/components/vendor/packages-view";
import { getVendorBySlug, myVendorSlug } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Packages · Vendor Portal",
};

export default function VendorPackagesPage() {
  const vendor = getVendorBySlug(myVendorSlug);
  if (!vendor) notFound();
  return <PackagesView seed={vendor.packages} />;
}
