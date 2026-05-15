"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewShootingPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/shootings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          date,
          location,
        }),
      });

      const newShooting = await res.json();

      router.push(`/shootings/${newShooting.id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center pt-10">
      <div className="w-full max-w-md space-y-6">
        {/* HEADER */}
        <Card className="bg-card text-white text-center">
          <CardHeader>
            <CardTitle>New shoot</CardTitle>
            <CardDescription>
              Create a new shoot project
            </CardDescription>
          </CardHeader>
        </Card>

        {/* FORM */}
        <Card className="bg-card text-white">
          <CardContent className="flex flex-col gap-5 pt-6">
            {/* TITLE */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Title</label>

              <Input
                placeholder="E.g. Studio shoot Paris"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white text-black"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Description
              </label>

              <Input
                placeholder="E.g. Client portrait session"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white text-black"
              />
            </div>

            {/* DATE */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Date</label>

              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="bg-white text-black"
              />
            </div>

            {/* LOCATION */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Location</label>

              <Input
                placeholder="E.g. Paris"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white text-black"
              />
            </div>
          </CardContent>
        </Card>

        {/* ACTIONS */}
        <Card className="bg-background text-white">
          <CardContent className="flex flex-col gap-3 pt-6">
            <Button onClick={handleCreate} disabled={!title.trim() || loading}>
              {loading ? "Creating..." : "Create shoot"}
            </Button>

            <Button variant="outline" onClick={() => router.push("/shootings")}>
              Cancel
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
