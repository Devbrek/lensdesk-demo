"use client";

import { useRef, useState } from "react";
import { Message } from "@/types/chat";
import { streamMessage } from "@/lib/chat/streamMessage";
import { stopGeneration, setController } from "@/lib/chat/stopGeneration";

const USER_ID = "83a83cf9-9ced-478b-9edb-b05042845329";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };

    const botId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: botId, role: "assistant", content: "" },
    ]);

    try {
      const controller = new AbortController();
      abortRef.current = controller;
      setController(controller);

      await streamMessage({
        message: input,
        userId: USER_ID, // 👈 IMPORTANT
        signal: controller.signal,
        onChunk: (chunk) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botId ? { ...m, content: m.content + chunk } : m,
            ),
          );
        },
      });
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const stop = () => {
    stopGeneration();
    abortRef.current?.abort();
    setLoading(false);
  };

  const rerunWithEdit = async (id: string, newContent: string) => {
    setLoading(true);
    setError(null);

    const index = messages.findIndex((m) => m.id === id);

    const updatedMessages = messages.map((m) =>
      m.id === id ? { ...m, content: newContent } : m,
    );

    const trimmed = updatedMessages.slice(0, index + 1);

    const botId = crypto.randomUUID();

    setMessages([...trimmed, { id: botId, role: "assistant", content: "" }]);

    const controller = new AbortController();
    abortRef.current = controller;
    setController(controller);

    await streamMessage({
      message: newContent,
      userId: USER_ID, // 👈 IMPORTANT aussi ici
      signal: controller.signal,
      onChunk: (chunk) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botId ? { ...m, content: m.content + chunk } : m,
          ),
        );
      },
    });

    setLoading(false);
  };

  return {
    messages,
    setMessages,
    input,
    setInput,
    sendMessage,
    stop,
    rerunWithEdit,
    loading,
    error,
  };
}
