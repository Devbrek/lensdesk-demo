"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur de connexion");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
      <Card className="w-full max-w-md p-8 bg-black/70 border border-white backdrop-blur-md">
        <h2 className="text-white text-2xl font-semibold text-center mb-6">
          CONNEXION
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 ">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-white"
          />

          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-white"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
