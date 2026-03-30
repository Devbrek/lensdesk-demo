"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

export default function AProposPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <div className="w-full max-w-3xl space-y-6 bg-background p-6">
        {/* HEADER */}
        <div className="text-center space-y-2 ">
          <h1 className="text-3xl font-bold text-white">
            À propos de l'application Abuzone Checker
          </h1>
          <p className=" text-white">
            Une application simple pour organiser, gérer et suivre tes
            shootings.
          </p>
        </div>

        {/* PRESENTATION */}
        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-bold text-white">Objectif</h2>
          <p className="text-white">
            Cette application a été conçue pour centraliser la gestion de tes
            shootings photo ou vidéo : organisation, matériel, actions et suivi.
          </p>
        </Card>

        {/* FEATURES */}
        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-bold text-white">Fonctionnalités</h2>

          <ul className="space-y-2 text-white list-disc pl-5">
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
          <p className="text-white">
            L’objectif est de remplacer les notes dispersées et les outils
            complexes par une interface claire et efficace.
          </p>
        </Card>

        {/* FOOTER */}
        <div className="text-center text-sm text-muted-foreground pt-4">
          Version 1.0 — by Devbrek
        </div>
      </div>
      <div className="flex justify-center pt-5">
        <Button onClick={() => router.push(`/dashboard`)}>Retour</Button>
      </div>
    </div>
  );
}
