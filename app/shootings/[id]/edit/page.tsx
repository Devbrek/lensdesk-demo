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
      <h1 className="text-4xl font-bold mb-10 text-center">{shooting.title}</h1>

      <div className="flex flex-col  w-full max-w-md bg-white/70 backdrop-blur-xs p-10 rounded-xl text-black">
        <h2 className="text-xl pb-3">Titre</h2>
        <input
          value={shooting.title}
          onChange={(e) => setShooting({ ...shooting, title: e.target.value })}
          className="bg-white/80 p-3 text-black mb-5"
        />
        <h2 className="text-xl  pb-3 ">Description</h2>
        <input
          value={shooting.description || ""}
          onChange={(e) =>
            setShooting({ ...shooting, description: e.target.value })
          }
          className="bg-white/80 p-3 text-black mb-5"
        />
        <h2 className="text-xl  pb-3 ">Date</h2>
        <input
          type="date"
          value={shooting.date?.split("T")[0] || ""}
          onChange={(e) => setShooting({ ...shooting, date: e.target.value })}
          className="bg-white/80 p-3 text-black mb-5"
        />
        <h2 className="text-xl  pb-3 ">Lieu</h2>
        <input
          value={shooting.location || ""}
          onChange={(e) =>
            setShooting({ ...shooting, location: e.target.value })
          }
          className="bg-white/80 p-3 text-black mb-10"
        />

        <button
          onClick={handleUpdate}
          className="w-fit m-auto px-5 bg-white text-black rounded-full py-3 mt-2 font-semibold hover:bg-gray-200 transition uppercase"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}
