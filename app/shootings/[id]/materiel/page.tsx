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

import { Package, Check, ChevronDown } from "lucide-react";

export default function MaterielPage() {
  const router = useRouter();
  const { id } = useParams();

  const [items, setItems] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);

  const [loadingChecklist, setLoadingChecklist] = useState(true);
  const [loadingInventory, setLoadingInventory] = useState(true);

  const [newItemLabel, setNewItemLabel] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const fetchChecklist = async () => {
    setLoadingChecklist(true);
    try {
      const res = await fetch(`/api/shootings/${id}/checklist?type=materiel`);
      const data = await res.json();
      setItems(data);
    } finally {
      setLoadingChecklist(false);
    }
  };

  const fetchInventory = async () => {
    setLoadingInventory(true);
    try {
      const res = await fetch("/api/inventory");
      const data = await res.json();
      setInventory(data);
    } finally {
      setLoadingInventory(false);
    }
  };

  useEffect(() => {
    fetchChecklist();
    fetchInventory();
  }, [id]);

  const getChecklistItem = (inventoryItemId: string) =>
    items.find((item) => item.inventoryItemId === inventoryItemId);

  const isSelected = (inventoryItemId: string) =>
    items.some((item) => item.inventoryItemId === inventoryItemId);

  const remainingItems = items.filter((item) => !item.checked).length;

  const isChecklistEmpty = !loadingChecklist && items.length === 0;
  const isChecklistDone =
    !loadingChecklist && items.length > 0 && remainingItems === 0;

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

  return (
    <div className="min-h-screen flex items-center justify-center pt-10">
      <div className="w-full max-w-md space-y-6">
        {/* HEADER */}
        <Card className="bg-background text-white text-center">
          <CardHeader>
            <CardTitle>Matériel</CardTitle>
            <CardDescription>
              Prépare ton équipement pour le shooting
            </CardDescription>
          </CardHeader>
        </Card>

        {/* INVENTAIRE */}
        <Card className="bg-background text-white">
          <CardContent className="flex flex-col">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-between w-full"
            >
              <h2 className="font-semibold">Ajouter depuis l’inventaire</h2>

              <ChevronDown
                className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* LOADING INVENTAIRE */}
            {loadingInventory && (
              <div className="space-y-2 pt-3">
                <div className="h-10 bg-white/5 animate-pulse rounded-md" />
                <div className="h-10 bg-white/5 animate-pulse rounded-md" />
              </div>
            )}

            {/* LIST INVENTAIRE */}
            {!loadingInventory && (
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? "opacity-100 mt-3" : "max-h-0 opacity-0"
                }`}
              >
                <div className="flex flex-col gap-2">
                  {inventory.map((item) => (
                    <Item
                      key={item.id}
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => handleToggleInventory(item.id)}
                    >
                      <ItemMedia>
                        {isSelected(item.id) ? (
                          <Check className="size-5" />
                        ) : (
                          <Package className="size-5" />
                        )}
                      </ItemMedia>

                      <ItemContent>
                        <ItemTitle>{item.label}</ItemTitle>
                        <ItemDescription>
                          {isSelected(item.id) ? "Sélectionné" : "Disponible"}
                        </ItemDescription>
                      </ItemContent>

                      <ItemActions />
                    </Item>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CHECKLIST */}
        <Card className="bg-background text-white">
          <CardContent className="flex flex-col gap-4">
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Checklist</h2>

              <span className="text-xs text-muted-foreground">
                {loadingChecklist
                  ? "Chargement..."
                  : `${remainingItems} restant${remainingItems > 1 ? "s" : ""}`}
              </span>
            </div>

            {/* LOADING CHECKLIST */}
            {loadingChecklist && (
              <div className="space-y-2">
                <div className="h-10 bg-white/5 animate-pulse rounded-md" />
                <div className="h-10 bg-white/5 animate-pulse rounded-md" />
              </div>
            )}

            {/* EMPTY */}
            {isChecklistEmpty && (
              <p className="text-sm text-muted-foreground text-center">
                Aucun matériel ajouté
              </p>
            )}

            {/* DONE STATE */}
            {isChecklistDone && (
              <p className="text-green-400 text-xs">
                ✔ Tout le matériel est prêt
              </p>
            )}

            {/* LIST */}
            {!loadingChecklist &&
              items.map((item) => {
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
                      {done ? (
                        <div className="flex items-center justify-center size-8 rounded-full bg-green-500 text-black">
                          <Check className="size-4" />
                        </div>
                      ) : (
                        <Package className="size-5 opacity-80" />
                      )}
                    </ItemMedia>

                    <ItemContent>
                      <ItemTitle
                        className={done ? "line-through opacity-60" : ""}
                      >
                        {item.label}
                      </ItemTitle>

                      <ItemDescription>
                        {done ? (
                          <span className="text-green-400">✓ Terminé</span>
                        ) : (
                          "En attente"
                        )}
                      </ItemDescription>
                    </ItemContent>

                    <ItemActions>
                      <div className="flex gap-2">
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
                          onClick={() => handleDeleteItem(item.id)}
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
            <div className="flex gap-2">
              <Input
                value={newItemLabel}
                onChange={(e) => setNewItemLabel(e.target.value)}
                placeholder="Ex : 2 batteries..."
                onKeyDown={(e) => e.key === "Enter" && handleAddManual()}
              />

              <Button
                onClick={handleAddManual}
                size="icon"
                disabled={!newItemLabel.trim()}
              >
                +
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Entre du texte puis clique sur +
            </p>
          </CardContent>
        </Card>

        {/* FOOTER */}
        <div className="flex justify-center pb-5">
          <Button onClick={() => router.push(`/shootings/${id}`)}>
            Retour
          </Button>
        </div>
      </div>
    </div>
  );
}
