export async function streamMessage({
  message,
  userId,
  signal,
  onChunk,
}: {
  message: string;
  userId: string;
  signal: AbortSignal;
  onChunk: (chunk: string) => void;
}) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, userId }),
    signal,
  });

  // ❌ erreur API (non stream)
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || "Erreur API");
  }

  // ❌ pas de stream
  if (!res.body) {
    throw new Error("No stream returned by server");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    onChunk(chunk);
  }
}
