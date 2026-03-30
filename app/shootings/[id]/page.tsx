"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ShootingDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [shooting, setShooting] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchShooting = async () => {
    try {
      const res = await fetch(`/api/shootings/${id}`);
      const data = await res.json();
      setShooting(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchShooting();
  }, [id]);

  if (loading) {
    return (
      <p className="text-muted-foreground text-center mt-10">Chargement...</p>
    );
  }

  if (!shooting) {
    return (
      <p className="text-muted-foreground text-center mt-10 ">
        Shooting introuvable
      </p>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-6 text-center">
      <div className="w-full max-w-3xl space-y-4 bg-background pb-5">
        {/* HEADER CARD */}
        <Card className="w-full max-w-3xl p-6  text-center text-white">
          <h1 className="text-2xl font-bold uppercase">{shooting.title}</h1>

          <div className="flex flex-row gap-1 justify-center">
            <p className=" text-white">
              Le{" "}
              {shooting.date
                ? new Date(shooting.date).toLocaleDateString()
                : "Pas de date"}
            </p>

            <p className=" text-white">
              à {shooting.location || "Pas de lieu"}
            </p>
          </div>
        </Card>

        {/* NAVIGATION BLOCKS */}
        <div className="w-full max-w-3xl flex flex-row  justify-around">
          {/* MATERIEL */}
          <Card
            onClick={() => router.push(`/shootings/${id}/materiel`)}
            className="cursor-pointer  flex-col items-center justify-center p-3 rounded "
          >
            <img src="/icons/materiel.svg" className="w-8" alt="materiel" />
            <h2 className="text-xl font-bold uppercase text-white">Matériel</h2>
          </Card>

          {/* ACTIONS */}
          <Card
            onClick={() => router.push(`/shootings/${id}/actions`)}
            className="cursor-pointer  flex flex-col items-center justify-center p-3 rounded"
          >
            <img src="/icons/actions.svg" className="w-8" alt="actions" />
            <h2 className="text-xl font-bold uppercase text-white">Actions</h2>
          </Card>
        </div>

        {/* FOOTER */}
        <div className="pt-4">
          <Button onClick={() => router.push("/shootings")}>Terminer</Button>
        </div>
      </div>
    </div>
  );
}
