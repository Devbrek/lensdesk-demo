"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@/hooks/useChat";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ChatWidget() {
  const {
    messages,
    setMessages,
    input,
    setInput,
    sendMessage,
    stop,
    rerunWithEdit,
    loading,
    error,
  } = useChat();

  const chatRef = useRef<HTMLDivElement | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const alreadyShown = localStorage.getItem("welcome_shown");

    if (!alreadyShown && messages.length === 0) {
      setMessages([
        {
          id: "welcome-" + Date.now(),
          role: "assistant",
          content:
            "Bienvenue Abuzone 👋\n\nJoyeux anniversaire 🎉\n\nJe peux t’aider à organiser tes shootings, ton matériel et tes checklists.\n\nPar quoi on commence ?",
        },
      ]);

      localStorage.setItem("welcome_shown", "true");
    }
  }, [messages]);

  useEffect(() => {
    if (!open) return;

    const el = chatRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, open]);

  const startEdit = (id: string, content: string) => {
    setEditingId(id);
    setInput(content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setInput("");
  };

  const handleSubmit = () => {
    if (!input.trim()) return;

    if (editingId) {
      rerunWithEdit(editingId, input);
      setEditingId(null);
      setInput("");
      return;
    }

    sendMessage();
  };

  return (
    <main
      className={`
        w-full max-w-4xl mx-auto flex flex-col
        backdrop-blur-2xl text-zinc-100 border bg-black/50 border-zinc-800
        shadow-2xl overflow-hidden rounded-2xl
        transition-all duration-500 ease-in-out
        ${open ? "h-[500px]" : "h-[53px]"}
      `}
    >
      {/* HEADER (TOGGLE BAR) */}
      <div
        onClick={() => setOpen((v) => !v)}
        className="px-5 py-4 border-b border-zinc-800 bg-zinc-950/60 backdrop-blur flex items-center justify-between cursor-pointer"
      >
        <h1 className="text-sm font-medium tracking-wide text-zinc-300">
          Manuc IA
        </h1>

        <ChevronDown
          size={18}
          className={`
            text-zinc-400 transition-transform duration-300
            ${open ? "rotate-0" : "-rotate-180"}
          `}
        />
      </div>

      {/* CHAT AREA */}
      <div
        ref={chatRef}
        className={`
          flex-1 overflow-y-auto px-5 py-6 space-y-4
          transition-all duration-300
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        {messages.length === 0 && (
          <div className="flex justify-start">
            <div className="max-w-[75%] px-4 py-3 rounded-2xl text-sm bg-zinc-800 text-zinc-100 border border-zinc-700">
              <div className="whitespace-pre-wrap">
                Salut Abuzone 👋 !{"\n\n"}
                Tout d'abord... Joyeux anniversaire 🎉{"\n\n"}
                Je peux t’aider à organiser tes shootings, ton matériel et tes
                checklists.
                {"\n\n"}
                Par quoi on commence ?
              </div>
            </div>
          </div>
        )}
        {messages.map((msg) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                  transition-colors
                  ${
                    isUser
                      ? "bg-indigo-600 text-white rounded-br-md shadow-md"
                      : "bg-zinc-800 text-zinc-100 rounded-bl-md border border-zinc-700"
                  }
                `}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {isUser && (
                  <button
                    className="text-[11px] mt-2 text-zinc-300 hover:text-white opacity-70 hover:opacity-100 transition"
                    onClick={() => startEdit(msg.id, msg.content)}
                  >
                    modifier
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <p className="text-xs text-zinc-500 animate-pulse">
            Assistant en train de réfléchir...
          </p>
        )}
      </div>

      {/* ERROR */}
      {error && <div className="px-5 pb-2 text-sm text-red-400">{error}</div>}

      {/* INPUT */}
      <div
        className={`
          p-4 border-t border-zinc-800 bg-zinc-950/80 backdrop-blur
          transition-all duration-300
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        <div className="flex gap-2 items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={
              editingId ? "Modifier ton message..." : "Écris ton message..."
            }
            className="bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-indigo-500"
          />

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            {editingId ? "Modifier" : "Envoyer"}
          </Button>

          {editingId && (
            <Button
              variant="outline"
              onClick={cancelEdit}
              className="border-zinc-700 text-zinc-300"
            >
              Annuler
            </Button>
          )}

          <Button
            variant="destructive"
            onClick={stop}
            className="bg-red-600 hover:bg-red-500 text-white"
          >
            Stop
          </Button>
        </div>
      </div>
    </main>
  );
}
