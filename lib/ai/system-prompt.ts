import { getOrCreateWedding, type Wedding } from "@/lib/db/weddings";
import { getGuests } from "@/lib/db/guests";
import { getBudgetItems } from "@/lib/db/budget";
import { getChecklist } from "@/lib/db/checklist";

/**
 * Build the advisor's system instruction from the signed-in couple's REAL
 * wedding data, so replies are grounded (budget, tradition, guest count,
 * checklist progress). Returns null if there's no signed-in couple.
 */
export async function buildAdvisorSystemPrompt(): Promise<string | null> {
  const wedding = await getOrCreateWedding();
  if (!wedding) return null;

  const [guests, budget, checklist] = await Promise.all([
    getGuests(wedding.id),
    getBudgetItems(wedding.id),
    getChecklist(wedding.id),
  ]);

  const headcount = guests.reduce((n, g) => n + (g.count || 0), 0);
  const confirmed = guests
    .filter((g) => g.rsvp === "Confirmed")
    .reduce((n, g) => n + (g.count || 0), 0);
  const totalEstimated = budget.reduce((n, b) => n + b.estimated, 0);
  const totalSpent = budget.reduce((n, b) => n + b.spent, 0);
  const doneTasks = checklist.filter((c) => c.done).length;
  const openTasks = checklist.filter((c) => !c.done);

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return [
    "You are the Kalyanam & Co. Wedding Advisor — a warm, knowledgeable planning",
    "assistant for Indian weddings. Be concise, practical, and encouraging. Give",
    "specific, culturally-aware advice (ceremonies, vendors, budgets, timelines).",
    "Use the couple's real details below; don't invent facts not given. Amounts",
    "are in Indian Rupees. If asked something outside wedding planning, gently",
    "steer back.",
    "",
    "── This couple's wedding ──",
    describeWedding(wedding),
    `Guests: ${headcount} expected across ${guests.length} parties (${confirmed} confirmed).`,
    budget.length
      ? `Budget: ${inr(totalSpent)} spent of ${inr(totalEstimated)} planned across ${budget.length} categories.`
      : "Budget: not set up yet.",
    `Checklist: ${doneTasks}/${checklist.length} tasks done.`,
    openTasks.length
      ? `Next open tasks: ${openTasks.slice(0, 5).map((t) => t.task).join("; ")}.`
      : "All checklist tasks are complete.",
  ].join("\n");
}

function describeWedding(w: Wedding): string {
  const bits = [
    w.coupleNames && `Couple: ${w.coupleNames}`,
    w.date && `Date: ${w.date}`,
    w.city && `City: ${w.city}`,
    w.venue && `Venue: ${w.venue}`,
    w.tradition && `Tradition: ${w.tradition}`,
  ].filter(Boolean);
  return bits.length ? bits.join(" · ") : "Details not filled in yet.";
}
