import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

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
    </>
  );
}
