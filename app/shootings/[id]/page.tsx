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
    <div className="min-h-screen text-white flex flex-col items-center p-5">
      {/* HEADER */}
      <h1 className="text-4xl font-bold mb-2">{shooting.title}</h1>

      <p className="text-white/70">
        {shooting.date
          ? new Date(shooting.date).toLocaleDateString()
          : "Pas de date"}
      </p>

      <p className="text-white/70 mb-10">
        {shooting.location || "Pas de lieu"}
      </p>

      {/* BLOCS */}
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* MATERIEL */}
        <div className="bg-white/10 p-5">
          <h2 className="text-2xl mb-4">MATÉRIEL</h2>

          {shooting.checklist
            ?.filter((item: any) => item.type === "materiel")
            .map((item: any) => (
              <p key={item.id}>
                {item.checked ? "✔️" : "⬜"} {item.label}
              </p>
            ))}
        </div>

        {/* ACTIONS */}
        <div className="bg-white/10 p-5">
          <h2 className="text-2xl mb-4">ACTIONS</h2>

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
