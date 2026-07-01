import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

/**
 * Dashboard layout — the couple's private planning workspace.
 * Sidebar + content, no public header/footer. Mock/preview only this phase:
 * a real per-couple workspace needs Supabase auth + persistence.
 */
export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col bg-cream lg:flex-row">
      <DashboardSidebar />
      <main className="flex-1 overflow-x-hidden px-5 py-7 sm:px-8 lg:px-12">
        {/* Preview banner — this workspace is UI-only until the backend is wired */}
        <div className="mb-6 rounded-xl border border-gold-200 bg-gold-100 px-4 py-3 text-sm text-gold-700">
          <strong className="font-semibold">Preview mode.</strong> This is a demo
          of your planning workspace — changes aren’t saved yet. Sign-in and
          real syncing arrive with the backend.
        </div>
        {children}
      </main>
    </div>
  );
}
