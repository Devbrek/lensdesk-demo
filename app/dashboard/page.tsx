"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user"); // supprime le user
    router.push("/login"); // redirige vers login
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center flex-col">
      <div className="flex justify-center p-5">
        <button
          onClick={handleLogout}
          className="text-white hover:cursor-pointer flex items-center gap-2 text-2xl"
        >
          {/* Icône avant le texte */}
          <img src="/icons/logout.svg" alt="Logout" className="w-10 h-10" />
          Se déconnecter
        </button>
      </div>

      <h1 className="text-white text-5xl md:text-7xl font-bold text-center">
        ACCUEIL
      </h1>

      <div className="flex flex-col gap-10 p-10">
        {/* Carte Inventaire */}
        <div
          onClick={() => router.push("/inventory")}
          className="cursor-pointer py-20 px-20 bg-white/40 rounded-xl shadow-lg flex items-center justify-center text-white text-2xl md:text-4xl font-bold hover:bg-white/10 transition uppercase backdrop-blur-xs "
        >
          Inventaire
        </div>

        {/* Carte Shootings */}
        <div
          onClick={() => router.push("/shootings")}
          className="cursor-pointer py-20 px-20 bg-white/40 rounded-xl shadow-lg flex items-center justify-center text-white text-2xl md:text-4xl font-bold hover:bg-white/10 transition uppercase backdrop-blur-xs"
        >
          Shootings
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
