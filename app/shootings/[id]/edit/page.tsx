"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditShootingPage() {
  const { id } = useParams();
  const router = useRouter();

  const [shooting, setShooting] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/shootings/${id}`);
      const data = await res.json();
      setShooting(data);
    };
    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    await fetch(`/api/shootings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(shooting),
    });

    router.push(`/shootings/${id}`);
  };

  if (!shooting) return <p className="text-white">Chargement...</p>;

  return (
    <div className="min-h-screen text-white flex flex-col items-center p-5">
      <h1 className="text-4xl font-bold mb-10">MODIFIER SHOOTING</h1>

      <div className="flex flex-col gap-4 w-full max-w-md ">
        <input
          value={shooting.title}
          onChange={(e) => setShooting({ ...shooting, title: e.target.value })}
          className="bg-white/80 p-3 text-black"
        />

        <input
          value={shooting.description || ""}
          onChange={(e) =>
            setShooting({ ...shooting, description: e.target.value })
          }
          className="bg-white/80 p-3 text-black"
        />

        <input
          type="date"
          value={shooting.date?.split("T")[0] || ""}
          onChange={(e) => setShooting({ ...shooting, date: e.target.value })}
          className="bg-white/80 p-3 text-black"
        />

        <input
          value={shooting.location || ""}
          onChange={(e) =>
            setShooting({ ...shooting, location: e.target.value })
          }
          className="bg-white/80 p-3 text-black"
        />

        <button
          onClick={handleUpdate}
          className="bg-white px-6 py-3 text-black"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}
