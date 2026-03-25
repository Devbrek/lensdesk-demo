"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

interface InventoryItem {
  id: string;
  label: string;
  type: string;
}

export default function InventoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // État pour l'édition inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editType, setEditType] = useState("");

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

  const startEditing = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditLabel(item.label);
    setEditType(item.type);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditLabel("");
    setEditType("");
  };

  const saveEditing = async (id: string) => {
    try {
      await fetch(`/api/inventory/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: editLabel, type: editType }),
      });

      setItems(
        items.map((i) =>
          i.id === id ? { ...i, label: editLabel, type: editType } : i,
        ),
      );
      cancelEditing();
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
    <div className="min-h-screen flex flex-col items-center p-5 justify-center text-white">
      <div className="w-full max-w-3xl p-5 flex flex-col gap-2 text-black bg-black/70 backdrop-blur-xs rounded-xl">
        <h1 className="text-3xl font-bold mb-5 text-white ">INVENTAIRE</h1>
        {loading ? (
          <p>Chargement...</p>
        ) : items.length === 0 ? (
          <p>Aucun item dans l&apos;inventaire</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex px-2  py-1 rounded gap-3 justify-between items-center bg-white "
            >
              {editingId === item.id ? (
                <div className="flex flex-col ">
                  <h3>Nom</h3>
                  <input
                    className="p-1 rounded border"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                  />
                  <h3>Type</h3>
                  <input
                    className="p-1  rounded border"
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <p className="font-bold">{item.label}</p>
                  <p className="text-sm text-black">{item.type}</p>
                </div>
              )}

              <div className="flex gap-7 ms-3">
                {editingId === item.id ? (
                  <>
                    <button
                      onClick={() => saveEditing(item.id)}
                      className="hover:opacity-80 "
                    >
                      <img
                        src="/icons/checked.svg"
                        alt="checked"
                        className="w-6 h-6"
                      />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="hover:opacity-80"
                    >
                      <img
                        src="/icons/cross.svg"
                        alt="cross"
                        className="w-5 h-5"
                      />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(item)}
                      className="hover:opacity-80"
                    >
                      <img
                        src="/icons/pencil.svg"
                        alt="Modifier"
                        className="w-4 "
                      />
                    </button>

                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="hover:opacity-80"
                    >
                      <img
                        src="/icons/del.svg"
                        alt="Supprimer"
                        className="w-3"
                      />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}

        <div className="flex gap-8 justify-center mt-2">
          <button
            onClick={handleAddItem}
            className=" flex items-center justify-center text-black font-bold "
          >
            <img src="/icons/add.svg" alt="Ajouter" className="w-7 " />
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex justify-center items-center "
          >
            <img src="/icons/ok.svg" className="w-7" alt="ok" />
          </button>
        </div>
      </div>
    </div>
  );
}
