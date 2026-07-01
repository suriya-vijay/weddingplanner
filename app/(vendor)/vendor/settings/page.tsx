import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Panel } from "@/components/dashboard/ui";
import { getVendorBySlug, myVendorSlug } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Settings · Vendor Portal",
};

export default function VendorSettingsPage() {
  const vendor = getVendorBySlug(myVendorSlug);
  if (!vendor) notFound();

  const fields: { label: string; value: string }[] = [
    { label: "Business name", value: vendor.name },
    { label: "Category", value: vendor.category },
    { label: "Base location", value: vendor.location },
    { label: "Service areas", value: vendor.serviceAreas.join(", ") },
    { label: "Price tier", value: vendor.priceTier },
    { label: "Starting at", value: vendor.startingAt },
    { label: "Availability", value: vendor.availability },
    { label: "Instagram", value: vendor.instagram },
    { label: "Website", value: vendor.website },
    { label: "Verified", value: vendor.verified ? "Yes" : "Pending" },
  ];

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow text-gold-600">Vendor portal</p>
        <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Settings</h1>
        <p className="mt-1 text-ink-soft">
          Your business details. Editing arrives with the backend.
        </p>
      </header>

      <Panel>
        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.label} className="border-b border-border/70 pb-4">
              <dt className="text-xs uppercase tracking-wider text-ink-faint">
                {f.label}
              </dt>
              <dd className="mt-1 font-serif text-lg text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      </Panel>
    </div>
  );
}
