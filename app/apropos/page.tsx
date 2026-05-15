"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl space-y-6 bg-background p-6">

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">About Lensdesk</h1>
          <p className="text-muted-foreground">
            A smart management platform for professional photographers — built to simplify your workflow and keep you focused on what matters.
          </p>
        </div>

        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-bold text-white">What is Lensdesk?</h2>
          <p className="text-white/80">
            Lensdesk centralizes everything a photographer needs: shooting management, gear inventory, checklists, and an AI assistant connected to your real data. One place, one tool, zero context switching.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-bold text-white">Features</h2>
          <ul className="space-y-2 text-white/80 list-disc pl-5">
            <li>Full shooting management — create, track, and update status</li>
            <li>Gear inventory with availability tracking</li>
            <li>Dynamic checklists per shooting</li>
            <li>Notes attached to each project</li>
            <li>AI assistant with real-time streaming (Mistral AI + LangChain)</li>
            <li>Dark UI, optimized for daily professional use</li>
          </ul>
        </Card>

        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-bold text-white">AI Assistant</h2>
          <p className="text-white/80">
            The built-in AI assistant acts as a copilot for your photography business. Ask about upcoming shoots, gear availability, or checklists — it understands your workflow and responds in real time.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <h2 className="text-xl font-bold text-white">Vision</h2>
          <p className="text-white/80">
            Replace scattered tools — spreadsheets, notes apps, reminders — with a single intelligent system that understands your real workflow and helps you stay organized effortlessly.
          </p>
        </Card>

        <div className="text-center text-sm text-muted-foreground pt-4">
          Version 3.0 · Built by Devbrek
        </div>

        <div className="flex justify-center pt-2">
          <Button onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

      </div>
    </div>
  );
}