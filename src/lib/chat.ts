import type { ChatMessage } from "@/types";
import { sendChatMessageFn } from "@/functions/chat";

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  const { reply } = await sendChatMessageFn({
    data: {
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    },
  });
  return reply;
}
