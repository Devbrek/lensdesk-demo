"use client";

import React from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const Dashboard = () => {
  const router = useRouter();

  const items = [
    { title: "Inventaire", icon: "/icons/inventory.svg", route: "/inventory" },
    { title: "Shootings", icon: "/icons/shootings.svg", route: "/shootings" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* ✅ Card principale (comme login) */}
      <Card className="w-full max-w-sm bg-background text-white">
        <CardHeader>
          <CardTitle>Menu principal</CardTitle>
          <CardDescription>Complète l'inventaire avec tes équipements et créé tes sessions shooting </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {items.map((item) => (
            <Card
              key={item.route}
              onClick={() => router.push(item.route)}
              className="cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg border"
            >
              <CardContent className="flex flex-col items-center justify-center gap-4 p-8">
                <img src={item.icon} alt={item.title} className="w-10 h-10" />

                <p className="text-sm font-semibold uppercase tracking-wide text-white">
                  {item.title}
                </p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
