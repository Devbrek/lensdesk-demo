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

    router.push(`/shootings/`);
  };

  if (!shooting) return <p className="text-white">Chargement...</p>;

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-5">
      <div className="w-screen md:w-full max-w-3xl p-5 flex flex-col gap-2 text-white bg-black/70 backdrop-blur-xs rounded-xl">
        <h1 className="text-4xl font-bold  text-center">{shooting.title}</h1>

        <h2 className=" ">Titre</h2>
        <input
          value={shooting.title}
          onChange={(e) => setShooting({ ...shooting, title: e.target.value })}
          className="bg-white/80 p-3 text-black mb-2"
        />
        <h2 className=" ">Description</h2>
        <input
          value={shooting.description || ""}
          onChange={(e) =>
            setShooting({ ...shooting, description: e.target.value })
          }
          className="bg-white/80 p-3 text-black mb-2"
        />
        <h2 className="  ">Date</h2>
        <input
          type="date"
          value={shooting.date?.split("T")[0] || ""}
          onChange={(e) => setShooting({ ...shooting, date: e.target.value })}
          className="bg-white/80 p-3 text-black mb-2"
        />
        <h2 className=" ">Lieu</h2>
        <input
          value={shooting.location || ""}
          onChange={(e) =>
            setShooting({ ...shooting, location: e.target.value })
          }
          className="bg-white/80 p-3 text-black mb-5"
        />

        <div className="flex justify-center gap-8">
          <button onClick={() => handleUpdate()} className="w-7  ">
            <img src="/icons/ok.svg" alt="ok" />
          </button>
          <button onClick={() => router.push("/shootings")} className="w-6 ">
            <img src="/icons/cross.svg" alt="cross" />
          </button>
        </div>
      </div>
    </div>
  );
}
