"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const router = useRouter();

  const items = [
    { title: "Inventaire", icon: "/icons/inventory.svg", route: "/inventory" },
    { title: "Shootings", icon: "/icons/shootings.svg", route: "/shootings" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-5xl p-6 bg-background">
        <h1 className="text-center text-4xl md:text-6xl font-bold mb-12">
          ACCUEIL
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <Card
              key={item.route}
              onClick={() => router.push(item.route)}
              className="cursor-pointer transition hover:shadow-lg hover:border-sky-500"
            >
              <CardContent className="flex flex-col items-center justify-center gap-4 p-10">
                <img src={item.icon} alt={item.title} className="w-10 h-10" />

                <p className="text-lg font-semibold text-white uppercase tracking-wide">
                  {item.title}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
