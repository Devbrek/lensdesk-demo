"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleNav = (path: string) => {
    setOpen(false);
    window.location.href = path;
  };

  const performLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      localStorage.clear();
      sessionStorage.clear();

      setOpen(false);
      setConfirmLogout(false);

      window.location.replace("/");
    } finally {
      setLoggingOut(false);
    }
  };

  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        // optional revalidation
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-40 border-b border-white/10 bg-card backdrop-blur-md">
        <div className="w-full px-4 py-2">
          <Card className="w-full bg-card text-white px-3 py-2">
            <div className="flex items-center justify-between gap-3">
              {/* LOGO */}
              <button onClick={() => handleNav("/dashboard")}>
                <img
                  src="/icons/logo2.png"
                  className="w-20 hover:cursor-pointer"
                />
              </button>

              {/* LINKS */}
              <div className="hidden md:flex gap-3 text-sm uppercase text-muted-foreground">
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

              {/* ACTIONS */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="hidden md:flex hover:text-black hover:cursor-pointer"
                  onClick={() => handleNav("/apropos")}
                >
                  A propos
                </Button>

                <Button
                  variant="outline"
                  className="hidden md:block border-sky-800 text-sky-500 hover:text-sky-500 hover:cursor-pointer"
                  onClick={() => handleNav("/suggestions")}
                >
                  Suggestions
                </Button>

                {/* LOGOUT -> OPEN CONFIRM */}
                <Button
                  variant="destructive"
                  disabled={loggingOut}
                  onClick={() => setConfirmLogout(true)}
                  className="hover:cursor-pointer"
                >
                  Logout
                </Button>

                <button className="md:hidden" onClick={() => setOpen(true)}>
                  <img src="/icons/menuW.svg" className="w-8" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </nav>

      {/* OVERLAY MOBILE */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-80 bg-background  p-6 flex flex-col gap-4 transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between mb-6">
          <img src="/icons/logo2.png" className="w-24" />
          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        <div className="flex flex-col gap-3 uppercase text-sm">
          <button onClick={() => handleNav("/dashboard")}>Dashboard</button>
          <button onClick={() => handleNav("/inventory")}>Inventaire</button>
          <button onClick={() => handleNav("/shootings")}>Shootings</button>
          <button onClick={() => handleNav("/apropos")}>A propos</button>
        </div>

        <div className="mt-auto pt-6 border-t flex flex-col gap-3">
          <Button onClick={() => handleNav("/suggestions")}>Suggestions</Button>

          <Button variant="destructive" onClick={() => setConfirmLogout(true)}>
            Logout
          </Button>
        </div>
      </div>

      {/* CONFIRM MODAL (GLOBAL FIX) */}
      {confirmLogout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
          <div className="w-full max-w-sm bg-background border rounded-xl p-5 space-y-4">
            <h2 className="text-lg font-semibold">Confirmer la déconnexion</h2>

            <p className="text-sm text-muted-foreground">
              Êtes-vous sûr de vouloir vous déconnecter ?<br />
              Vous serez déconnecté de l’application et perdrez l’accès à vos
              données.
            </p>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirmLogout(false)}
                disabled={loggingOut}
              >
                Annuler
              </Button>

              <Button
                variant="destructive"
                onClick={performLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "Déconnexion..." : "Se déconnecter"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
