"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  ItemDescription,
  ItemTitle,
  ItemMedia,
} from "@/components/ui/item";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Camera,
  Mic,
  Lightbulb,
  Package,
  HardDrive,
  Battery,
  Zap,
  Clapperboard,
  Wrench,
} from "lucide-react";

interface InventoryItem {
  id: string;
  label: string;
  type: string;
}

const ITEM_TYPES = [
  "camera",
  "lumiere",
  "micro",
  "outil",
  "stockage",
  "batterie",
  "electrique",
  "decors",
  "autre",
] as const;

export default function InventoryPage() {
  const router = useRouter();

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editType, setEditType] = useState("");

  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState("");

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

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newLabel || !newType) return;

    const res = await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newLabel, type: newType }),
    });

    const newItem = await res.json();

    setItems((prev) => [...prev, newItem]);

    setNewLabel("");
    setNewType("");
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

  // 🎯 ICON SYSTEM COMPLET
  const getIconByType = (type: string) => {
    switch (type.toLowerCase()) {
      case "camera":
        return <Camera className="size-5" />;

      case "lumiere":
        return <Lightbulb className="size-5" />;

      case "electrique":
        return <Zap className="size-5" />;

      case "micro":
        return <Mic className="size-5" />;

      case "outil":
        return <Wrench className="size-5" />;

      case "stockage":
        return <HardDrive className="size-5" />;

      case "batterie":
        return <Battery className="size-5" />;

      case "decors":
        return <Clapperboard className="size-5" />;

      default:
        return <Package className="size-5" />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md bg-background text-white">
        <CardHeader>
          <CardTitle>Inventaire</CardTitle>
          <CardDescription>Gère ton matériel simplement</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* FORMULAIRE */}
          <form onSubmit={handleAddItem} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label>Nom de l’item</Label>
              <Input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Ex: Sony A7III"
              />
            </div>

            <div className="grid gap-2">
              <Label>Type</Label>

              <Select
                value={newType}
                onValueChange={(value) => {
                  if (value) setNewType(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type d’équipement" />
                </SelectTrigger>

                <SelectContent>
                  {ITEM_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit">Ajouter</Button>
          </form>

          {/* LISTE */}
          {loading ? (
            <p className="text-muted-foreground">Chargement...</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground">Aucun item</p>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <Item key={item.id} variant="outline">
                  <ItemMedia>{getIconByType(item.type)}</ItemMedia>

                  <ItemContent>
                    {editingId === item.id ? (
                      <div className="flex flex-col gap-2 w-full">
                        <Input
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                        />

                        <Select
                          value={editType}
                          onValueChange={(value) => {
                            if (value) setEditType(value);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            {ITEM_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <>
                        <ItemTitle>{item.label}</ItemTitle>
                        <ItemDescription>{item.type}</ItemDescription>
                      </>
                    )}
                  </ItemContent>

                  <ItemActions>
                    {editingId === item.id ? (
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          onClick={() => saveEditing(item.id)}
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
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => startEditing(item)}
                        >
                          <img
                            src="/icons/pencilW.svg"
                            alt="edit"
                            className="w-5"
                          />
                        </Button>

                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <img
                            src="/icons/del.svg"
                            alt="delete"
                            className="w-3"
                          />
                        </Button>
                      </div>
                    )}
                  </ItemActions>
                </Item>
              ))}
            </div>
          )}

          {/* FOOTER */}
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Retour
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
