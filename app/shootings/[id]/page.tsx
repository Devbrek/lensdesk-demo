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
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-5   ">
      <div className="w-screen md:w-full max-w-3xl p-5 flex flex-col gap-2 text-white bg-black/70 backdrop-blur-xs rounded-xl text-center">
        <div>
          <h1 className="text-white text-2xl mb-2">Shooting : {shooting.title}</h1>
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
          <div
            onClick={() => router.push(`/shootings/${id}/materiel`)}
            className="cursor-pointer py-11 px-20 bg-white/40 rounded-xl shadow-lg flex items-center justify-center text-white text-2xl md:text-4xl font-bold hover:bg-white/10 transition uppercase backdrop-blur-xs flex-col gap-3"
          >
            <img src="/icons/materiel.svg" alt="materiel" className="w-8" />
            <h2>MATÉRIEL</h2>
          </div>

          {/* ACTIONS */}
          <div
            onClick={() => router.push(`/shootings/${id}/actions`)}
            className="cursor-pointer py-11 px-20 bg-white/40 rounded-xl shadow-lg flex items-center justify-center text-white text-2xl md:text-4xl font-bold hover:bg-white/10 transition uppercase backdrop-blur-xs flex-col"
          >
            <img src="/icons/actions.svg" alt="actions" className="w-8" />
            <h2>ACTIONS</h2>
          </div>
        </div>
      </div>

      {/* NAV */}
      <div className="mt-10">
         <button onClick={() => router.push("/shootings")} className="w-10  ">
            <img src="/icons/ok.svg" alt="ok" />
          </button>
      </div>
    </div>
  );
}
