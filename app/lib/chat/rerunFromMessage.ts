import { streamMessage } from "./streamMessage";

export async function rerunFromMessage({
  messages,
  id,
  userId,
  onReset,
  onNewBot,
  onChunk,
  signal,
}: {
  messages: any[];
  id: string;
  userId: string;
  onReset: (msgs: any[]) => void;
  onNewBot: (botId: string) => void;
  onChunk: (botId: string, chunk: string) => void;
  signal: AbortSignal;
}) {
  const index = messages.findIndex((m) => m.id === id);
  if (index === -1) return;

  const trimmed = messages.slice(0, index + 1);

  onReset(trimmed);

  const message = trimmed[index].content;
  const botId = crypto.randomUUID();

  onNewBot(botId);

  await streamMessage({
    message,
    userId,
    signal,
    onChunk: (chunk) => onChunk(botId, chunk),
  });
}
