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
        {/* You're really signed in now; data is still sample data until Stage 2 */}
        <div className="mb-6 rounded-xl border border-gold-200 bg-gold-100 px-4 py-3 text-sm text-gold-700">
          <strong className="font-semibold">Sample data.</strong> You’re signed in
          for real — the numbers below are still demo content. Live saving of your
          own wedding arrives in the next backend stage.
        </div>
        {children}
      </main>
    </div>
  );
}
