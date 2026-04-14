"use client";

import { useChat } from "@/hooks/useChat";

export default function ChatPage() {
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

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Chat</h1>

      <div className="h-[500px] overflow-y-auto border p-3 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <b>{msg.role}:</b> {msg.content}
            {msg.role === "user" && (
              <button
                className="ml-2 text-blue-500"
                onClick={() => {
                  const newText = prompt("Edit message:", msg.content);
                  if (!newText) return;

                  rerunWithEdit(msg.id, newText);
                }}
              >
                edit
              </button>
            )}
          </div>
        ))}
      </div>

      {loading && <p>Bot is typing...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex gap-2">
        <input
          className="border p-2 w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button className="bg-black text-white px-4" onClick={sendMessage}>
          send
        </button>

        <button className="bg-red-500 text-white px-4" onClick={stop}>
          stop
        </button>
      </div>
    </div>
  );
}
