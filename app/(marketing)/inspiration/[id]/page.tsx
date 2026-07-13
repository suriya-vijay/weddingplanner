import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Palette, Sparkles } from "lucide-react";
import { Plate } from "@/components/ui/plate";
import { Reveal } from "@/components/ui/reveal";
import { DividerOrnament } from "@/components/brand/motifs";
import { getInspirationById } from "@/lib/db/inspiration";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await getInspirationById(id);
  if (!item) return { title: "Inspiration · Kalyanam & Co." };
  return {
    title: `${item.title} · Inspiration · Kalyanam & Co.`,
    description: `${item.tradition} ${item.ceremony} — ${item.color}.`,
  };
}

/**
 * Inspiration detail — a curated visual spread of a theme (hero image, a few
 * real attributes, and the palette). Purely inspirational: no invented vendors,
 * locations, or budgets.
 */
export default async function InspirationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getInspirationById(id);
  if (!item) notFound();

  const facts = [
    { label: "Ceremony", value: item.ceremony },
    { label: "Tradition", value: item.tradition },
    { label: "Palette", value: item.color },
  ].filter((f) => f.value);

  return (
    <article className="pb-24">
      {/* Hero slide */}
      <div className="relative h-[52vh] min-h-[22rem] w-full overflow-hidden">
        <Plate
          imageUrl={item.imageUrl}
          fallback={item.plate}
          alt={item.title}
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/85 via-forest-900/25 to-forest-900/40" />
        <div className="container-luxe relative flex h-full flex-col justify-end pb-10 pt-28">
          <Link
            href="/inspiration"
            className="mb-auto inline-flex w-fit items-center gap-2 rounded-full bg-forest-900/40 px-3 py-1.5 text-sm text-cream transition-colors hover:bg-forest-900/60"
          >
            <ArrowLeft className="h-4 w-4" /> Inspiration gallery
          </Link>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-400">
            {item.tradition} · {item.ceremony}
          </p>
          <h1 className="mt-2 font-serif text-4xl text-cream sm:text-5xl">
            {item.title}
          </h1>
        </div>
      </div>

      <div className="container-luxe">
        {/* Facts slide */}
        {facts.length > 0 && (
          <Reveal>
            <section className="mt-10 grid gap-4 sm:grid-cols-3">
              {facts.map((f) => (
                <div
                  key={f.label}
                  className="rounded-2xl border border-border bg-ivory p-4 text-center shadow-[var(--shadow-xs)]"
                >
                  <p className="text-xs uppercase tracking-wider text-ink-faint">
                    {f.label}
                  </p>
                  <p className="mt-1 font-serif text-lg text-ink">{f.value}</p>
                </div>
              ))}
            </section>
          </Reveal>
        )}

        <DividerOrnament className="my-14" />

        {/* Story + palette slide */}
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <Reveal>
            <section>
              <h2 className="flex items-center gap-2 font-serif text-2xl text-ink">
                <Sparkles className="h-5 w-5 text-gold-600" /> The vision
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Picture <strong className="text-ink">{item.title}</strong> — a{" "}
                {item.tradition.toLowerCase()} {item.ceremony.toLowerCase()},
                dressed in {item.color.toLowerCase()} tones and designed to feel
                unmistakably yours: the light, the florals, the rituals, all in
                harmony.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                Save it to a mood board to shape your own celebration.
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section className="rounded-3xl border border-border bg-ivory p-6 shadow-[var(--shadow-sm)]">
              <h3 className="flex items-center gap-2 font-serif text-lg text-ink">
                <Palette className="h-5 w-5 text-gold-600" /> Palette
              </h3>
              <div
                className="mt-4 h-28 w-full rounded-2xl"
                style={{ background: item.plate }}
                aria-hidden
              />
              <p className="mt-3 text-sm text-ink-soft">{item.color}</p>
            </section>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-wrap gap-4">
          <Link
            href="/inspiration"
            className="inline-flex items-center gap-2 text-forest-700 hover:text-gold-600"
          >
            <ArrowLeft className="h-4 w-4" /> Back to the gallery
          </Link>
        </div>
      </div>
    </article>
  );
}
