"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter()
  return (
    <section className="flex flex-col items-center justify-center text-center py-20 px-6">
      <h1 className="text-4xl font-bold mb-4">
        Organise tes shootings simplement
      </h1>

      <p className="text-muted-foreground max-w-md mb-6">
        Gère ton matériel, tes actions et tes projets en un seul endroit.
      </p>

    <img src="/icons/logo2.png" alt="logo" className="w-50" />
    </section>
  );
}
