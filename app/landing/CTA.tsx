"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CTA() {
  const router = useRouter();

  return (
    <section className="py-20 text-center ">
      <h2 className="text-2xl font-bold mb-4">
        Prêt à organiser tes shootings ?
      </h2>
      <p className="text-muted-foreground">Scan ce QR code</p>
      <img src="/qr/qr-abz-W.png" alt="qr" className="w-50  mx-auto" />
    </section>
  );
}
