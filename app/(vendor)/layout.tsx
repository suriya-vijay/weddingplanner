import { VendorSidebar } from "@/components/vendor/vendor-sidebar";

/**
 * Vendor layout — the vendor's private business workspace.
 * Sidebar + content, no public header/footer. Mock/preview only this phase:
 * a real per-vendor account + profile publishing needs Supabase auth.
 */
export default function VendorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col bg-cream lg:flex-row">
      <VendorSidebar />
      <main className="flex-1 overflow-x-hidden px-5 py-7 sm:px-8 lg:px-12">
        {/* You're really signed in as a vendor now; data is still sample data */}
        <div className="mb-6 rounded-xl border border-gold-200 bg-gold-100 px-4 py-3 text-sm text-gold-700">
          <strong className="font-semibold">Sample data.</strong> You’re signed in
          as a vendor for real — profile edits and enquiries aren’t persisted yet.
          Live data arrives in the next backend stage.
        </div>
        {children}
      </main>
    </div>
  );
}
