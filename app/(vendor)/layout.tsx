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
        {/* Preview banner — this portal is UI-only until the backend is wired */}
        <div className="mb-6 rounded-xl border border-gold-200 bg-gold-100 px-4 py-3 text-sm text-gold-700">
          <strong className="font-semibold">Preview mode.</strong> This is a demo
          of your vendor portal — changes aren’t saved yet. Real sign-in,
          publishing and enquiries arrive with the backend.
        </div>
        {children}
      </main>
    </div>
  );
}
