import FAQ from "@/app/(web)/components/faq";
import Features from "@/app/(web)/components/features";
import Footer from "@/app/(web)/components/footer";
import Testimonial from "@/app/(web)/components/testimonial";

import Hero from "./components/hero";

export default async function RoutePage() {
  return (
    <>
      <Hero />
      {/* <MouseAnimation /> */}
      <Features />
      <FAQ />
      <Testimonial />
      {/* <Pricing /> */}
      <Footer />
    </>
  );
}
