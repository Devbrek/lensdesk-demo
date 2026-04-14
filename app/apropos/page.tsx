"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AProposPage() {
  const router = useRouter();

  const today = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl space-y-6 bg-background p-6">
        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">
            À propos de l’application
          </h1>
          <p className="text-muted-foreground">
            Une application d’assistance intelligente pour organiser et gérer
            tes shootings photo.
          </p>
        </div>

        {/* OBJECTIF */}
        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-bold text-white">Objectif</h2>
          <p className="text-white/80">
            Centraliser toute la gestion d’un photographe : shootings, matériel,
            checklist, notes et assistance IA connectée à tes données réelles.
          </p>
        </Card>

        {/* FEATURES */}
        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-bold text-white">Fonctionnalités</h2>

          <ul className="space-y-2 text-white/80 list-disc pl-5">
            <li>Gestion complète des shootings (création, suivi, statut)</li>
            <li>Organisation du matériel via inventaire connecté</li>
            <li>Checklists dynamiques par shooting</li>
            <li>Notes associées aux projets</li>
            <li>
              Assistant IA connecté à la base de données (Prisma + Postgres)
            </li>
            <li>
              Chat intelligent capable d’exploiter tes shootings et ton matériel
            </li>
            <li>Streaming temps réel des réponses IA (Mistral AI)</li>
            <li>Interface moderne, sombre et optimisée UX</li>
          </ul>
        </Card>

        {/* IA */}
        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-bold text-white">Assistant IA</h2>
          <p className="text-white/80">
            L’assistant peut interroger directement tes données : shootings à
            venir, checklist, matériel disponible, et contexte global. Il agit
            comme un véritable copilote pour ton activité photo.
          </p>
        </Card>

        {/* VISION */}
        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-bold text-white">Vision</h2>
          <p className="text-white/80">
            Remplacer les outils dispersés par un système unique : une
            application + un assistant intelligent capable de comprendre ton
            workflow réel.
          </p>
        </Card>

        {/* CHANGELOG */}
        <Card className="p-6 space-y-3">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white">
              Dernières mises à jour
            </h2>

            <p className="text-xs text-muted-foreground">
              Mis à jour le {today}
            </p>
          </div>

          <ul className="space-y-2 text-white/80 list-disc pl-5">
            <li>
              Ajout d’un assistant IA connecté à la base de données (shootings,
              inventory, checklist)
            </li>
            <li>
              Intégration Prisma + Postgres pour fournir un contexte réel au
              chatbot
            </li>
            <li>
              Streaming des réponses IA en temps réel (Mistral AI + LangChain)
            </li>
            <li>
              Interface chat modernisée (dark UI, UX optimisée, auto-scroll)
            </li>
            <li>Support édition de message + régénération de réponse IA</li>
            <li>
              Gestion du userId côté API pour contextualisation utilisateur
            </li>
            <li>
              Correction des flux chat (stream stable + gestion abort
              controller)
            </li>
            <li>
              Amélioration de la structure des données shootings (location,
              checklist, notes)
            </li>
            <li>
              Optimisation du rendu UI et suppression des comportements de
              scroll global
            </li>
          </ul>
        </Card>

        {/* VERSION */}
        <div className="text-center text-sm text-muted-foreground pt-4">
          Version 3.0 • Devbrek
        </div>

        {/* BACK BUTTON */}
        <div className="flex justify-center pt-2">
          <Button onClick={() => router.push("/dashboard")}>Retour</Button>
        </div>
      </div>
    </div>
  );
}
