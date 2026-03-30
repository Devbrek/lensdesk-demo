"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
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
    return <p className=" text-center mt-10 ">Chargement...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 ">
      <Card className="w-full max-w-2xl p-6 space-y-6 bg-background">
        {/* TITLE */}
        <h1 className="text-2xl font-bold text-white text-center">
          Modifier le shooting
        </h1>

        {/* TITLE FIELD */}
        <div className="space-y-2">
          <label className="text-sm text-white">Titre</label>
          <Input
            value={shooting.title}
            onChange={(e) =>
              setShooting({ ...shooting, title: e.target.value })
            }
            className="bg-white "
          />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <label className="text-sm text-white">Description</label>
          <Input
            value={shooting.description || ""}
            onChange={(e) =>
              setShooting({ ...shooting, description: e.target.value })
            }
            className="bg-white"
          />
        </div>

        {/* DATE */}
        <div className="space-y-2">
          <label className="text-sm text-white">Date</label>
          <Input
            type="date"
            value={shooting.date?.split("T")[0] || ""}
            onChange={(e) => setShooting({ ...shooting, date: e.target.value })}
            className="bg-white"
          />
        </div>

        {/* LOCATION */}
        <div className="space-y-2">
          <label className="text-sm text-white">Lieu</label>
          <Input
            value={shooting.location || ""}
            onChange={(e) =>
              setShooting({ ...shooting, location: e.target.value })
            }
            className="bg-white"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-center gap-3 pt-4">
          <Button onClick={handleUpdate}>Valider</Button>

          <Button
            variant="destructive"
            onClick={() => router.push("/shootings")}
          >
            Annuler
          </Button>
        </div>
      </Card>
    </div>
  );
}
