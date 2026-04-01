// app/page.tsx (ou /landing/page.tsx)

import Hero from "@/app/landing/Hero";
import Features from "@/app/landing/Features";
import CTA from "@/app/landing/CTA";
import Footer from "@/app/landing/Footer";

export default function LandingPage() {
  return (
    <main className=" bg-background text-white flex flex-col justify-center items-center mx-auto min-h-screen">
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}
