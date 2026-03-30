"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewShootingPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const handleCreate = async () => {
    if (!title) return;

    const res = await fetch("/api/shootings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        date,
        location,
      }),
    });

    const newShooting = await res.json();

    router.push(`/shootings/${newShooting.id}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-xl p-6 space-y-6 bg-background">
        {/* TITLE */}
        <h1 className="text-2xl font-bold text-white">Nouveau shooting</h1>

        {/* FORM */}
        <div className="space-y-4 ">
          <Input
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-white"
          />

          <Input
            placeholder="Lieu"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="destructive"
            onClick={() => router.push("/shootings")}
          >
            Annuler
          </Button>

          <Button onClick={handleCreate}>Créer</Button>
        </div>
      </Card>
    </div>
  );
}
