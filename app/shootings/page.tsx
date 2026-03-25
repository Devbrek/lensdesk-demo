"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Shooting {
  id: string;
  title: string;
  description?: string;
}

export default function ShootingsPage() {
  const router = useRouter();
  const [shootings, setShootings] = useState<Shooting[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH
  const fetchShootings = async () => {
    try {
      const res = await fetch("/api/shootings");
      const data = await res.json();
      setShootings(data);
    } catch (err) {
      console.error("Erreur chargement shootings :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShootings();
  }, []);

  // DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce shooting ?")) return;

    try {
      await fetch(`/api/shootings/${id}`, {
        method: "DELETE",
      });

      setShootings(shootings.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center  p-5 ">
      
     

      <div className="w-full max-w-3xl p-5 flex flex-col gap-2 text-black bg-black/70 backdrop-blur-xs rounded-xl">
       <h1 className="text-3xl font-bold mb-8 text-white">SHOOTINGS</h1>
        {loading ? (
          <p>Chargement...</p>
        ) : shootings.length === 0 ? (
          <p>Aucun shooting</p>
        ) : (
          shootings.map((shooting) => (
            <div
              key={shooting.id}
              className="flex px-2  py-1 rounded gap-3 justify-between items-center bg-white"
            >
              <div className="pb-4">
                <p className="font-bold">{shooting.title}</p>
                {shooting.description && (
                  <p className="text-sm text-gray-900">
                    {shooting.description}
                  </p>
                )}
              </div>

              <div className="flex gap-7">
                {/* EDIT */}
                <button
                  onClick={() => router.push(`/shootings/${shooting.id}/edit`)}
                >
                  <img src="/icons/pencil.svg" className="w-4" alt="edit" />
                </button>

                {/* DELETE */}
                <button onClick={() => handleDelete(shooting.id)}>
                  <img src="/icons/del.svg" className="w-3" alt="delete" />
                </button>
                {/* DETAILS */}
                <button
                  onClick={() => router.push(`/shootings/${shooting.id}`)}
                >
                  <img src="/icons/eye.svg" className="w-4" alt="voir" />
                </button>
              </div>
            </div>
          ))
        )}

        {/* ADD */}
        <button
          onClick={() => router.push("/shootings/new")}
          className="flex justify-center items-center gap-2 mt-4"
        >
          <img src="/icons/add.svg" className="w-7" alt="add" />
        </button>
      </div>
    </div>
  );
}
