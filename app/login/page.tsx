"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center ">
      <div className="bg-black/70 p-10 border-white border-2 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center gap-8">
        <h1 className="text-white text-5xl font-bold text-center">
          ABUZONE <br /> CHECKER
        </h1>

        <form className="w-full flex flex-col gap-4">
          <h2 className="text-white text-2xl font-semibold mb-2">CONNEXION</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white text-black rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white text-black rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-white text-black rounded-full py-3 mt-2 font-semibold hover:bg-gray-200 transition"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
