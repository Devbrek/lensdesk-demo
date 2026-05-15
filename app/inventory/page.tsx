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
  ItemTitle,
  ItemDescription,
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

  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editType, setEditType] = useState("");

  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState("");

  const [labelError, setLabelError] = useState("");
  const [typeError, setTypeError] = useState("");
  const [globalError, setGlobalError] = useState("");

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      setItems(data);
    } catch {
      setGlobalError("Error loading inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    setSuccess("");
    setGlobalError("");

    let hasError = false;

    if (!newLabel.trim()) {
      setLabelError("Name is required");
      hasError = true;
    } else {
      setLabelError("");
    }

    if (!newType) {
      setTypeError("Type is required");
      hasError = true;
    } else {
      setTypeError("");
    }

    if (hasError) return;

    setAdding(true);

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel, type: newType }),
      });

      if (!res.ok) throw new Error();

      const newItem = await res.json();

      setItems((prev) => [...prev, newItem]);

      setNewLabel("");
      setNewType("");
      setSuccess("Item added successfully ✔");
    } catch {
      setGlobalError("Error adding item");
    } finally {
      setAdding(false);
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

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);

    try {
      await fetch(`/api/inventory/${deleteId}`, { method: "DELETE" });

      setItems((prev) => prev.filter((i) => i.id !== deleteId));
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

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
      <Card className="w-full max-w-md bg-card text-white">
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
          <CardDescription>Manage your gear</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* FORM */}
          <form onSubmit={handleAddItem} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label>Item name</Label>
              <Input
                value={newLabel}
                onChange={(e) => {
                  setNewLabel(e.target.value);
                  setLabelError("");
                  setSuccess("");
                }}
                className={labelError ? "border-red-500" : ""}
              />
              {labelError && (
                <p className="text-red-400 text-xs">{labelError}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Type</Label>

              <Select
                value={newType}
                onValueChange={(value) => {
                  if (!value) return;
                  setNewType(value);
                  setTypeError("");
                  setSuccess("");
                }}
              >
                <SelectTrigger className={typeError ? "border-red-500" : ""}>
                  <SelectValue placeholder="Equipment type" />
                </SelectTrigger>

                <SelectContent>
                  {ITEM_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {typeError && <p className="text-red-400 text-xs">{typeError}</p>}
            </div>

            <Button type="submit" disabled={adding}>
              {adding ? "Adding..." : "Add"}
            </Button>

            {globalError && (
              <p className="text-red-400 text-sm text-center">{globalError}</p>
            )}

            {success && (
              <p className="text-green-400 text-sm text-center">{success}</p>
            )}
          </form>

          {/* LIST + SKELETON */}
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <Item key={i} variant="outline">
                  <ItemMedia>
                    <div className="w-5 h-5 bg-gray-600 rounded animate-pulse" />
                  </ItemMedia>

                  <ItemContent>
                    <div className="h-3 bg-gray-600 rounded w-2/3 mb-2 animate-pulse" />
                    <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse" />
                  </ItemContent>

                  <ItemActions>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-700 rounded animate-pulse" />
                      <div className="w-8 h-8 bg-gray-700 rounded animate-pulse" />
                    </div>
                  </ItemActions>
                </Item>
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground text-center">No items</p>
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
                            if (!value) return;
                            setEditType(value);
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
                          onClick={() => setDeleteId(item.id)}
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
            Back
          </Button>

          {/* MODAL DELETE */}
          {deleteId && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-background p-6 rounded-lg w-full max-w-sm space-y-4 text-white">
                <h2 className="text-lg font-semibold">Delete this item?</h2>

                <p className="text-sm text-muted-foreground">
                  This action is irreversible. The item will be permanently
                  removed from your inventory.
                </p>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setDeleteId(null)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
