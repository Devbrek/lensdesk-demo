"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchShooting();
  }, [id]);

  if (loading) return <p className="text-white">Chargement...</p>;
  if (!shooting) return <p className="text-white">Shooting introuvable</p>;

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-5 gap-3">
      {/* HEADER */}
      <div className="bg-black/70 text-center items-center justify-center p-5 rounded-xl backdrop-blur-xs flex flex-col gap-2">
        <h1 className="text-4xl font-bold ">Shooting : {shooting.title}</h1>

        <p className="text-white">
          Date :{" "}
          {shooting.date
            ? new Date(shooting.date).toLocaleDateString()
            : "Pas de date"}
        </p>
        <p className="text-white ">
          Lieu : {shooting.location || "Pas de lieu"}
        </p>
      </div>

      {/* BLOCS */}
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* MATERIEL */}
        <div className="cursor-pointer py-20 px-20 bg-white/40 rounded-xl shadow-lg flex items-center justify-center text-white text-2xl md:text-4xl font-bold hover:bg-white/10 transition uppercase backdrop-blur-xs ">
          <h2>MATÉRIEL</h2>

          {shooting.checklist
            ?.filter((item: any) => item.type === "materiel")
            .map((item: any) => (
              <p key={item.id}>
                {item.checked ? "✔️" : "⬜"} {item.label}
              </p>
            ))}
        </div>

        {/* ACTIONS */}
        <div className="cursor-pointer py-20 px-20 bg-white/40 rounded-xl shadow-lg flex items-center justify-center text-white text-2xl md:text-4xl font-bold hover:bg-white/10 transition uppercase backdrop-blur-xs ">
          <h2>ACTIONS</h2>

          {shooting.checklist
            ?.filter((item: any) => item.type === "action")
            .map((item: any) => (
              <p key={item.id}>
                {item.checked ? "✔️" : "⬜"} {item.label}
              </p>
            ))}
        </div>
      </div>

      {/* NAV */}
      <div className="mt-10">
        <button
          onClick={() => router.push("/shootings")}
          className="bg-white px-6 py-3 text-black"
        >
          Retour
        </button>
      </div>
    </div>
  );
}
