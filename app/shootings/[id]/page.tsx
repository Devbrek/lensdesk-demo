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
      <p className="text-muted-foreground text-center mt-10">Loading...</p>
    );
  }

  if (!shooting) {
    return (
      <p className="text-muted-foreground text-center mt-10">
        Shoot not found
      </p>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md bg-card text-white">
        {/* HEADER */}
        <CardHeader>
          <CardTitle>
            Shoot: <br /> {shooting.title}
          </CardTitle>

          <CardDescription>
            {" "}
            {shooting.date
              ? new Date(shooting.date).toLocaleDateString()
              : "No date"}{" "}
            <br /> {shooting.location || "No location"}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {/* NAVIGATION */}
          <div className="flex flex-col gap-3">
            {/* GEAR */}
            <Item
              variant="outline"
              className="cursor-pointer bg-black/50"
              onClick={() => router.push(`/shootings/${id}/materiel`)}
            >
              <ItemMedia>
                <Camera className="size-5" />
              </ItemMedia>

              <ItemContent>
                <ItemTitle>Gear</ItemTitle>
                <ItemDescription>
                  Manage shoot equipment
                </ItemDescription>
              </ItemContent>

              <ItemActions />
            </Item>

            {/* TASKS */}
            <Item
              variant="outline"
              className="cursor-pointer bg-black/50"
              onClick={() => router.push(`/shootings/${id}/actions`)}
            >
              <ItemMedia>
                <ListTodo className="size-5" />
              </ItemMedia>

              <ItemContent>
                <ItemTitle>Tasks</ItemTitle>
                <ItemDescription>Track steps and actions</ItemDescription>
              </ItemContent>

              <ItemActions />
            </Item>
          </div>

          {/* FOOTER */}
          <Button onClick={() => router.push("/shootings")}>Done</Button>
        </CardContent>
      </Card>
    </div>
  );
}
