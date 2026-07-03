/**
 * Starter content created for a NEW couple on first visit (provisioning).
 * A standard planning checklist + a few timeline milestones — genuinely useful
 * defaults. Guests, budget and the profile start empty (the couple fills them).
 */

export const STARTER_CHECKLIST: {
  task: string;
  phase: string;
  category: string;
}[] = [
  { task: "Set your wedding budget together", phase: "12+ months", category: "Planning" },
  { task: "Finalise the guest count estimate", phase: "12+ months", category: "Guests" },
  { task: "Shortlist and book the venue", phase: "12+ months", category: "Venue" },
  { task: "Choose your wedding dates (muhurat)", phase: "12+ months", category: "Planning" },
  { task: "Book photographer & videographer", phase: "9–12 months", category: "Vendors" },
  { task: "Book decorator & mandap designer", phase: "9–12 months", category: "Vendors" },
  { task: "Book caterer & finalise menu tasting", phase: "9–12 months", category: "Catering" },
  { task: "Reserve blocks of guest hotel rooms", phase: "6–9 months", category: "Guests" },
  { task: "Order bridal outfit & begin fittings", phase: "6–9 months", category: "Fashion" },
  { task: "Book mehendi artist & makeup artist", phase: "6–9 months", category: "Beauty" },
  { task: "Design & send save-the-dates", phase: "6–9 months", category: "Invitations" },
  { task: "Book sangeet DJ & choreographer", phase: "3–6 months", category: "Entertainment" },
  { task: "Finalise & print invitations", phase: "3–6 months", category: "Invitations" },
  { task: "Plan haldi, mehendi & sangeet functions", phase: "3–6 months", category: "Ceremonies" },
  { task: "Arrange guest transport & logistics", phase: "1–3 months", category: "Guests" },
  { task: "Confirm final guest count with vendors", phase: "1–3 months", category: "Guests" },
  { task: "Bridal & groom trials (hair, makeup)", phase: "1–3 months", category: "Beauty" },
  { task: "Share the day-of timeline with the planner", phase: "Final month", category: "Planning" },
  { task: "Confirm payments & final vendor briefs", phase: "Final month", category: "Vendors" },
  { task: "Pack for the honeymoon", phase: "Final month", category: "Personal" },
];

export const STARTER_TIMELINE: { title: string; detail: string }[] = [
  { title: "Set your budget", detail: "Agree an overall budget and rough per-category split." },
  { title: "Book your venue", detail: "Lock the date and location — everything else follows." },
  { title: "Hire key vendors", detail: "Photographer, decor and catering fill up first." },
  { title: "Send invitations", detail: "Save-the-dates, then formal invitations." },
  { title: "Final headcount", detail: "Confirm numbers with every vendor." },
  { title: "Wedding week", detail: "Rehearsals, welcome, and the celebration itself." },
];
