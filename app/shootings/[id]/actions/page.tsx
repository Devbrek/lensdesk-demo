"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ActionPage() {
  const router = useRouter();
  const { id } = useParams();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItemLabel, setNewItemLabel] = useState("");

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
  }, [id]);

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
      body: JSON.stringify({
        label: newItemLabel,
        type: "action",
      }),
    });

    setNewItemLabel("");
    fetchChecklist();
  };

  if (loading) {
    return (
      <p className="text-muted-foreground text-center mt-10">Chargement...</p>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center  space-y-6">
      <div className="w-full max-w-2xl space-y-6 bg-background py-5">
        {/* HEADER */}
        <h1 className="text-3xl font-bold text-center uppercase tracking-wide ">
          Actions
        </h1>

        {/* CARD LIST */}
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            {items.length === 0 && (
              <p className="text-white text-center text-sm">
                Aucune action pour le moment
              </p>
            )}

            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between  p-3 hover:bg-muted/40 transition bg-white "
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

                  <button onClick={() => handleDelete(item.id)}>
                    <img
                      src="/icons/del.svg"
                      className="w-4 h-4 opacity-70 hover:opacity-100 transition"
                      alt="delete"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="flex gap-2 pt-2  items-center">
            <Input
              value={newItemLabel}
              onChange={(e) => setNewItemLabel(e.target.value)}
              placeholder="Ajouter une action..."
              onKeyDown={(e) => e.key === "Enter" && handleAddManual()}
              className="bg-white"
            />

            <img
              src="/icons/add.svg"
              className="w-5 h-5 "
              alt="add"
              onClick={handleAddManual}
            />
          </div>
        </Card>

        {/* BACK */}
        <div className="flex justify-center">
          <Button onClick={() => router.push(`/shootings/${id}`)}>
            Retour
          </Button>
        </div>
      </div>
    </div>
  );
}
