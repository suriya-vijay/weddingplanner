import Link from "next/link";
import { Mail } from "lucide-react";
import { LotusMark, DividerOrnament } from "@/components/brand/motifs";
import { PaisleyBorder } from "@/components/brand/patterns";

/** Brand glyphs (lucide dropped these) — simple, on-brand SVG marks. */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
    </svg>
  );
}
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M14 8.5V7c0-.8.5-1 1-1h1.5V3H14c-2.2 0-3.5 1.4-3.5 3.6V8.5H8.5v3h2V21h3.5v-9.5H17l.5-3H14Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Inspiration Gallery", href: "/inspiration" },
      { label: "Vendor Marketplace", href: "/vendors" },
      { label: "Wedding Dashboard", href: "#features" },
      { label: "AI Assistant", href: "#features" },
    ],
  },
  {
    title: "Planning",
    links: [
      { label: "Budget Tracker", href: "#features" },
      { label: "Wedding Timeline", href: "#features" },
      { label: "Guest List & RSVPs", href: "#features" },
      { label: "Checklist", href: "#features" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Contact", href: "#contact" },
      { label: "Become a Vendor", href: "/signup" },
      { label: "Careers", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="texture-paisley on-dark bg-forest-900 text-cream/80">
      <div className="container-luxe py-16 sm:py-20">
        <PaisleyBorder className="mb-12" />
        <DividerOrnament className="mb-14 [&_span]:via-gold-400/40 [&_svg]:text-gold-400" />

        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <LotusMark className="h-7 w-7 text-gold-400" />
              <span className="font-serif text-2xl font-semibold text-cream">
                Kalyanam <span className="text-gold-400">&amp;</span> Co.
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-cream/60">
              The luxury operating system for Indian weddings — inspiration,
              vendors, planning tools, and your own wedding planner, gathered
              into one elegant place.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { icon: InstagramIcon, label: "Instagram" },
                { icon: FacebookIcon, label: "Facebook" },
                { icon: Mail, label: "Email" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 text-cream/70 transition-all duration-[var(--dur-fast)] hover:-translate-y-0.5 hover:border-gold-400/50 hover:text-gold-400"
                >
                  <Icon className="h-[1.1rem] w-[1.1rem]" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-gold-400">
                {col.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/65 transition-colors duration-[var(--dur-fast)] hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 text-xs text-cream/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Kalyanam &amp; Co. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-cream/80">Privacy</Link>
            <Link href="#" className="hover:text-cream/80">Terms</Link>
            <Link href="#" className="hover:text-cream/80">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
