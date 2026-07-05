import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(40),
});

export const sendChatMessageFn = createServerFn({ method: "POST" })
  .validator(chatSchema)
  .handler(async ({ data }): Promise<{ reply: string }> => {
    // Import dinámico: el SDK de Anthropic y la lógica del bot son solo de servidor
    const { answerChat } = await import("@/server/chatbot");
    return { reply: await answerChat(data.messages) };
  });
