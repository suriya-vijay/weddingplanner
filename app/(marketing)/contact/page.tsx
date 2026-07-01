import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { DividerOrnament } from "@/components/brand/motifs";

export const metadata: Metadata = {
  title: "Contact · Kalyanam & Co.",
  description:
    "Get in touch with Kalyanam & Co. — for couples planning a wedding, vendors joining the marketplace, press and partnerships.",
};

const DETAILS = [
  { icon: Mail, label: "Email", value: "hello@kalyanam.co", href: "mailto:hello@kalyanam.co" },
  { icon: Phone, label: "Phone", value: "+91 98••• •••00", href: "tel:+9198000000" },
  { icon: MapPin, label: "Studio", value: "Bandra West, Mumbai, India" },
  { icon: Clock, label: "Hours", value: "Mon–Sat · 10am–7pm IST" },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero header */}
      <section className="bg-forest-900 pb-16 pt-36 text-center">
        <div className="container-luxe">
          <p className="eyebrow text-gold-400">We’d love to hear from you</p>
          <h1 className="mt-4 font-serif text-h1 text-cream">
            Let’s start a
            <span className="italic text-gold-400"> conversation</span>
          </h1>
          <p className="lede mx-auto mt-5 max-w-2xl text-cream/75">
            Planning a wedding, joining as a vendor, or just curious? Tell us a
            little about you and we’ll be in touch.
          </p>
          <DividerOrnament className="mt-10" />
        </div>
      </section>

      {/* Form + details */}
      <section className="section bg-cream">
        <div className="container-luxe grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          {/* Form */}
          <div className="rounded-3xl border border-border bg-ivory p-7 shadow-[var(--shadow-sm)] sm:p-9">
            <h2 className="font-serif text-2xl text-ink">Send us a message</h2>
            <p className="mt-1 text-ink-soft">
              We usually reply within one business day.
            </p>
            <div className="mt-7">
              <ContactForm />
            </div>
          </div>

          {/* Details */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-border bg-ivory p-7 shadow-[var(--shadow-sm)]">
              <h2 className="font-serif text-xl text-ink">Reach us directly</h2>
              <ul className="mt-5 space-y-4">
                {DETAILS.map((d) => {
                  const Icon = d.icon;
                  const content = (
                    <span className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-forest-100 text-forest-700">
                        <Icon className="h-[1.1rem] w-[1.1rem]" />
                      </span>
                      <span>
                        <span className="block text-xs uppercase tracking-wider text-ink-faint">
                          {d.label}
                        </span>
                        <span className="text-ink">{d.value}</span>
                      </span>
                    </span>
                  );
                  return (
                    <li key={d.label}>
                      {d.href ? (
                        <a
                          href={d.href}
                          className="transition-colors hover:text-forest-700"
                        >
                          {content}
                        </a>
                      ) : (
                        content
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-3xl border border-gold-200 bg-gold-100 p-7">
              <h2 className="font-serif text-xl text-gold-700">
                Have a quick question?
              </h2>
              <p className="mt-2 text-sm text-gold-700/90">
                Answers to the most common questions — planners, traditions,
                pricing and more — live on our home page.
              </p>
              <Link
                href="/#features"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-forest-700 hover:text-gold-600"
              >
                Explore the platform <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
