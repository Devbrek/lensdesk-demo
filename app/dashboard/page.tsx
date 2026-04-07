"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [shootings, setShootings] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [nextChecklist, setNextChecklist] = useState<any[]>([]);

  // INVENTAIRE
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, shootRes] = await Promise.all([
          fetch("/api/inventory"),
          fetch("/api/shootings"),
        ]);

        const inventoryData = await invRes.json();
        const shootingsData = await shootRes.json();

        setInventory(inventoryData);
        setShootings(shootingsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // 🔥 clé du système
      }
    };

    fetchData();
  }, []);

  const upcoming = shootings.filter((s) => new Date(s.date) > new Date());

  const nextShooting = upcoming.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )[0];

  // CHECKLIST DU NEXT SHOOTING
  useEffect(() => {
    if (!nextShooting?.id) return;

    fetch(`/api/shootings/${nextShooting.id}/checklist`)
      .then((res) => res.json())
      .then(setNextChecklist)
      .catch(console.error);
  }, [nextShooting]);

  const materialItems = nextChecklist.filter((i) => i.type === "materiel");

  const actionItems = nextChecklist.filter((i) => i.type === "action");

  const getProgress = (items: any[]) => {
    if (!items.length) return 0;
    const done = items.filter((i) => i.checked).length;
    return Math.round((done / items.length) * 100);
  };

  const getScoreOutOf10 = (items: any[]) => {
    if (!items.length) return 0;

    const done = items.filter((i) => i.checked).length;

    return Math.round((done / items.length) * 10);
  };

  const materialProgress = getProgress(materialItems);
  const actionProgress = getProgress(actionItems);
  const materialRemaining = materialItems.filter((i) => !i.checked).length;
  const materialTotal = materialItems.length;

  const actionRemaining = actionItems.filter((i) => !i.checked).length;
  const actionTotal = actionItems.length;

  const inventoryCount = inventory.length;

  const items = [
    {
      title: "Inventaire",
      icon: "/icons/inventory.svg",
      route: "/inventory",
    },
    {
      title: "Shootings",
      icon: "/icons/shootings.svg",
      route: "/shootings",
    },
  ];
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Chargement...
      </div>
    );
  }
  return (
    <div className=" min-h-screen flex flex-col items-center justify-center gap-6 p-4 text-foreground ">
      {/* HEADER */}
      <h1 className="text-xl font-bold">Dashboard</h1>

      {/* STATS */}
      <div className="max-w-sm w-full grid grid-cols-2 gap-3">
        <Card className="bg-background">
          <CardContent className="p-3 text-center text-white">
            <p className="text-xs text-muted-foreground">Shootings à venir</p>
            <p className="text-lg font-bold pt-2">{upcoming.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-background">
          <CardContent className="p-3 text-center text-white">
            <p className="text-xs text-muted-foreground">
              Objets dans l&apos;inventaire
            </p>
            <p className="text-lg font-bold pt-2">{inventoryCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* NEXT SHOOTING */}
      {nextShooting ? (
        <Card className="w-full max-w-sm text-white">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm underline">Prochain shooting : </p>
              <Button
                className="  hover:bg-white/10 transition bg-black/20 border border-white"
                title="Voir le shooting"
              >
                <img
                  src="/icons/eyeW.svg"
                  className="w-4 h-4"
                  alt="voir shooting"
                  onClick={() => router.push(`/shootings/${nextShooting.id}`)}
                />
              </Button>
            </div>
            <p className="font-semibold text-sm">{nextShooting.title}</p>

            <p className="text-sm text-muted-foreground">
              Le {new Date(nextShooting.date).toLocaleDateString()} à{" "}
              {nextShooting.location}
            </p>

            {/* PROGRESS MATERIEL */}
            <div className="space-y-1 pt-2">
              <span className="text-xs text-muted-foreground">restant :</span>
              <div className="flex justify-between text-xs">
                <span>Matériel</span>
                <span>
                  {materialRemaining} / {materialTotal}
                </span>
                <span>{materialProgress}%</span>
              </div>
              <Progress value={materialProgress} />
            </div>

            {/* PROGRESS ACTIONS */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Actions</span>
                <span>
                  {" "}
                  {actionRemaining} / {actionTotal}
                </span>
                <span>{actionProgress}%</span>
              </div>
              <Progress value={actionProgress} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-sm text-white">
          <CardContent className="p-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">Prochain shooting</p>

            <p className="text-base font-semibold">Aucun shooting de prévu</p>

            <p className="text-xs text-muted-foreground">
              Planifie un nouveau shooting pour commencer
            </p>
          </CardContent>
        </Card>
      )}

      {/* NAVIGATION */}
      <Card className="w-full max-w-sm text-white">
        <CardContent className="flex flex-col gap-4 p-4">
          <p className="text-xs text-muted-foreground text-center">
            Gère ton inventaire et tes prochains shootings
          </p>

          {items.map((item) => (
            <Card
              key={item.route}
              onClick={() => router.push(item.route)}
              className="cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg bg-white/30"
            >
              <CardContent className="flex items-center gap-4 p-4 text-white justify-center">
                <img src={item.icon} className="w-8 h-8" alt={item.title} />
                <p className="text-sm font-semibold uppercase">{item.title}</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
