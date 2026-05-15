"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SuggestionsPage() {
  const router = useRouter();

  const [type, setType] = useState("addition");
  const [page, setPage] = useState("dashboard");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const isValidMessage = () => {
    const trimmed = message.trim();

    if (trimmed.length < 5) {
      return "Message must be at least 5 characters";
    }

    if (trimmed.includes("http") || trimmed.includes("www")) {
      return "Links are not allowed";
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
          setError("Limit reached (5 suggestions per hour)");
        } else {
          setError(data.error || "Error sending suggestion");
        }
        return;
      }

      setMessage("");
      setSent(true);
    } catch (err) {
      setError("Network error");
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
            Suggest an improvement, report a bug, or request a change.
          </p>
        </div>

        {/* FORM */}
        <Card className="p-6 space-y-5">
          {/* TYPE */}
          <div className="space-y-2">
            <label className="text-sm text-white">Suggestion type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2  bg-background border text-white"
            >
              <option value="addition">Addition</option>
              <option value="removal">Removal</option>
              <option value="bug">Bug report</option>
              <option value="change">Change</option>
            </select>
          </div>

          {/* PAGE */}
          <div className="space-y-2">
            <label className="text-sm text-white">Affected page</label>
            <select
              value={page}
              onChange={(e) => setPage(e.target.value)}
              className="w-full p-2  bg-background border text-white"
            >
              <option value="login">Login</option>
              <option value="dashboard">Dashboard</option>
              <option value="inventory">Inventory</option>
              <option value="shooting">Shooting</option>
              <option value="gear">Gear</option>
              <option value="tasks">Tasks</option>
              <option value="edit">Edit</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* MESSAGE */}
          <div className="space-y-2">
            <label className="text-sm text-white">Description</label>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setSent(false);
              }}
              placeholder="Describe your idea, bug, or improvement..."
              className="w-full min-h-30 p-3  bg-background border text-white resize-none"
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
            {loading ? "Sending..." : "Send suggestion"}
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard`)}
            className="w-full text-white"
          >
            Back
          </Button>

          {/* SUCCESS */}
          {sent && (
            <p className="text-green-400 text-sm text-center">
              Suggestion sent successfully ✔
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
