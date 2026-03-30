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
  ItemMedia,
} from "@/components/ui/item";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Check, Plus } from "lucide-react";

export default function ActionPage() {
  const router = useRouter();
  const { id } = useParams();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItemLabel, setNewItemLabel] = useState("");

  const remainingItems = items.filter((item) => !item.checked).length;

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
            {items.length === 0 && (
              <p className="text-sm text-muted-foreground text-center">
                Aucune action pour le moment
              </p>
            )}

            {items.map((item) => {
              const done = item.checked;

              return (
                <Item
                  key={item.id}
                  variant="outline"
                  className={`transition ${
                    done ? "bg-green-500/10 border-green-500/40" : ""
                  }`}
                >
                  <ItemMedia>
                    <div
                      className={`flex items-center justify-center size-8 rounded-full ${
                        done
                          ? "bg-green-500 text-black"
                          : "bg-white/5 text-white"
                      }`}
                    >
                      <Check className="size-4" />
                    </div>
                  </ItemMedia>

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
                </Item>
              );
            })}

            {/* INPUT */}
            <div className="flex flex-col  pt-2 items-center">
              <div className="flex flex-row gap-2">
                <Input
                  value={newItemLabel}
                  onChange={(e) => setNewItemLabel(e.target.value)}
                  placeholder="Ajouter une action..."
                  onKeyDown={(e) => e.key === "Enter" && handleAddManual()}
                />

                <Button
                  onClick={handleAddManual}
                  size="icon"
                  disabled={!newItemLabel.trim()}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Entre du texte puis clique sur + pour ajouter un élément
              </p>
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
