// app/page.tsx (ou /landing/page.tsx)

import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-white flex flex-col">
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}
