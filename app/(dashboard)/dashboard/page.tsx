import type { Metadata } from "next";
import Link from "next/link";
import {
  ListChecks,
  Wallet,
  Users,
  CalendarClock,
  ArrowUpRight,
  MapPin,
  Phone,
  Mail,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel, StatTile, ProgressBar, ProgressRing } from "@/components/dashboard/ui";
import { Countdown } from "@/components/dashboard/countdown";
import { formatINR } from "@/lib/utils";
import {
  weddingProfile,
  assignedPlanner,
  checklistItems,
  budgetItems,
  guests,
  inspirationItems,
  savedInspirationIds,
} from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Your Wedding · Kalyanam & Co.",
};

export default function DashboardOverview() {
  const done = checklistItems.filter((c) => c.done).length;
  const checklistPct = Math.round((done / checklistItems.length) * 100);

  const totalSpent = budgetItems.reduce((s, b) => s + b.spent, 0);
  const totalEstimated = budgetItems.reduce((s, b) => s + b.estimated, 0);
  const budgetPct = Math.round((totalSpent / weddingProfile.totalBudget) * 100);

  const headcount = guests.reduce((s, g) => s + g.count, 0);
  const confirmed = guests
    .filter((g) => g.rsvp === "Confirmed")
    .reduce((s, g) => s + g.count, 0);
  const pending = guests
    .filter((g) => g.rsvp === "Pending")
    .reduce((s, g) => s + g.count, 0);

  const nextTasks = checklistItems.filter((c) => !c.done).slice(0, 5);
  const saved = savedInspirationIds
    .map((id) => inspirationItems.find((i) => i.id === id))
    .filter(Boolean) as typeof inspirationItems;

  const prettyDate = new Date(weddingProfile.date + "T00:00:00").toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "long", year: "numeric" },
  );

  return (
    <div className="space-y-8">
      {/* Header + hero countdown */}
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="eyebrow text-gold-600">Your wedding workspace</p>
          <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
            {weddingProfile.coupleNames}
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-soft">
            <span>{prettyDate}</span>
            <span className="text-ink-faint">·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4 text-gold-600" /> {weddingProfile.city}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-5 rounded-2xl border border-border bg-forest-900 px-6 py-4 text-cream shadow-[var(--shadow-md)]">
          <div className="text-center">
            <p className="font-serif text-4xl text-gold-400">
              <Countdown dateISO={weddingProfile.date} />
            </p>
            <p className="text-xs uppercase tracking-wider text-cream/70">
              days to go
            </p>
          </div>
          <div className="h-12 w-px bg-cream/15" />
          <div className="text-sm leading-relaxed text-cream/80">
            {weddingProfile.venue}
            <br />
            {weddingProfile.tradition}
          </div>
        </div>
      </header>

      {/* Stat tiles */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Planning progress"
          value={`${checklistPct}%`}
          sub={`${done} of ${checklistItems.length} tasks done`}
          icon={<ListChecks className="h-[1.1rem] w-[1.1rem]" />}
        />
        <StatTile
          label="Budget spent"
          value={formatINR(totalSpent)}
          sub={`of ${formatINR(weddingProfile.totalBudget)} budget`}
          icon={<Wallet className="h-[1.1rem] w-[1.1rem]" />}
        />
        <StatTile
          label="Guests confirmed"
          value={confirmed}
          sub={`${headcount} invited · ${pending} pending`}
          icon={<Users className="h-[1.1rem] w-[1.1rem]" />}
        />
        <StatTile
          label="Committed so far"
          value={formatINR(totalEstimated)}
          sub="across all vendors"
          icon={<CalendarClock className="h-[1.1rem] w-[1.1rem]" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Progress + budget summary */}
          <Panel>
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-around">
              <div className="flex flex-col items-center gap-2">
                <ProgressRing value={checklistPct}>
                  <div>
                    <p className="font-serif text-3xl text-ink">{checklistPct}%</p>
                    <p className="text-xs text-ink-faint">complete</p>
                  </div>
                </ProgressRing>
                <p className="text-sm text-ink-soft">Overall planning</p>
              </div>
              <div className="w-full max-w-xs space-y-4">
                <div>
                  <div className="mb-1.5 flex items-baseline justify-between text-sm">
                    <span className="text-ink-soft">Budget used</span>
                    <span className="font-medium text-ink">{budgetPct}%</span>
                  </div>
                  <ProgressBar value={budgetPct} />
                  <p className="mt-1.5 text-xs text-ink-faint">
                    {formatINR(weddingProfile.totalBudget - totalSpent)} remaining
                  </p>
                </div>
                <div>
                  <div className="mb-1.5 flex items-baseline justify-between text-sm">
                    <span className="text-ink-soft">RSVPs confirmed</span>
                    <span className="font-medium text-ink">
                      {Math.round((confirmed / headcount) * 100)}%
                    </span>
                  </div>
                  <ProgressBar
                    value={(confirmed / headcount) * 100}
                    tone="forest"
                  />
                  <p className="mt-1.5 text-xs text-ink-faint">
                    {confirmed} of {headcount} guests
                  </p>
                </div>
              </div>
            </div>
          </Panel>

          {/* Next tasks */}
          <Panel>
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-ink">Next on your list</h2>
              <Link
                href="/dashboard/checklist"
                className="inline-flex items-center gap-1 text-sm font-medium text-forest-700 hover:text-gold-600"
              >
                Full checklist <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="mt-5 space-y-2.5">
              {nextTasks.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-3 rounded-xl border border-border/70 px-4 py-3"
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-border-strong text-transparent">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex-1 text-sm text-ink">{t.task}</span>
                  <span className="shrink-0 text-xs text-ink-faint">{t.phase}</span>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Saved inspiration */}
          <Panel>
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-ink">Saved inspiration</h2>
              <Link
                href="/inspiration"
                className="inline-flex items-center gap-1 text-sm font-medium text-forest-700 hover:text-gold-600"
              >
                Explore more <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {saved.map((item) => (
                <div key={item.id} className="group">
                  <div
                    aria-hidden
                    className="aspect-square w-full rounded-xl shadow-[var(--shadow-xs)]"
                    style={{ background: item.plate }}
                  />
                  <p className="mt-1.5 truncate text-xs text-ink-soft">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Right column: planner card */}
        <div className="space-y-6">
          <Panel className="text-center">
            <p className="eyebrow text-gold-600">Your dedicated planner</p>
            <span
              aria-hidden
              className="mx-auto mt-4 grid h-20 w-20 place-items-center rounded-full font-serif text-2xl text-cream shadow-[var(--shadow-md)]"
              style={{ background: assignedPlanner.plate }}
            >
              {assignedPlanner.initials}
            </span>
            <h2 className="mt-4 font-serif text-xl text-ink">
              {assignedPlanner.name}
            </h2>
            <p className="text-sm text-ink-soft">{assignedPlanner.title}</p>
            <p className="mt-1 text-xs text-ink-faint">
              With you since {assignedPlanner.since}
            </p>

            <div className="mt-5 space-y-2 border-t border-border pt-5 text-left text-sm">
              <p className="flex items-center gap-2 text-ink-soft">
                <Phone className="h-4 w-4 text-gold-600" /> {assignedPlanner.phone}
              </p>
              <p className="flex items-center gap-2 text-ink-soft">
                <Mail className="h-4 w-4 text-gold-600" /> {assignedPlanner.email}
              </p>
            </div>
            <Button
              href={`mailto:${assignedPlanner.email}`}
              variant="primary"
              size="md"
              className="mt-5 w-full"
            >
              Message {assignedPlanner.name.split(" ")[0]}
            </Button>
          </Panel>

          <Panel>
            <h2 className="font-serif text-lg text-ink">Quick actions</h2>
            <div className="mt-4 grid gap-2.5">
              <Button href="/dashboard/checklist" variant="outline" size="md" className="justify-start">
                <ListChecks className="h-4 w-4" /> Update checklist
              </Button>
              <Button href="/dashboard/budget" variant="outline" size="md" className="justify-start">
                <Wallet className="h-4 w-4" /> Review budget
              </Button>
              <Button href="/dashboard/guests" variant="outline" size="md" className="justify-start">
                <Users className="h-4 w-4" /> Manage guests
              </Button>
              <Button href="/vendors" variant="outline" size="md" className="justify-start">
                <ArrowUpRight className="h-4 w-4" /> Find more vendors
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
