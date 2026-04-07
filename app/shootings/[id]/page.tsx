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

import { Camera, ListTodo } from "lucide-react";

export default function ShootingDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [shooting, setShooting] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchShooting = async () => {
    try {
      const res = await fetch(`/api/shootings/${id}`);
      const data = await res.json();
      setShooting(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchShooting();
  }, [id]);

  if (loading) {
    return (
      <p className="text-muted-foreground text-center mt-10">Chargement...</p>
    );
  }

  if (!shooting) {
    return (
      <p className="text-muted-foreground text-center mt-10">
        Shooting introuvable
      </p>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md bg-background text-white">
        {/* HEADER */}
        <CardHeader>
          <CardTitle>
            Shooting : <br /> {shooting.title}
          </CardTitle>

          <CardDescription>
            {" "}
            {shooting.date
              ? new Date(shooting.date).toLocaleDateString()
              : "Pas de date"}{" "}
            <br /> {shooting.location || "Pas de lieu"}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* NAVIGATION */}
          <div className="flex flex-col gap-3">
            {/* MATERIEL */}
            <Item
              variant="outline"
              className="cursor-pointer bg-black/50"
              onClick={() => router.push(`/shootings/${id}/materiel`)}
            >
              <ItemMedia>
                <Camera className="size-5" />
              </ItemMedia>

              <ItemContent>
                <ItemTitle>Matériel</ItemTitle>
                <ItemDescription>
                  Gère les équipements du shooting
                </ItemDescription>
              </ItemContent>

              <ItemActions />
            </Item>

            {/* ACTIONS */}
            <Item
              variant="outline"
              className="cursor-pointer bg-black/50"
              onClick={() => router.push(`/shootings/${id}/actions`)}
            >
              <ItemMedia>
                <ListTodo className="size-5" />
              </ItemMedia>

              <ItemContent>
                <ItemTitle>Actions</ItemTitle>
                <ItemDescription>Suivi des tâches et étapes</ItemDescription>
              </ItemContent>

              <ItemActions />
            </Item>
          </div>

          {/* FOOTER */}
          <Button onClick={() => router.push("/shootings")}>Terminer</Button>
        </CardContent>
      </Card>
    </div>
  );
}
