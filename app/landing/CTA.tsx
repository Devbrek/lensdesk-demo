"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CTA() {
  const router = useRouter();

  return (
    <section className="py-20 text-center ">
      <h2 className="text-2xl font-bold mb-4 px-5">
        Prêt à organiser tes shootings ?
      </h2>
      <Button
        onClick={() => router.push("/")}
        className="bg-foreground text-black px-10 py-8 text-xl hover:bg-muted-foreground"
      >
        Clique ici
      </Button>
    </section>
  );
}
