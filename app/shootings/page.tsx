"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Shooting {
  id: string;
  title: string;
  description?: string;
}

export default function ShootingsPage() {
  const router = useRouter();
  const [shootings, setShootings] = useState<Shooting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShootings = async () => {
    try {
      const res = await fetch("/api/shootings");
      const data = await res.json();
      setShootings(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShootings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce shooting ?")) return;

    await fetch(`/api/shootings/${id}`, {
      method: "DELETE",
    });

    setShootings((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-3xl space-y-6 bg-background p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold uppercase ">Shootings</h1>

          <Button onClick={() => router.push("/shootings/new")}>Nouveau</Button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : shootings.length === 0 ? (
          <p className="text-muted-foreground">Aucun shooting</p>
        ) : (
          <div className="space-y-3 ">
            {shootings.map((shooting) => (
              <Card
                key={shooting.id}
                className=" flex items-center justify-between text-center "
              >
                {/* LEFT */}
                <div className="flex flex-col gap-1">
                  <p className="font-bold uppercase tracking-widest ">
                    {shooting.title}
                  </p>

                  {shooting.description && (
                    <p className="text-sm  text-white">
                      {shooting.description}
                    </p>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => router.push(`/shootings/${shooting.id}`)}
                  >
                    <img src="/icons/eyeW.svg" alt="see" />
                  </Button>

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      router.push(`/shootings/${shooting.id}/edit`)
                    }
                  >
                    <img src="/icons/pencilW.svg" alt="pencil" />
                  </Button>

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleDelete(shooting.id)}
                  >
                    <img src="/icons/del.svg" alt="delete" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Retour
          </Button>
        </div>
      </div>
    </div>
  );
}
