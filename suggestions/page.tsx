"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SuggestionsPage() {
  const [type, setType] = useState("ajout");
  const [page, setPage] = useState("dashboard");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setLoading(true);

    try {
      await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          page,
          message,
        }),
      });

      setMessage("");
      alert("Suggestion envoyée !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-xl font-bold text-white text-center">
          Suggestions
        </h1>

        {/* TYPE */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 bg-background border rounded"
        >
          <option value="ajout">Ajout</option>
          <option value="suppression">Suppression</option>
          <option value="bug">Bug repéré</option>
          <option value="modification">Modification</option>
        </select>

        {/* PAGE */}
        <select
          value={page}
          onChange={(e) => setPage(e.target.value)}
          className="w-full p-2 bg-background border rounded"
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

        {/* MESSAGE */}
        <Input
          placeholder="Décris ta suggestion..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Envoi..." : "Envoyer"}
        </Button>
      </div>
    </div>
  );
}
