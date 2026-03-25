"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const router = useRouter();

  return (

    <div className="min-h-screen bg-cover bg-center flex items-center justify-center flex-col">
      <div className="bg-black/70 rounded-xl py-5">
      <h1 className="text-white text-5xl md:text-7xl font-bold text-center">
        ACCUEIL
      </h1>

      <div className="flex flex-col gap-5 p-5">
        {/* Carte Inventaire */}
        <div
          onClick={() => router.push("/inventory")}
          className="cursor-pointer py-11 px-20 bg-white/40 rounded-xl shadow-lg flex flex-col items-center justify-center text-white text-2xl md:text-4xl font-bold hover:bg-white/10 transition uppercase backdrop-blur-xs gap-3"
        >
          <img src="/icons/inventory.svg" alt="inventory_logo" className="w-8"/>
          Inventaire
        </div>

        {/* Carte Shootings */}
        <div
          onClick={() => router.push("/shootings")}
          className="cursor-pointer py-11 px-20 bg-white/40 rounded-xl shadow-lg flex flex-col items-center justify-center text-white text-2xl md:text-4xl font-bold hover:bg-white/10 transition uppercase backdrop-blur-xs gap-3"
        >
          <img src="/icons/shootings.svg" alt="shooting_logo" className="w-8"/>
          Shootings
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
