import type { Metadata } from "next";
import { Heart, Sparkles, ShieldCheck, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { DividerOrnament, LotusMark } from "@/components/brand/motifs";
import { MandalaCorner } from "@/components/brand/patterns";

export const metadata: Metadata = {
  title: "About · Kalyanam & Co.",
  description:
    "Kalyanam & Co. is the luxury operating system for Indian weddings — inspiration, trusted vendors, planning tools and a dedicated human planner, gathered into one elegant place.",
};

const VALUES = [
  {
    icon: Sparkles,
    title: "Taste, curated",
    body: "Every wedding and vendor on Kalyanam is chosen for craft. No noise, no cold calls — only names worth knowing, tagged to the weddings you admire.",
  },
  {
    icon: ShieldCheck,
    title: "Calm, not chaos",
    body: "Countdown, budget, guests, timeline — the whole celebration in one serene workspace, so the planning feels as beautiful as the day.",
  },
  {
    icon: HandHeart,
    title: "Guidance when you need it",
    body: "Every vendor is reviewed by real people before they're listed, and an AI advisor — grounded in your budget, guest list and traditions — is on hand whenever a question comes up.",
  },
  {
    icon: Heart,
    title: "Rooted in tradition",
    body: "Built for Indian celebrations in all their variety — North to South, Hindu to Sikh to interfaith — honouring every family's customs.",
  },
];

const PILLARS = [
  {
    step: "01",
    title: "Discover",
    body: "Browse a curated gallery of real luxury weddings — filter by ceremony, tradition, colour and budget, and save what moves you to mood boards.",
  },
  {
    step: "02",
    title: "Assemble",
    body: "Meet the trusted vendors behind those weddings in one marketplace — compare portfolios, packages and availability, and enquire with confidence.",
  },
  {
    step: "03",
    title: "Plan",
    body: "Your private dashboard keeps budget, checklist, timeline and guest list in concert — with an AI advisor to keep it all moving, gently.",
  },
];

/**
 * Promises, not metrics. A new marketplace can't honestly claim "1,200+
 * weddings curated" — invented counts undermine trust with exactly the couples
 * we want. Replace with real figures once they're worth quoting.
 */
const STATS = [
  { value: "Vetted", label: "Every vendor reviewed before listing" },
  { value: "One home", label: "Guests, budget, seating & timeline together" },
  { value: "Your rituals", label: "Built around your traditions, not generic" },
  { value: "AI-guided", label: "Planning advice tuned to your traditions" },
];

/**
 * The founders. To add a real headshot, drop a square image in
 * `public/founders/` (e.g. `public/founders/suriya.jpg`) and set `photo` to
 * `/founders/suriya.jpg`. If `photo` is empty, a tasteful gold initials avatar
 * shows instead — so the section looks right before the photos land.
 */
const FOUNDERS: { name: string; role: string; photo: string; bio: string }[] = [
  {
    name: "Suriya Vijayakumar",
    role: "Co-founder",
    photo: "/founders/suriya.jpg",
    bio: "A chemical engineering student at Ohio State and a builder at heart — from computer-vision lab tools to fundraising over $60,000 for schools and families in India through AID for India. Suriya started Kalyanam to bring that same care and craft to Indian-American weddings, making the whole journey feel calm, considered and unmistakably ours.",
  },
  {
    name: "Your Co-founder",
    role: "Co-founder",
    photo: "",
    bio: "A short line about your cofounder — what they bring to Kalyanam and why they care about doing weddings beautifully. Swap this copy and add a headshot in public/founders/.",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AboutPage() {
  return (
    <>
      {/* Hero header */}
      <section className="bg-forest-900 pb-16 pt-36 text-center">
        <div className="container-luxe">
          <LotusMark className="draw mx-auto mb-5 h-10 w-10 text-gold-400" />
          <p className="eyebrow text-gold-400">Our story</p>
          <h1 className="mt-4 font-serif text-h1 text-cream">
            Where forever
            <span className="italic text-gold-400"> takes shape</span>
          </h1>
          <p className="lede mx-auto mt-5 max-w-2xl text-cream/75">
            Kalyanam &amp; Co. is the luxury operating system for Indian weddings —
            inspiration, trusted vendors, planning tools and AI assistance,
            gathered into one elegant place.
          </p>
          <DividerOrnament className="mt-10" />
        </div>
      </section>

      {/* Mission — two-column editorial */}
      <section className="section bg-cream">
        <div className="container-luxe grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="eyebrow">Why we exist</p>
            <h2 className="mt-4 font-serif text-h2 text-ink">
              An Indian wedding is a
              <span className="italic text-forest-700"> universe</span>
            </h2>
            <p className="mt-5 leading-relaxed text-ink-soft">
              Multiple ceremonies, hundreds of guests, dozens of vendors, several
              cities — and a family holding it all together. The planning too
              often becomes a blur of spreadsheets, group chats and guesswork.
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              We built Kalyanam so the magnitude never feels like a burden. One
              place to find inspiration, hire the very people behind it, and keep
              every moving piece calm and in view — with smart tools and AI
              guidance beside you from the first idea to the final farewell.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <div
              className="texture-paisley on-dark relative overflow-hidden rounded-[2rem] p-10 text-cream shadow-[var(--shadow-lg)]"
              style={{
                background:
                  "radial-gradient(120% 120% at 20% 0%, rgba(45,106,79,0.95) 0%, rgba(27,67,50,0.97) 60%, #0f2c1f 100%)",
              }}
            >
              <MandalaCorner className="pointer-events-none absolute right-0 top-0 h-32 w-32 rotate-90 text-gold-400/25" />
              <blockquote className="relative font-serif text-2xl leading-relaxed text-cream sm:text-3xl">
                “A wedding should be remembered for its joy — never for the stress
                of planning it.”
              </blockquote>
              <p className="relative mt-6 text-sm uppercase tracking-[0.18em] text-gold-400">
                The Kalyanam promise
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-sunken">
        <div className="container-luxe">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">What we believe</p>
            <h2 className="mt-4 font-serif text-h2 text-ink">
              Luxury is in the
              <span className="italic text-forest-700"> details</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.title} delay={(i % 2) * 60}>
                  <div className="h-full rounded-3xl border border-border bg-ivory p-7 shadow-[var(--shadow-sm)]">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-forest-100 text-forest-700">
                      <Icon className="h-[1.4rem] w-[1.4rem]" strokeWidth={1.6} />
                    </span>
                    <h3 className="mt-5 font-serif text-xl text-ink">{v.title}</h3>
                    <p className="mt-2 leading-relaxed text-ink-soft">{v.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet the founders */}
      <section className="section bg-cream">
        <div className="container-luxe">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">The people behind it</p>
            <h2 className="mt-4 font-serif text-h2 text-ink">
              Meet the
              <span className="italic text-forest-700"> founders</span>
            </h2>
            <p className="lede mx-auto mt-4">
              Two people who believe planning the biggest day of your life should
              feel as beautiful as the day itself.
            </p>
          </Reveal>

          <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
            {FOUNDERS.map((f, i) => (
              <Reveal key={f.name} delay={(i % 2) * 60}>
                <div className="flex h-full flex-col items-center rounded-3xl border border-border bg-ivory p-8 text-center shadow-[var(--shadow-sm)] transition-all duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-1 hover:border-gold-200 hover:shadow-[var(--shadow-md)]">
                  {f.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={f.photo}
                      alt={f.name}
                      loading="lazy"
                      className="h-28 w-28 rounded-full object-cover ring-4 ring-gold-200/50"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="grid h-28 w-28 place-items-center rounded-full bg-forest-700 font-serif text-3xl text-gold-400 ring-4 ring-gold-200/50"
                    >
                      {initials(f.name)}
                    </span>
                  )}
                  <h3 className="mt-5 font-serif text-xl text-ink">{f.name}</h3>
                  <p className="mt-1 text-sm font-medium uppercase tracking-[0.14em] text-gold-600">
                    {f.role}
                  </p>
                  <p className="mt-4 leading-relaxed text-ink-soft">{f.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The model — three pillars */}
      <section className="section bg-sunken">
        <div className="container-luxe">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-4 font-serif text-h2 text-ink">
              Discover, assemble,
              <span className="italic text-forest-700"> plan</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.step} delay={i * 60}>
                <div className="h-full rounded-3xl border border-border bg-ivory p-7 shadow-[var(--shadow-sm)]">
                  <p className="font-serif text-4xl text-gold-500">{p.step}</p>
                  <h3 className="mt-3 font-serif text-xl text-ink">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* By the numbers */}
      <section className="bg-forest-900 py-20 sm:py-24">
        <div className="container-luxe">
          <Reveal className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-3xl text-gold-400">{s.value}</p>
                <p className="mt-2 text-sm text-cream/70">{s.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section bg-cream">
        <div className="container-luxe">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Begin your journey</p>
            <h2 className="mt-4 font-serif text-h2 text-ink">
              Your wedding, beautifully
              <span className="italic text-forest-700"> in hand</span>
            </h2>
            <p className="lede mx-auto mt-4">
              Create your wedding profile in minutes, invite your family, and let
              our tools and AI advisor bring it all together.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Button href="/signup" variant="primary" size="lg">
                Create Your Wedding
              </Button>
              <Button href="/contact" variant="outline" size="lg">
                Talk to us
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
