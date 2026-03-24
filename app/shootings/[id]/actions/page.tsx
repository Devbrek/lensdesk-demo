"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ActionPage() {
  const router = useRouter();
  const { id } = useParams();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItemLabel, setNewItemLabel] = useState("");

  // fetch checklist type action
  const fetchChecklist = async () => {
    try {
      const res = await fetch(`/api/shootings/${id}/checklist?type=action`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklist();
  }, []);

  const handleToggle = async (itemId: string, checked: boolean) => {
    await fetch(`/api/shootings/${id}/checklist/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checked: !checked }),
    });
    fetchChecklist();
  };

  const handleDelete = async (itemId: string) => {
    await fetch(`/api/shootings/${id}/checklist/${itemId}`, {
      method: "DELETE",
    });
    fetchChecklist();
  };

  const handleAddManual = async () => {
    if (!newItemLabel.trim()) return;

    await fetch(`/api/shootings/${id}/checklist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newItemLabel, type: "action" }),
    });

    setNewItemLabel("");
    fetchChecklist();
  };

  if (loading) return <p className="text-white">Chargement...</p>;
  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center  p-5">
      <h1 className="text-4xl font-bold mb-10 text-center">ACTIONS</h1>

      {/* CHECKLIST ACTIONS */}
      <div className="bg-black/70 p-10 border-white border-2 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center gap-5 backdrop-blur-xs">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center w-full bg-white px-4 py-2 rounded text-black"
          >
            <span
              className={`${item.checked ? "line-through opacity-50" : ""} flex-1`}
            >
              {item.label}
            </span>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleToggle(item.id, item.checked)}
              />
              <button onClick={() => handleDelete(item.id)}>
                <img src="/icons/del.svg" className="w-4 h-4" alt="delete" />
              </button>
            </div>
          </div>
        ))}

        {/* Input ajout manuel */}
        <div className="flex w-full mt-2 gap-2">
          <input
            type="text"
            placeholder="Ajouter une action..."
            value={newItemLabel}
            onChange={(e) => setNewItemLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddManual()}
            className="flex-1 px-3 py-2 rounded text-white border border-white"
          />
          <button
            onClick={handleAddManual}
            className=" p-2 rounded flex items-center justify-center"
          >
            <img src="/icons/add.svg" className="w-8 h-8" alt="add" />
          </button>
        </div>
      </div>
      <button
        onClick={() => router.push("/shootings")}
        className="w-full px-5 bg-white text-black rounded-full py-3 mt-2 font-semibold hover:bg-gray-200 transition uppercase"
      >
        Retour
      </button>
    </div>
  );
}
