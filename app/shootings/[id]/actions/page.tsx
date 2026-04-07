"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Check, Plus } from "lucide-react";

type Priority = 1 | 2 | 3 | 4 | 5;

export default function ActionPage() {
  const router = useRouter();
  const { id } = useParams();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [newItemPriority, setNewItemPriority] = useState<Priority>(3);

  const fetchChecklist = async () => {
    try {
      const res = await fetch(`/api/shootings/${id}/checklist?type=action`);
      const data = await res.json();
      setItems(data);
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
        priority: newItemPriority,
      }),
    });

    setNewItemLabel("");
    setNewItemPriority(3);
    fetchChecklist();
  };

  const getPriority = (item: any): Priority => {
    const p = Number(item.priority);
    if (p >= 1 && p <= 5) return p as Priority;
    return 3;
  };

  const getPriorityClass = (priority: Priority) => {
    switch (priority) {
      case 1:
        return "text-red-400 border-red-500/40 bg-red-500/10"; // critique
      case 2:
        return "text-orange-400 border-orange-500/40 bg-orange-500/10";
      case 3:
        return "text-yellow-400 border-yellow-500/40 bg-yellow-500/10";
      case 4:
        return "text-green-400 border-green-500/40 bg-green-500/10";
      case 5:
        return "text-blue-400 border-blue-500/40 bg-blue-500/10"; // faible
      default:
        return "text-yellow-400 border-yellow-500/40 bg-yellow-500/10";
    }
  };

  // 🔥 TRI FINAL : priorité DESC + non faits en premier
  const sortedItems = [...items].sort((a, b) => {
    const pa = getPriority(a);
    const pb = getPriority(b);

    if (pb !== pa) return pb - pa; // P5 → P1

    if (a.checked !== b.checked) return a.checked ? 1 : -1;

    return 0;
  });

  const remainingItems = items.filter((item) => !item.checked).length;

  if (loading) {
    return (
      <p className="text-muted-foreground text-center mt-10">Chargement...</p>
    );
  }

  return (
    <div className="min-h-screen flex justify-center pt-10">
      <div className="w-full max-w-md space-y-6">
        {/* HEADER */}
        <Card className="bg-background text-white text-center">
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Organise les tâches du shooting</CardDescription>
          </CardHeader>

          <CardContent className="pt-0 pb-5 flex flex-col items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-muted-foreground">
              {remainingItems} restant{remainingItems > 1 ? "s" : ""}
            </span>

            {remainingItems === 0 && (
              <p className="text-green-400 text-xs">
                ✔ Toutes les actions sont terminées
              </p>
            )}
          </CardContent>
        </Card>

        {/* LIST */}
        <Card className="bg-background text-white">
          <CardContent className="flex flex-col gap-3">
            {sortedItems.length === 0 && (
              <p className="text-sm text-muted-foreground text-center">
                Aucune action pour le moment
              </p>
            )}

            {sortedItems.map((item) => {
              const done = item.checked;
              const priority = getPriority(item);

              return (
                <Item
                  key={item.id}
                  variant="outline"
                  className={`flex items-center justify-between transition ${
                    done ? "bg-green-500/10 border-green-500/40" : ""
                  }`}
                >
                  {/* CONTENT */}
                  <ItemContent>
                    <ItemTitle
                      className={done ? "line-through opacity-60" : ""}
                    >
                      {item.label}
                    </ItemTitle>

                    <ItemDescription>
                      {done ? (
                        <span className="text-green-400">Terminé</span>
                      ) : (
                        "En attente"
                      )}
                    </ItemDescription>
                  </ItemContent>

                  {/* RIGHT SIDE */}
                  <div className="flex items-center gap-3">
                    {/* PRIORITY */}
                    <span
                      className={`text-xs px-2 py-1 rounded-md border ${getPriorityClass(
                        priority,
                      )}`}
                    >
                      P{priority}
                    </span>

                    {/* ACTIONS */}
                    <ItemActions>
                      <div className="flex gap-2 items-center">
                        <Button
                          size="icon"
                          variant={done ? "default" : "outline"}
                          onClick={() => handleToggle(item.id, item.checked)}
                          className={
                            done
                              ? "bg-green-500 text-black hover:bg-green-400"
                              : ""
                          }
                        >
                          <Check className="size-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <img
                            src="/icons/del.svg"
                            className="w-4 h-4"
                            alt="delete"
                          />
                        </Button>
                      </div>
                    </ItemActions>
                  </div>
                </Item>
              );
            })}

            {/* INPUT */}
            <div className="flex flex-col pt-2 items-center justify-center">
              <div className="flex flex-row gap-2 items-end">
                <Input
                  value={newItemLabel}
                  onChange={(e) => setNewItemLabel(e.target.value)}
                  placeholder="Ajouter une action..."
                  onKeyDown={(e) => e.key === "Enter" && handleAddManual()}
                />

                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Priorité
                  </span>

                  <select
                    value={newItemPriority}
                    onChange={(e) =>
                      setNewItemPriority(Number(e.target.value) as Priority)
                    }
                    className="bg-background border border-white/10 rounded-md px-2 py-1 text-sm"
                  >
                    <option value={1}>P1</option>
                    <option value={2}>P2</option>
                    <option value={3}>P3</option>
                    <option value={4}>P4</option>
                    <option value={5}>P5</option>
                  </select>
                </div>

                <Button
                  onClick={handleAddManual}
                  size="icon"
                  disabled={!newItemLabel.trim()}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BACK */}
        <div className="flex justify-center pb-5">
          <Button onClick={() => router.push(`/shootings/${id}`)}>
            Retour
          </Button>
        </div>
      </div>
    </div>
  );
}
