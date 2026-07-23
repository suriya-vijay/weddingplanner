import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AmbientMusic } from "@/components/sections/ambient-audio";

/**
 * Marketing layout — adds the public site chrome (header + footer).
 * Auth pages (login/signup) live outside this group and render full-screen.
 */
export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      {/* Opt-in music player (play/pause/skip) — silent until tapped; hides
          itself until tracks are dropped in at public/music/. */}
      <AmbientMusic />
    </>
  );
}
