"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface InventoryItem {
  id: string;
  label: string;
  type: string;
}

export default function InventoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Erreur en chargeant l'inventaire :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddItem = async () => {
    const label = prompt("Nom du nouvel item :");
    const type = prompt("Type de l'item : appareil, objectif, accessoire ...");
    if (!label || !type) return;

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, type }),
      });
      const newItem = await res.json();
      setItems([...items, newItem]);
    } catch (err) {
      console.error("Erreur lors de l'ajout :", err);
    }
  };

  const handleEditItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newLabel = prompt("Modifier le nom :", item.label);
    const newType = prompt("Modifier le type :", item.type);
    if (!newLabel || !newType) return;

    try {
      await fetch(`/api/inventory/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel, type: newType }),
      });
      setItems(
        items.map((i) =>
          i.id === id ? { ...i, label: newLabel, type: newType } : i,
        ),
      );
    } catch (err) {
      console.error("Erreur lors de la modification :", err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet item ?")) return;
    try {
      await fetch(`/api/inventory/${id}`, { method: "DELETE" });
      setItems(items.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-5 justify-center   text-white">
      <h1 className="text-5xl font-bold mb-8 text-white">INVENTAIRE</h1>

      <div className="w-full max-w-3xl p-10 flex flex-col gap-4 text-black bg-black/40 border-3 border-white backdrop-blur-xs rounded-xl">
        {loading ? (
          <p>Chargement...</p>
        ) : items.length === 0 ? (
          <p>Aucun item dans l&apos;inventaire</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white/70 p-3 "
            >
              <div>
                <p className="font-bold">{item.label}</p>
                <p className="text-sm text-black">{item.type}</p>
              </div>
              <div className="flex gap-5">
                {/* Modifier */}
                <button
                  onClick={() => handleEditItem(item.id)}
                  className="hover:opacity-80"
                >
                  <img
                    src="/icons/pencil.svg"
                    alt="Modifier"
                    className="w-6 h-6"
                  />
                </button>

                {/* Supprimer */}
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="hover:opacity-80"
                >
                  <img
                    src="/icons/del.svg"
                    alt="Supprimer"
                    className="w-6 h-6"
                  />
                </button>
              </div>
            </div>
          ))
        )}

        {/* Ajouter */}
        <button
          onClick={handleAddItem}
          className="mt-4 flex items-center justify-center  text-black font-bold gap-2"
        >
          <img src="/icons/add.svg" alt="Ajouter" className="w-10 h-10" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex gap-5 mt-10">
        <button
          onClick={() => router.push("/shootings")}
          className="w-full px-5 bg-white text-black rounded-full py-3 mt-2 font-semibold hover:bg-gray-200 transition uppercase"
        >
          Shootings
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full px-5 bg-white text-black rounded-full py-3 mt-2 font-semibold hover:bg-gray-200 transition uppercase"
        >
          Accueil
        </button>
      </div>
    </div>
  );
}
