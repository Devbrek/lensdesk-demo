"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[url('/background.jpg')] bg-cover bg-center flex items-center justify-center flex-col ">
      <h1 className="text-white text-5xl font-bold text-center ">ACCUEIL</h1>
      <div className="flex flex-col  gap-10 p-10">
        {/* Carte Inventaire */}
        <div
          onClick={() => router.push("/inventory")}
          className="cursor-pointer w-64 h-40 bg-white/40 rounded-xl shadow-lg flex items-center justify-center text-white text-2xl font-bold hover:bg-white/10 transition uppercase"
        >
          Inventaire
        </div>

        {/* Carte Shootings */}
        <div
          onClick={() => router.push("/shootings")}
          className="cursor-pointer w-64 h-40 bg-white/40 rounded-xl shadow-lg flex items-center justify-center text-white text-2xl font-bold hover:bg-white/10 transition uppercase"
        >
          Shootings
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
