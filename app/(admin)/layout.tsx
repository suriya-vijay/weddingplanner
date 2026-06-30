import { AdminSidebar } from "@/components/admin/admin-sidebar";

/**
 * Admin layout — sidebar + content. No public header/footer.
 * Mock/preview only this phase: a real role-gated admin needs Supabase auth.
 */
export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col bg-cream lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden px-5 py-7 sm:px-8 lg:px-12">
        {/* Preview banner — this admin is UI-only until the backend is wired */}
        <div className="mb-6 rounded-xl border border-gold-200 bg-gold-100 px-4 py-3 text-sm text-gold-700">
          <strong className="font-semibold">Preview mode.</strong> This admin area
          is a design preview — changes aren’t saved yet. Real sign-in and
          publishing arrive with the backend.
        </div>
        {children}
      </main>
    </div>
  );
}
