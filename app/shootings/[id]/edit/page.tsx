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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditShootingPage() {
  const { id } = useParams();
  const router = useRouter();

  const [shooting, setShooting] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/shootings/${id}`);
        const data = await res.json();
        setShooting(data);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    await fetch(`/api/shootings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(shooting),
    });

    router.push("/shootings");
  };

  if (loading || !shooting) {
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
            <CardTitle>Modifier le shooting</CardTitle>
            <CardDescription>
              Mets à jour les informations du projet
            </CardDescription>
          </CardHeader>
        </Card>

        {/* FORM */}
        <Card className="bg-background text-white">
          <CardContent className="flex flex-col gap-5 pt-6">
            {/* TITLE */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Titre</label>

              <Input
                value={shooting.title}
                onChange={(e) =>
                  setShooting({ ...shooting, title: e.target.value })
                }
                className="bg-white text-black text-sm"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Description
              </label>

              <Input
                value={shooting.description || ""}
                onChange={(e) =>
                  setShooting({
                    ...shooting,
                    description: e.target.value,
                  })
                }
                className="bg-white text-black text-sm"
              />
            </div>

            {/* DATE */}
            <div className="space-y-2">
              <label className="text-sm  text-muted-foreground ">Date</label>

              <Input
                type="date"
                value={shooting.date?.split("T")[0] || ""}
                onChange={(e) =>
                  setShooting({ ...shooting, date: e.target.value })
                }
                className="bg-white text-black text-sm"
              />
            </div>

            {/* LOCATION */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground text-sm">
                Lieu
              </label>

              <Input
                value={shooting.location || ""}
                onChange={(e) =>
                  setShooting({
                    ...shooting,
                    location: e.target.value,
                  })
                }
                className="bg-white text-black text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* ACTIONS */}
        <Card className="bg-background text-black">
          <CardContent className="flex flex-col gap-3 ">
            <Button onClick={handleUpdate}>Valider les modifications</Button>

            <Button variant="destructive" onClick={() => router.push("/shootings")}>
              Annuler
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
