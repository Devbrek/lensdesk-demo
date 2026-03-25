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
    <div className="min-h-screen  flex flex-col items-center justify-center p-5">
      <div className="w-full max-w-3xl p-5 flex flex-col gap-2  bg-black/70 backdrop-blur-xs rounded-xl">
        <h1 className="text-3xl font-bold mb-8  text-white">
          NOUVEAU SHOOTING
        </h1>

        <div className="flex flex-col gap-4 w-full max-w-md text-black">
          <input
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-white/70 p-3 text-black"
          />

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-white/70 p-3 text-black"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-white/70 p-3 text-black"
          />

          <input
            placeholder="Lieu"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-white/70 p-3 text-black"
          />

<div className="flex justify-center gap-8 mt-4">
           <button
          onClick={() => handleCreate()}
          className="flex justify-center items-center "
        >
          <img src="/icons/checked.svg" className="w-6" alt="add" />
        </button>
           <button
          onClick={() => router.push("/shootings")}
          className="flex justify-center items-center "
        >
          <img src="/icons/cross.svg" className="w-5" alt="add" />
        </button>
        </div>
        </div>
      </div>
    </div>
  );
}
