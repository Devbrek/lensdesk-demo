"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AProposPage() {
  const router = useRouter();

  // stable rendering (évite mismatch SSR/CSR)
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
            Une application simple pour organiser, gérer et suivre tes
            shootings.
          </p>
        </div>

        {/* OBJECTIF */}
        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-bold text-white">Objectif</h2>
          <p className="text-white/80">
            Cette application centralise la gestion de tes shootings photo ou
            vidéo : organisation, matériel, actions et suivi en temps réel.
          </p>
        </Card>

        {/* FEATURES */}
        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-bold text-white">Fonctionnalités</h2>

          <ul className="space-y-2 text-white/80 list-disc pl-5">
            <li>Création et gestion de shootings</li>
            <li>Ajout de détails : date, lieu, description</li>
            <li>Organisation du matériel nécessaire</li>
            <li>Liste d’actions à effectuer pendant le shooting</li>
            <li>Interface simple, rapide et intuitive</li>
          </ul>
        </Card>

        {/* VISION */}
        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-bold text-white">Vision</h2>
          <p className="text-white/80">
            Remplacer les notes dispersées et outils complexes par une interface
            claire, structurée et efficace.
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
              Ajout d’un système de priorités (P1 → P5) avec inversion logique :
              P1 = critique (rouge), P5 = faible priorité (bleu)
            </li>

            <li>
              Correction des états de chargement (loading state) pour éviter
              l’affichage incorrect de données avant récupération des actions
            </li>

            <li>
              Ajout d’un état "chargement" dans les composants critiques pour
              éviter les valeurs nulles ou incohérentes à l’initialisation
            </li>

            <li>
              Confirmation obligatoire avant suppression d’éléments sensibles
              (actions, matériels, données critiques)
            </li>

            <li>
              Ajout d’un système de confirmation de déconnexion avec message
              explicite avant logout utilisateur
            </li>

            <li>
              Logout sécurisé : suppression du token, nettoyage du stockage local et redirection forcée vers la page de connexion
            </li>

            <li>
              Tri automatique des tâches par priorité et statut (non réalisées
              affichées en premier)
            </li>

            <li>Accès rapide au prochain shooting depuis le dashboard</li>

            <li>Correction du calendrier (blocage des dates passées)</li>

            <li>
              Correction de l’édition du type de matériel dans l’inventaire
            </li>

            <li>Ajout de la page suggestions</li>
          </ul>
        </Card>

        {/* FOOTER */}
        <div className="text-center text-sm text-muted-foreground pt-4">
          Version 2.2 • Devbrek
        </div>

        {/* BACK BUTTON */}
        <div className="flex justify-center pt-2">
          <Button onClick={() => router.push("/dashboard")}>Retour</Button>
        </div>
      </div>
    </div>
  );
}
