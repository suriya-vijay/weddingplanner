import { Hero } from "@/components/sections/hero";
import { FeaturedWeddings } from "@/components/sections/featured-weddings";
import { PopularVendors } from "@/components/sections/popular-vendors";
import { PlatformFeatures } from "@/components/sections/platform-features";
import { Trust } from "@/components/sections/trust";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedWeddings />
      <PopularVendors />
      <PlatformFeatures />
      <Trust />
      <Testimonials />
      <Faq />
      <Cta />
    </>
  );
}
