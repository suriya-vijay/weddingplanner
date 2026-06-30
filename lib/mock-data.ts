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

// ── Inspiration Gallery ─────────────────────────────────────────
// Pinterest/Instagram-style items. Imagery = on-brand gradient plates with a
// per-item aspect ratio so a masonry layout reads naturally. Each item tags the
// vendors involved (PRD requirement). Mock data — no backend yet.

export const ceremonies = [
  "Mandap",
  "Sangeet",
  "Mehendi",
  "Haldi",
  "Reception",
  "Pheras",
  "Baraat",
] as const;

export const traditions = [
  "North Indian",
  "South Indian",
  "Punjabi · Sikh",
  "Marwari",
  "Bengali",
  "Tamil",
  "Gujarati",
] as const;

export const colorThemes = [
  "Forest & Gold",
  "Blush & Ivory",
  "Marigold",
  "Royal Maroon",
  "Peacock",
  "Champagne",
] as const;

export const budgetTiers = ["₹", "₹₹", "₹₹₹", "₹₹₹₹"] as const;

export const locations = [
  "Udaipur",
  "Jaipur",
  "Goa",
  "Mumbai",
  "Lake Como",
  "Kerala",
] as const;

export type InspirationItem = {
  id: string;
  title: string;
  ceremony: (typeof ceremonies)[number];
  tradition: (typeof traditions)[number];
  color: (typeof colorThemes)[number];
  budget: (typeof budgetTiers)[number];
  location: (typeof locations)[number];
  vendors: string[];
  plate: Plate;
  /** aspect ratio (w/h) — drives natural masonry height variation */
  aspect: number;
};

const galleryPlates: Record<string, Plate> = {
  ...plates,
  marigold: "linear-gradient(145deg, #c9621f 0%, #e89b1f 55%, #f6d77a 100%)",
  maroon: "linear-gradient(150deg, #4a1418 0%, #7b2d26 60%, #b5564a 120%)",
  peacock: "linear-gradient(150deg, #0a3b40 0%, #0e5c63 55%, #2d9aa3 120%)",
  ivory: "linear-gradient(150deg, #d8c9a8 0%, #f3ead4 60%, #fbf8f3 100%)",
  emerald: "linear-gradient(150deg, #0f2c1f 0%, #2d6a4f 50%, #95d5b2 130%)",
};

export const inspirationItems: InspirationItem[] = [
  {
    id: "insp-1",
    title: "Golden Mandap at Dawn",
    ceremony: "Mandap",
    tradition: "North Indian",
    color: "Forest & Gold",
    budget: "₹₹₹₹",
    location: "Udaipur",
    vendors: ["Mandap Studio", "The Lighthouse Films"],
    plate: galleryPlates.dusk,
    aspect: 0.78,
  },
  {
    id: "insp-2",
    title: "Marigold Mehendi Courtyard",
    ceremony: "Mehendi",
    tradition: "Marwari",
    color: "Marigold",
    budget: "₹₹",
    location: "Jaipur",
    vendors: ["House of Mehendi", "Gulaal Decor"],
    plate: galleryPlates.marigold,
    aspect: 1.0,
  },
  {
    id: "insp-3",
    title: "Blush Beachside Reception",
    ceremony: "Reception",
    tradition: "Punjabi · Sikh",
    color: "Blush & Ivory",
    budget: "₹₹₹",
    location: "Goa",
    vendors: ["Seaside Frames", "Petal & Pearl", "DJ Aurelius"],
    plate: galleryPlates.blush,
    aspect: 1.3,
  },
  {
    id: "insp-4",
    title: "Royal Maroon Pheras",
    ceremony: "Pheras",
    tradition: "North Indian",
    color: "Royal Maroon",
    budget: "₹₹₹₹",
    location: "Udaipur",
    vendors: ["Saffron Catering", "Mandap Studio"],
    plate: galleryPlates.maroon,
    aspect: 0.85,
  },
  {
    id: "insp-5",
    title: "Peacock Sangeet Stage",
    ceremony: "Sangeet",
    tradition: "Gujarati",
    color: "Peacock",
    budget: "₹₹₹",
    location: "Mumbai",
    vendors: ["DJ Aurelius", "Bloom & Co."],
    plate: galleryPlates.peacock,
    aspect: 1.15,
  },
  {
    id: "insp-6",
    title: "Sunlit Haldi in Kerala",
    ceremony: "Haldi",
    tradition: "South Indian",
    color: "Marigold",
    budget: "₹",
    location: "Kerala",
    vendors: ["House of Mehendi"],
    plate: galleryPlates.gold,
    aspect: 0.92,
  },
  {
    id: "insp-7",
    title: "Lakeside Champagne Vows",
    ceremony: "Reception",
    tradition: "Tamil",
    color: "Champagne",
    budget: "₹₹₹₹",
    location: "Lake Como",
    vendors: ["Bloom & Co.", "The Lighthouse Films"],
    plate: galleryPlates.champagne,
    aspect: 1.4,
  },
  {
    id: "insp-8",
    title: "Emerald Baraat Procession",
    ceremony: "Baraat",
    tradition: "Punjabi · Sikh",
    color: "Forest & Gold",
    budget: "₹₹₹",
    location: "Jaipur",
    vendors: ["Gulaal Decor", "DJ Aurelius"],
    plate: galleryPlates.emerald,
    aspect: 0.8,
  },
  {
    id: "insp-9",
    title: "Ivory Bengali Morning",
    ceremony: "Pheras",
    tradition: "Bengali",
    color: "Blush & Ivory",
    budget: "₹₹",
    location: "Mumbai",
    vendors: ["Anita Makeovers", "Seaside Frames"],
    plate: galleryPlates.ivory,
    aspect: 1.05,
  },
  {
    id: "insp-10",
    title: "Forest & Gold Mandap",
    ceremony: "Mandap",
    tradition: "South Indian",
    color: "Forest & Gold",
    budget: "₹₹₹₹",
    location: "Kerala",
    vendors: ["Mandap Studio", "Saffron Catering"],
    plate: galleryPlates.forest,
    aspect: 0.88,
  },
  {
    id: "insp-11",
    title: "Rose Twilight Sangeet",
    ceremony: "Sangeet",
    tradition: "Marwari",
    color: "Royal Maroon",
    budget: "₹₹₹",
    location: "Udaipur",
    vendors: ["DJ Aurelius", "Gulaal Decor"],
    plate: galleryPlates.rose,
    aspect: 1.2,
  },
  {
    id: "insp-12",
    title: "Champagne Reception Tablescape",
    ceremony: "Reception",
    tradition: "Gujarati",
    color: "Champagne",
    budget: "₹₹₹",
    location: "Goa",
    vendors: ["Petal & Pearl", "Saffron Catering"],
    plate: galleryPlates.champagne,
    aspect: 0.95,
  },
];
