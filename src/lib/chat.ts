import type { ChatMessage } from "@/types";

// TODO: conectar con API del chatbot (Claude)
export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  console.log("[chat] sendChatMessage", messages);
  await new Promise((r) => setTimeout(r, 900));
  return "Soy un asistente de demostración, pronto podré ayudarte a reservar cita.";
}
