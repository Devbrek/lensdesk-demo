"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@/hooks/useChat";
import { useEffect, useRef } from "react";

export default function ChatWidget() {
  const {
    messages,
    input,
    setInput,
    sendMessage,
    stop,
    rerunWithEdit,
    loading,
    error,
  } = useChat();

  const chatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <main className="w-full max-w-4xl mx-auto flex flex-col h-[400px] p-4 text-foreground">
      {/* HEADER */}
      <h1 className="text-xl font-semibold mb-4 tracking-tight">
        Assistant IA
      </h1>

      {/* CHAT AREA */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto space-y-4 p-4 rounded-xl border bg-muted/20"
      >
        {messages.map((msg) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed
                  ${
                    isUser
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }
                `}
              >
                <div className="whitespace-pre-wrap text-black">
                  {msg.content}
                </div>

                {isUser && (
                  <button
                    className="text-xs opacity-60 mt-1 underline hover:opacity-100"
                    onClick={() => {
                      const newText = prompt("Modifier message :", msg.content);
                      if (!newText) return;

                      rerunWithEdit(msg.id, newText);
                    }}
                  >
                    Modifier
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <p className="text-xs text-muted-foreground animate-pulse">
            L’assistant réfléchit...
          </p>
        )}
      </div>

      {/* ERROR */}
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      {/* INPUT AREA */}
      <div className="flex gap-2 mt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Écris ton message..."
          className="flex-1"
        />

        <Button onClick={sendMessage} disabled={loading}>
          Envoyer
        </Button>

        <Button variant="destructive" onClick={stop}>
          Stop
        </Button>
      </div>
    </main>
  );
}
