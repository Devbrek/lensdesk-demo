"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewShootingPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const handleCreate = async () => {
    if (!title) return alert("Titre requis");

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

    // 👉 redirige vers la page détail
    router.push(`/shootings/${newShooting.id}`);
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center p-5">
      <h1 className="text-4xl font-bold mb-10">NOUVEAU SHOOTING</h1>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <input
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-white/10 p-3"
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-white/10 p-3"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-white/10 p-3"
        />

        <input
          placeholder="Lieu"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-white/10 p-3"
        />

        <button onClick={handleCreate}>Créer</button>
      </div>
    </div>
  );
}
