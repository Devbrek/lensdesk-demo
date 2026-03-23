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

  // CREATE
  const handleAdd = async () => {
    const title = prompt("Nom du shooting :");
    const description = prompt("Description (optionnelle) :");

    if (!title) return;

    try {
      const res = await fetch("/api/shootings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      const newShooting = await res.json();
      setShootings([...shootings, newShooting]);
    } catch (err) {
      console.error(err);
    }
  };

  // EDIT
  const handleEdit = async (id: string) => {
    const shooting = shootings.find((s) => s.id === id);
    if (!shooting) return;

    const newTitle = prompt("Modifier le titre :", shooting.title);
    const newDesc = prompt(
      "Modifier la description :",
      shooting.description || "",
    );

    if (!newTitle) return;

    try {
      await fetch(`/api/shootings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
        }),
      });

      setShootings(
        shootings.map((s) =>
          s.id === id ? { ...s, title: newTitle, description: newDesc } : s,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

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
      <h1 className="text-5xl font-bold mb-8 text-white">SHOOTINGS</h1>

      <div className="w-full max-w-3xl flex flex-col gap-4 text-black bg-black/70 backdrop-blur-xs p-10 rounded-xl border-3 border-white ">
        {loading ? (
          <p>Chargement...</p>
        ) : shootings.length === 0 ? (
          <p>Aucun shooting</p>
        ) : (
          shootings.map((shooting) => (
            <div
              key={shooting.id}
              className="flex flex-col justify-between items-center bg-white p-3 rounded-xl"
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
                  <img src="/icons/pencil.svg" className="w-5 h-5" alt="edit" />
                </button>

                {/* DELETE */}
                <button onClick={() => handleDelete(shooting.id)}>
                  <img src="/icons/del.svg" className="w-5 h-5" alt="delete" />
                </button>
                {/* DETAILS */}
                <button
                  onClick={() => router.push(`/shootings/${shooting.id}`)}
                >
                  <img src="/icons/eye.svg" className="w-5 h-5" alt="voir" />
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
          <img src="/icons/add.svg" className="w-10 h-10" alt="add" />
        </button>
      </div>

      {/* NAVIGATION */}
      <div className="flex gap-5 mt-10">
        <button
          onClick={() => router.push("/inventory")}
          className="w-full px-5 bg-white text-black rounded-full py-3 mt-2 font-semibold hover:bg-gray-200 transition uppercase"
        >
          Inventaire
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full px-5 bg-white text-black rounded-full py-3 mt-2 font-semibold hover:bg-gray-200 transition uppercase"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}
