"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleNav = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const handleLogout = async () => {
    setLoggingOut(true);

    await fetch("/api/auth/logout", { method: "POST" });

    setOpen(false);
    router.replace("/");
    router.refresh();

    setLoggingOut(false);
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-40 border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="w-full px-4 py-2">
          <Card className="w-full bg-background text-white px-3 py-2">
            {/* ROW */}
            <div className="flex flex-row items-center justify-between gap-3">
              {/* LOGO */}
              <button
                onClick={() => handleNav("/dashboard")}
                className="flex items-center shrink-0"
              >
                <img
                  src="/icons/logo2.png"
                  alt="logo"
                  className="w-20 hover:cursor-pointer"
                />
              </button>

              {/* DESKTOP LINKS */}
              <div className="hidden md:flex flex-row items-center gap-3 text-sm uppercase font-semibold text-muted-foreground">
                <button
                  onClick={() => handleNav("/dashboard")}
                  className="hover:text-white hover:cursor-pointer"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => handleNav("/inventory")}
                  className="hover:text-white hover:cursor-pointer"
                >
                  Inventaire
                </button>

                <button
                  onClick={() => handleNav("/shootings")}
                  className="hover:text-white hover:cursor-pointer"
                >
                  Shootings
                </button>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="flex items-center gap-2 shrink-0">
                {/* DESKTOP CTA */}
                <Button
                  variant="outline"
                  className="hidden md:flex hover:text-black hover:cursor-pointer"
                  onClick={() => handleNav("/apropos")}
                >
                  A propos
                </Button>

                <Button
                  disabled={loggingOut}
                  variant="destructive"
                  onClick={handleLogout}
                >
                  {loggingOut ? "Déconnexion..." : "Logout"}
                </Button>

                {/* MOBILE BURGER */}
                <button className="md:hidden" onClick={() => setOpen(true)}>
                  <img src="/icons/menuW.svg" className="w-8" alt="menu" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </nav>

      {/* OVERLAY */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-80 bg-background border-r border-white/10 p-6 flex flex-col gap-4 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <img src="/icons/logo2.png" className="w-24" alt="logo" />

          <button onClick={() => setOpen(false)} className="text-white text-xl">
            ✕
          </button>
        </div>

        {/* LINKS */}
        <div className="flex flex-col gap-3 text-white uppercase text-sm font-semibold">
          <button onClick={() => handleNav("/dashboard")}>Dashboard</button>

          <button onClick={() => handleNav("/inventory")}>Inventaire</button>

          <button onClick={() => handleNav("/shootings")}>Shootings</button>

          <Button variant="outline" onClick={() => handleNav("/apropos")}>
            A propos
          </Button>
        </div>

        {/* ACTIONS */}
        <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-3">
          <Button
            disabled={loggingOut}
            variant="destructive"
            onClick={handleLogout}
            className="border border-red-600"
          >
            {loggingOut ? "Déconnexion..." : "Logout"}
          </Button>
        </div>
      </div>
    </>
  );
}
