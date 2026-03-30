"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Dashboard = () => {
  const router = useRouter();
  const [shootings, setShootings] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/inventory")
      .then((res) => res.json())
      .then(setInventory)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("/api/shootings")
      .then((res) => res.json())
      .then(setShootings)
      .catch(console.error);
  }, []);

  // 📅 futurs shootings
  const upcoming = shootings.filter((s) => new Date(s.date) > new Date());

  // 🧠 prochain shooting (le plus proche)
  const nextShooting = upcoming.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )[0];

  // 📊 helper checklist %
  const getChecklistPercent = (shooting: any) => {
    if (!shooting?.checklist?.length) return 0;

    const done = shooting.checklist.filter((i: any) => i.checked).length;
    return Math.round((done / shooting.checklist.length) * 100);
  };

  const [nextChecklist, setNextChecklist] = useState<any[]>([]);

  useEffect(() => {
    if (!nextShooting?.id) return;

    fetch(`/api/shootings/${nextShooting.id}/checklist`)
      .then((res) => res.json())
      .then(setNextChecklist)
      .catch(console.error);
  }, [nextShooting]);

  const totalChecklistItems = nextChecklist.length;

  const remainingChecklistItems = nextChecklist.filter(
    (item) => !item.checked,
  ).length;

  const completedChecklistItems = nextChecklist.filter(
    (item) => item.checked,
  ).length;

  const checklistPercent =
    totalChecklistItems === 0
      ? 0
      : Math.round((completedChecklistItems / totalChecklistItems) * 100);

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

  const inventoryCount = inventory.length;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      {/* HEADER */}
      <h1 className="text-xl font-bold">Accueil</h1>

      {/* STATS GLOBAL */}
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
          <CardContent className="p-4 space-y-2">
            <p className="text-sm underline">Prochain shooting :</p>

            <p className="font-semibold text-sm">{nextShooting.title}</p>

            <p className="text-sm text-muted-foreground">
              Le {new Date(nextShooting.date).toLocaleDateString()} à{" "}
              {nextShooting.location}
            </p>

            <p className="text-sm text-muted-foreground mt-2">
              Actions & matériel restants :{" "}
              <span className="font-bold text-white">
                {remainingChecklistItems} / {totalChecklistItems}
              </span>
            </p>

            <div className="pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression</span>
                <span>{checklistPercent}%</span>
              </div>

              <Progress value={checklistPercent} />
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
      <Card className="w-full max-w-sm text-white ">
        <CardContent className="flex flex-col gap-4 p-4 ">
          {items.map((item) => (
            <Card
              key={item.route}
              onClick={() => router.push(item.route)}
              className="
                cursor-pointer
                transition-all
                hover:scale-[1.02]
                hover:shadow-lg
                bg-white/30
              "
            >
              <CardContent className="flex items-center gap-4 p-4 text-white justify-center ">
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
