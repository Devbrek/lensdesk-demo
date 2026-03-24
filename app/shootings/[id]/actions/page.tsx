"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ActionPage() {
  const { id } = useParams();

  const [items, setItems] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [newItemLabel, setNewItemLabel] = useState("");

  const getChecklistItem = (inventoryItemId: string) => {
    return items.find((item) => item.inventoryItemId === inventoryItemId);
  };

  // fetch checklist (filtrée)
  const fetchChecklist = async () => {
    const res = await fetch(`/api/shootings/${id}/checklist?type=materiel`);
    const data = await res.json();
    setItems(data);
  };

  // fetch inventaire
  const fetchInventory = async () => {
    const res = await fetch("/api/inventory");
    const data = await res.json();
    setInventory(data);
  };

  useEffect(() => {
    fetchChecklist();
    fetchInventory();
  }, []);

  // ajouter depuis inventaire
  const handleToggleInventory = async (inventoryItemId: string) => {
    const existingItem = getChecklistItem(inventoryItemId);

    // 👉 SI déjà présent → DELETE
    if (existingItem) {
      await fetch(`/api/shootings/${id}/checklist/${existingItem.id}`, {
        method: "DELETE",
      });
    }
    // 👉 SINON → ADD
    else {
      await fetch(`/api/shootings/${id}/checklist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inventoryItemId,
          type: "materiel",
        }),
      });
    }

    fetchChecklist();
  };

  // toggle checked
  const handleToggle = async (itemId: string, checked: boolean) => {
    await fetch(`/api/shootings/${id}/checklist/${itemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ checked: !checked }),
    });

    fetchChecklist();
  };

  // AJOUT MANUEL
  const handleAddManual = async () => {
    if (!newItemLabel.trim()) return;

    await fetch(`/api/shootings/${id}/checklist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newItemLabel, type: "materiel" }),
    });

    setNewItemLabel(""); // reset input
    fetchChecklist(); // recharger checklist
  };

  const handleDeleteItem = async (itemId: string) => {
    await fetch(`/api/shootings/${id}/checklist/${itemId}`, {
      method: "DELETE",
    });

    fetchChecklist();
  };

  const isSelected = (inventoryItemId: string) => {
    return items.some((item) => item.inventoryItemId === inventoryItemId);
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center  p-5">
      <h1 className="text-4xl font-bold mb-10 text-center">MATÉRIEL</h1>

      {/* INVENTAIRE */}
      <div className="bg-black/70 p-10 border-white border-2 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center gap-3 backdrop-blur-xs">
        <h2 className="text-white text-2xl font-semibold ">
          Ajouter depuis inventaire
        </h2>

        {inventory.map((item) => (
          <button
            key={item.id}
            onClick={() => handleToggleInventory(item.id)}
            className={`w-full py-2 ${
              isSelected(item.id)
                ? "bg-green-500 text-black"
                : "bg-white text-black"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* CHECKLIST */}
      <div className="bg-black/70 p-10 border-white border-2 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center gap-5 backdrop-blur-xs">
        <h2 className="text-white text-2xl font-semibold">Checklist :</h2>

        {items.map((item) => (
          <div
            key={item.id}
            className="w-full flex justify-between items-center bg-white text-black px-4 py-2 rounded"
          >
            {/* TEXTE */}
            <span
              className={`flex-1 ${item.checked ? "line-through opacity-50 " : ""}`}
            >
              {item.label}
            </span>

            {/* ACTIONS DROITE */}
            <div className="flex items-center gap-3">
              {/* CHECKBOX */}
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleToggle(item.id, item.checked)}
              />

              {/* DELETE ICON */}
              <button onClick={() => handleDeleteItem(item.id)}>
                <img src="/icons/del.svg" className="w-4 h-4" alt="delete" />
              </button>
            </div>
          </div>
        ))}

        {/* AJOUT NOUVEL ITEM INLINE */}
        <div className="flex w-full mt-2 gap-2">
          <input
            type="text"
            placeholder="Ajouter un nouvel item..."
            className="flex-1 px-3 py-2 rounded text-white border-white border "
            value={newItemLabel}
            onChange={(e) => setNewItemLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddManual()} // Enter ajoute
          />
          <button
            onClick={handleAddManual}
            className="p-2 rounded flex items-center justify-center"
          >
            <img src="/icons/add.svg" className="w-8 h-8" alt="add" />
          </button>
        </div>
      </div>
    </div>
  );
}
