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

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, shootRes] = await Promise.all([
          fetch("/api/inventory"),
          fetch("/api/shootings"),
        ]);

        setInventory(await invRes.json());
        setShootings(await shootRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const upcoming = shootings.filter(
    (s) => new Date(s.date).getTime() > Date.now(),
  );

  const nextShooting = [...upcoming].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )[0];

  // checklist next shooting
  useEffect(() => {
    if (!nextShooting?.id) return;

    fetch(`/api/shootings/${nextShooting.id}/checklist`)
      .then((res) => res.json())
      .then(setNextChecklist)
      .catch(console.error);
  }, [nextShooting]);

  // =========================
  // DATA PROCESSING
  // =========================
  const doneCount = (arr: any[]) => arr.filter((i) => i.checked).length;

  const getProgress = (arr: any[]) => {
    if (!arr.length) return 0;
    return Math.round((doneCount(arr) / arr.length) * 100);
  };

  const materialItems = nextChecklist.filter((i) => i.type === "materiel");
  const actionItems = nextChecklist.filter((i) => i.type === "action");

  const materialProgress = getProgress(materialItems);
  const actionProgress = getProgress(actionItems);

  const totalItems = nextChecklist.length;
  const doneItems = doneCount(nextChecklist);
  const score = totalItems ? Math.round((doneItems / totalItems) * 10) : 0;

  const urgentItems = nextChecklist.filter(
    (i) => !i.checked && Number(i.priority) <= 2,
  );

  const focusTasks = nextChecklist
    .filter((i) => !i.checked)
    .sort((a, b) => Number(b.priority) - Number(a.priority))
    .slice(0, 3);

  const daysLeft = nextShooting
    ? Math.ceil(
        (new Date(nextShooting.date).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 p-4 text-white">
      <h1 className="text-xl font-bold">Dashboard</h1>

      {/* ========================= */}
      {/* SHOOTINGS LIST (NEW UX) */}
      {/* ========================= */}
      <Card className="w-full max-w-sm text-white">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold">Shootings</p>
            <span className="text-xs text-muted-foreground">
              {upcoming.length} à venir
            </span>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {upcoming.length === 0 && (
              <p className="text-xs text-muted-foreground text-center">
                Aucun shooting prévu
              </p>
            )}

            {upcoming
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime(),
              )
              .map((s) => (
                <div
                  key={s.id}
                  onClick={() => router.push(`/shootings/${s.id}`)}
                  className="flex justify-between items-center text-xs p-2  bg-white/10 cursor-pointer transition"
                >
                  <span className="truncate max-w-[60%]">{s.title}</span>
                  <span className="opacity-60">
                    {new Date(s.date).toLocaleDateString()}
                  </span>
                  <span>
                    <img src="/icons/eyeW.svg" alt="eye" className="w-5" />
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* ========================= */}
      {/* NEXT SHOOTING */}
      {/* ========================= */}
      {nextShooting ? (
        <Card className="w-full max-w-sm text-white">
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm underline">Prochain shooting</p>

              <Button
                size="icon"
                onClick={() => router.push(`/shootings/${nextShooting.id}`)}
              >
                <img src="/icons/eyeW.svg" className="w-4 h-4" />
              </Button>
            </div>

            <p className="font-semibold">{nextShooting.title}</p>

            <p className="text-xs text-muted-foreground">
              {new Date(nextShooting.date).toLocaleDateString()} —{" "}
              {nextShooting.location}
            </p>

            {daysLeft !== null && (
              <p className="text-xs text-blue-400">
                {daysLeft >= 0
                  ? `J-${daysLeft} avant shooting`
                  : "Shooting passé"}
              </p>
            )}

            <div className="text-sm">
              Préparation : <span className="font-bold">{score}/10</span>
            </div>

            {urgentItems.length > 0 && (
              <div className="text-red-400 text-xs">
                ⚠ {urgentItems.length} tâches urgentes
              </div>
            )}

            <div className="space-y-2">
              <div className="text-xs flex justify-between">
                <span>Matériel</span>
                <span>{materialProgress}%</span>
              </div>
              <Progress value={materialProgress} />

              <div className="text-xs flex justify-between">
                <span>Actions</span>
                <span>{actionProgress}%</span>
              </div>
              <Progress value={actionProgress} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-sm">
          <CardContent className="p-6 text-center">
            Aucun shooting prévu
          </CardContent>
        </Card>
      )}

      {/* ========================= */}
      {/* NAV */}
      {/* ========================= */}
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col gap-3 p-4">
          <p className="text-muted-foreground text-xs text-center">
            Pour le matériel réccurent lors de tes shootings :
          </p>
          <Button onClick={() => router.push("/inventory")}>
            Inventaire <img src="/icons/materiel.svg" className="w-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
