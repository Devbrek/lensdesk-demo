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

import { Calendar } from "lucide-react";

interface Shooting {
  id: string;
  title: string;
  description?: string;
}

export default function ShootingsPage() {
  const router = useRouter();
  const [shootings, setShootings] = useState<Shooting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShootings = async () => {
    try {
      const res = await fetch("/api/shootings");
      const data = await res.json();
      setShootings(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShootings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce shooting ?")) return;

    await fetch(`/api/shootings/${id}`, {
      method: "DELETE",
    });

    setShootings((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md bg-card text-white">
        {/* HEADER */}
        <CardHeader>
          <CardTitle>Shootings</CardTitle>
          <CardDescription>Organise tes sessions photo</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* ACTION TOP */}
          <div className="flex justify-end">
            <Button onClick={() => router.push("/shootings/new")}>
              Nouveau
            </Button>
          </div>

          {/* CONTENT */}
          {loading ? (
            <div className="flex flex-col gap-3">
              <p>Chargement...</p>
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
                      <div className="w-8 h-8 bg-gray-700 rounded animate-pulse" />
                    </div>
                  </ItemActions>
                </Item>
              ))}
            </div>
          ) : shootings.length === 0 ? (
            <p className="text-muted-foreground text-center">Aucun shooting</p>
          ) : (
            <div className="flex flex-col gap-3">
              {shootings.map((shooting) => (
                <Item key={shooting.id} variant="outline">
                  <ItemMedia>
                    <Calendar className="size-5" />
                  </ItemMedia>

                  <ItemContent>
                    <ItemTitle>{shooting.title}</ItemTitle>

                    {shooting.description && (
                      <ItemDescription>{shooting.description}</ItemDescription>
                    )}
                  </ItemContent>

                  <ItemActions>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => router.push(`/shootings/${shooting.id}`)}
                      >
                        <img src="/icons/eyeW.svg" alt="see" />
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          router.push(`/shootings/${shooting.id}/edit`)
                        }
                      >
                        <img src="/icons/pencilW.svg" alt="edit" />
                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(shooting.id)}
                      >
                        <img src="/icons/del.svg" alt="delete" />
                      </Button>
                    </div>
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
