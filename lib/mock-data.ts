import type { LucideIcon } from "lucide-react";
import {
  Sparkles,
  Store,
  LayoutDashboard,
  ListChecks,
  Compass,
  Bot,
  Wallet,
  CalendarClock,
  Users,
  UserCheck,
} from "lucide-react";

/**
 * Mock content for the landing page (Phase 1 — no backend).
 * Imagery is represented as on-brand gradient "plates" (CSS) so the layout
 * reads luxurious without committing external/copyrighted assets.
 */

export type Plate = string; // a CSS background value

const plates: Record<string, Plate> = {
  forest:
    "linear-gradient(135deg, #1b4332 0%, #2d6a4f 55%, #40916c 100%)",
  gold: "linear-gradient(135deg, #8a6d1f 0%, #c9a227 60%, #ecdcae 100%)",
  blush: "linear-gradient(135deg, #d99aa0 0%, #e8b4b8 55%, #f9e9e6 100%)",
  dusk: "linear-gradient(140deg, #0f2c1f 0%, #2d6a4f 60%, #c9a227 130%)",
  rose: "linear-gradient(140deg, #1b4332 0%, #d99aa0 130%)",
  champagne:
    "linear-gradient(135deg, #2d6a4f 0%, #d8b961 70%, #f6eed4 100%)",
};

// ── Featured Weddings ───────────────────────────────────────────
export type FeaturedWedding = {
  couple: string;
  location: string;
  tradition: string;
  plate: Plate;
  vendors: string[];
  large?: boolean;
};

export const featuredWeddings: FeaturedWedding[] = [
  {
    couple: "Aanya & Vikram",
    location: "Udaipur, Rajasthan",
    tradition: "North Indian · Hindu",
    plate: plates.dusk,
    vendors: ["The Lighthouse Films", "Mandap Studio", "Saffron Catering"],
    large: true,
  },
  {
    couple: "Priya & Arjun",
    location: "Lake Como, Italy",
    tradition: "Tamil · Destination",
    plate: plates.champagne,
    vendors: ["Bloom & Co.", "House of Mehendi"],
  },
  {
    couple: "Neha & Rohan",
    location: "Jaipur, Rajasthan",
    tradition: "Marwari · Hindu",
    plate: plates.rose,
    vendors: ["Gulaal Decor", "Anita Makeovers"],
  },
  {
    couple: "Simran & Karan",
    location: "Goa, India",
    tradition: "Punjabi · Sikh",
    plate: plates.gold,
    vendors: ["Seaside Frames", "DJ Aurelius", "Petal & Pearl"],
  },
];

// ── Popular Vendors ─────────────────────────────────────────────
export type Vendor = {
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  startingAt: string;
  plate: Plate;
};

export const popularVendors: Vendor[] = [
  {
    name: "The Lighthouse Films",
    category: "Photography & Film",
    location: "Mumbai",
    rating: 4.9,
    reviews: 218,
    startingAt: "₹3,50,000",
    plate: plates.forest,
  },
  {
    name: "Mandap Studio",
    category: "Decor & Mandap",
    location: "Delhi NCR",
    rating: 4.8,
    reviews: 164,
    startingAt: "₹6,00,000",
    plate: plates.gold,
  },
  {
    name: "House of Mehendi",
    category: "Mehendi Artistry",
    location: "Jaipur",
    rating: 5.0,
    reviews: 97,
    startingAt: "₹45,000",
    plate: plates.blush,
  },
  {
    name: "Saffron Catering",
    category: "Catering",
    location: "Hyderabad",
    rating: 4.7,
    reviews: 301,
    startingAt: "₹1,800 / plate",
    plate: plates.champagne,
  },
];

export const vendorCategories: string[] = [
  "Photography",
  "Videography",
  "Decor",
  "Catering",
  "Makeup",
  "Mehendi",
  "DJs",
  "Florists",
  "Venues",
  "Invitations",
  "Bridal Fashion",
  "Jewelry",
  "Priests",
  "Choreographers",
];

// ── Platform Features (the 10 core features) ────────────────────
export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const features: Feature[] = [
  {
    icon: Sparkles,
    title: "Inspiration Gallery",
    description:
      "Save ideas, build mood boards, and explore real weddings — every vendor tagged, so you can hire the look you love.",
  },
  {
    icon: Store,
    title: "Vendor Marketplace",
    description:
      "Discover trusted photographers, decorators, caterers and more, with portfolios, pricing and availability in one place.",
  },
  {
    icon: LayoutDashboard,
    title: "Wedding Dashboard",
    description:
      "Your entire wedding — countdown, progress, budget, guests and planner — gathered into one calm workspace.",
  },
  {
    icon: ListChecks,
    title: "Smart Checklist",
    description:
      "A personalised checklist that adapts to your traditions, ceremonies and wedding size — guided, never overwhelming.",
  },
  {
    icon: Compass,
    title: "Step-by-Step Assistant",
    description:
      "Guided planning that walks you from engagement to the final farewell, one elegant step at a time.",
  },
  {
    icon: Bot,
    title: "AI Wedding Advisor",
    description:
      "A luxury planning advisor that understands Indian traditions — palettes, vendors, timelines and ideas, on demand.",
  },
  {
    icon: Wallet,
    title: "Budget Tracker",
    description:
      "Set a budget and watch it stay effortless — every booking updates your spend, by category, automatically.",
  },
  {
    icon: CalendarClock,
    title: "Wedding Timeline",
    description:
      "A personalised timeline of bookings, deadlines and ceremonies that updates itself as your plans evolve.",
  },
  {
    icon: Users,
    title: "Guest List & RSVPs",
    description:
      "Manage guests, families, meal preferences and RSVPs with grace — attendance tracked at a glance.",
  },
  {
    icon: UserCheck,
    title: "Your Wedding Planner",
    description:
      "A dedicated human planner assigned to your wedding — and on the day itself, the one orchestrating every moment.",
  },
];

// ── Testimonials ────────────────────────────────────────────────
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Kalyanam turned three cities and four ceremonies into something we could actually enjoy. It felt like having a luxury planner in our pocket — and a real one on the day.",
    name: "Aanya Mehra",
    role: "Bride · Udaipur",
    initials: "AM",
  },
  {
    quote:
      "Every vendor we booked came from a wedding we'd admired in the gallery. No cold calls, no guesswork — just taste, beautifully organised.",
    name: "Vikram Shah",
    role: "Groom · Mumbai",
    initials: "VS",
  },
  {
    quote:
      "As the mother of the bride, I finally felt in control of the budget. The timeline kept the whole family moving together, gently.",
    name: "Sunita Rao",
    role: "Mother of the Bride · Bengaluru",
    initials: "SR",
  },
];

// ── FAQ ─────────────────────────────────────────────────────────
export const faqs = [
  {
    question: "Which Indian wedding traditions does Kalyanam support?",
    answer:
      "All of them. The platform adapts to North and South Indian, Hindu, Sikh, Muslim, Christian, Jain and interfaith celebrations — and lets every wedding feel completely personalised to your family's customs.",
  },
  {
    question: "Do I really get a human wedding planner?",
    answer:
      "Yes. Every couple is assigned a dedicated planner who guides you through the journey. On the wedding day itself, your planner is responsible for coordinating the execution so you can simply be present.",
  },
  {
    question: "How does the AI Wedding Advisor work alongside my planner?",
    answer:
      "The AI advisor helps with ideas, palettes, vendor suggestions and timelines whenever inspiration strikes. It complements — never replaces — your human planner, who owns the real-world coordination.",
  },
  {
    question: "Can my family help with the planning?",
    answer:
      "Absolutely. The primary account holder is the administrator and can invite parents, siblings and family members as collaborators, each with their own permissions to help.",
  },
  {
    question: "Is Kalyanam only for weddings in India?",
    answer:
      "No — Kalyanam is built for luxury Indian weddings anywhere in the world, from Udaipur to Lake Como, with vendors and planning tools that travel with you.",
  },
];
