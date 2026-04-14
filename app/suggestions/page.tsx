"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SuggestionsPage() {
  const router = useRouter();

  const [type, setType] = useState("ajout");
  const [page, setPage] = useState("dashboard");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // 🔒 VALIDATION FRONT
  const isValidMessage = () => {
    const trimmed = message.trim();

    if (trimmed.length < 5) {
      return "Le message doit contenir au moins 5 caractères";
    }

    if (trimmed.includes("http") || trimmed.includes("www")) {
      return "Les liens ne sont pas autorisés";
    }

    return "";
  };

  const handleSubmit = async () => {
    const validationError = isValidMessage();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setSent(false);
    setError("");

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          page,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError("Limite atteinte (5 suggestions par heure)");
        } else {
          setError(data.error || "Erreur lors de l'envoi");
        }
        return;
      }

      setMessage("");
      setSent(true);
    } catch (err) {
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  const validationMessage = isValidMessage();

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* HEADER */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Suggestions</h1>
          <p className="text-white">
            Propose une amélioration, signale un bug ou une modification.
          </p>
        </div>

        {/* FORM */}
        <Card className="p-6 space-y-5">
          {/* TYPE */}
          <div className="space-y-2">
            <label className="text-sm text-white">Type de suggestion</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2  bg-background border text-white"
            >
              <option value="ajout">Ajout</option>
              <option value="suppression">Suppression</option>
              <option value="bug">Bug repéré</option>
              <option value="modification">Modification</option>
            </select>
          </div>

          {/* PAGE */}
          <div className="space-y-2">
            <label className="text-sm text-white">Page concernée</label>
            <select
              value={page}
              onChange={(e) => setPage(e.target.value)}
              className="w-full p-2  bg-background border text-white"
            >
              <option value="login">Login</option>
              <option value="dashboard">Dashboard</option>
              <option value="inventaire">Inventaire</option>
              <option value="shooting">Shooting</option>
              <option value="materiel">Matériel</option>
              <option value="actions">Actions</option>
              <option value="edit">Edit</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          {/* MESSAGE */}
          <div className="space-y-2">
            <label className="text-sm text-white">Description</label>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setSent(false); // 🔥 important
              }}
              placeholder="Explique ton idée, bug ou amélioration..."
              className="w-full min-h-[120px] p-3  bg-background border text-white resize-none"
            />

            {/* VALIDATION MESSAGE */}
            {validationMessage && !sent && (
              <p className="text-red-400 text-xs">{validationMessage}</p>
            )}
          </div>

          {/* ERROR */}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          {/* ACTION */}
          <Button
            onClick={handleSubmit}
            disabled={loading || !!validationMessage}
            className="w-full"
          >
            {loading ? "Envoi..." : "Envoyer la suggestion"}
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard`)}
            className="w-full text-white"
          >
            Retour
          </Button>

          {/* SUCCESS */}
          {sent && (
            <p className="text-green-400 text-sm text-center">
              Suggestion envoyée avec succès ✔
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
