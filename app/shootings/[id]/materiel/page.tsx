"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MaterielPage() {
  const router = useRouter();
  const { id } = useParams();

  const [items, setItems] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [newItemLabel, setNewItemLabel] = useState("");

  const getChecklistItem = (inventoryItemId: string) => {
    return items.find((item) => item.inventoryItemId === inventoryItemId);
  };

  const fetchChecklist = async () => {
    const res = await fetch(`/api/shootings/${id}/checklist?type=materiel`);
    const data = await res.json();
    setItems(data);
  };

  const fetchInventory = async () => {
    const res = await fetch("/api/inventory");
    const data = await res.json();
    setInventory(data);
  };

  useEffect(() => {
    fetchChecklist();
    fetchInventory();
  }, []);

  const handleToggleInventory = async (inventoryItemId: string) => {
    const existingItem = getChecklistItem(inventoryItemId);

    if (existingItem) {
      await fetch(`/api/shootings/${id}/checklist/${existingItem.id}`, {
        method: "DELETE",
      });
    } else {
      await fetch(`/api/shootings/${id}/checklist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inventoryItemId,
          type: "materiel",
        }),
      });
    }

    fetchChecklist();
  };

  const handleToggle = async (itemId: string, checked: boolean) => {
    await fetch(`/api/shootings/${id}/checklist/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checked: !checked }),
    });

    fetchChecklist();
  };

  const handleAddManual = async () => {
    if (!newItemLabel.trim()) return;

    await fetch(`/api/shootings/${id}/checklist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: newItemLabel,
        type: "materiel",
      }),
    });

    setNewItemLabel("");
    fetchChecklist();
  };

  const handleDeleteItem = async (itemId: string) => {
    await fetch(`/api/shootings/${id}/checklist/${itemId}`, {
      method: "DELETE",
    });

    fetchChecklist();
  };

  const isSelected = (inventoryItemId: string) =>
    items.some((item) => item.inventoryItemId === inventoryItemId);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <div className="w-full max-w-3xl space-y-2 bg-background  items-center justify-center py-3">
        {/* TITLE */}
        <h1 className="text-3xl font-bold text-white  uppercase">Matériel</h1>

        {/* INVENTORY */}
        <Card className="w-full  p-6 ">
          <h2 className="text-xl font-bold text-white">
            Ajouter depuis l’inventaire
          </h2>

          <div className="grid gap-2">
            {inventory.map((item) => (
              <button
                key={item.id}
                onClick={() => handleToggleInventory(item.id)}
                className={`
                w-full p-3 rounded-lg text-left transition
                ${
                  isSelected(item.id)
                    ? "bg-green-500 text-black"
                    : "bg-muted  hover:bg-muted/70"
                }
              `}
              >
                {item.label}
              </button>
            ))}
          </div>
        </Card>

        {/* CHECKLIST */}
        <Card className="w-full p-6 ">
          <h2 className="text-xl font-bold text-white">Checklist</h2>

          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-muted/40 p-3 rounded-lg bg-white"
              >
                <span
                  className={`flex-1 ${
                    item.checked ? "line-through opacity-50" : ""
                  }`}
                >
                  {item.label}
                </span>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleToggle(item.id, item.checked)}
                  />

                  <button onClick={() => handleDeleteItem(item.id)}>
                    <img
                      src="/icons/del.svg"
                      className="w-4 h-4"
                      alt="delete"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ADD INPUT */}
          <div className="flex gap-2  items-center">
            <Input
              value={newItemLabel}
              onChange={(e) => setNewItemLabel(e.target.value)}
              placeholder="Ajouter un item..."
              maxLength={30}
              onKeyDown={(e) => e.key === "Enter" && handleAddManual()}
              className="bg-white"
            />

            <button
              onClick={handleAddManual}
              className="p-2 rounded transition "
            >
              <img src="/icons/add.svg" className="w-6 h-6" alt="add" />
            </button>
          </div>
        </Card>

        {/* FOOTER */}
        <Button onClick={() => router.push(`/shootings/${id}`)}>Retour</Button>
      </div>
    </div>
  );
}
