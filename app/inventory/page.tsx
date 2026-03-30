"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InventoryItem {
  id: string;
  label: string;
  type: string;
}

export default function InventoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editType, setEditType] = useState("");

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddItem = async () => {
    const label = prompt("Nom de l'item ?");
    const type = prompt("Type ?");
    if (!label || !type) return;

    const res = await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, type }),
    });

    const newItem = await res.json();
    setItems((prev) => [...prev, newItem]);
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
    await fetch(`/api/inventory/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: editLabel, type: editType }),
    });

    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, label: editLabel, type: editType } : i,
      ),
    );

    cancelEditing();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/inventory/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-3xl space-y-6 bg-background p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Inventaire</h1>

          <Button
            variant="default"
            className="bg-sky-500 hover:bg-sky-600"
            onClick={handleAddItem}
          >
            Ajouter
          </Button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground">Aucun item</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <Card
                key={item.id}
                className="p-4 flex items-center justify-between text-white"
              >
                {/* LEFT */}
                <div className="flex flex-col gap-2 w-full">
                  {editingId === item.id ? (
                    <>
                      <Input
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        placeholder="Label"
                      />
                      <Input
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                        placeholder="Type"
                      />
                    </>
                  ) : (
                    <>
                      <p className="font-semibold">{item.label}</p>
                      <p className="text-sm text-muted-foreground text-white">
                        {item.type}
                      </p>
                    </>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 ml-4">
                  {editingId === item.id ? (
                    <>
                      <Button
                        size="icon"
                        onClick={() => saveEditing(item.id)}
                        className="bg-sky-500 hover:bg-sky-600"
                      >
                        ✓
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={cancelEditing}
                      >
                        ✕
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => startEditing(item)}
                      >
                        ✎
                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        🗑
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Retour
          </Button>
        </div>
      </div>
    </div>
  );
}
