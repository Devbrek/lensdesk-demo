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

  // Chargement des items depuis l'API
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

  // Ajouter un item
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

  // Modifier un item
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

  // Supprimer un item
  const handleDeleteItem = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cet item ?")) return;

    try {
      await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
      });
      setItems(items.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  return (
    <div className="min-h-screen   flex flex-col items-center p-5">
      <h1 className="text-5xl font-bold mb-8 text-white">INVENTAIRE</h1>

      <div className="w-full max-w-3xl  p-5 flex flex-col gap-4">
        {loading ? (
          <p>Chargement...</p>
        ) : items.length === 0 ? (
          <p>Aucun item dans l&apos;inventaire</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white/40  p-3"
            >
              <div>
                <p className="font-bold">{item.label}</p>
                <p className="text-sm text-black">{item.type}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditItem(item.id)}
                  className="bg-white text-black px-3 py-1  "
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="bg-red-500 text-white px-3 py-1  hover:bg-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
        {/* Bouton ajouter */}
        <button
          onClick={handleAddItem}
          className="mt-4 bg-green-500 px-3 py-2 rounded hover:bg-green-600 text-black font-bold"
        >
          + Ajouter un item
        </button>
      </div>

      {/* Navigation en bas */}
      <div className="flex gap-5 mt-10">
        <button
          onClick={() => router.push("/shootings")}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Aller sur Shootings
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600"
        >
          Retour Dashboard
        </button>
      </div>
    </div>
  );
}
