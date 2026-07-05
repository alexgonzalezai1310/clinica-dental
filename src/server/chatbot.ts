import Anthropic from "@anthropic-ai/sdk";
import { faqs } from "@/data/faqs";
import { services } from "@/data/services";
import { team } from "@/data/team";
import { findSuggestions, freeSlotsFor, isOpenDay, treatmentDuration, tryBook } from "@/server/schedule";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

function buildSystemPrompt(hasTools: boolean): string {
  const today = new Intl.DateTimeFormat("es-ES", {
    dateStyle: "full",
    timeZone: "Europe/Madrid",
  }).format(new Date());
  const todayISO = new Date().toISOString().slice(0, 10);

  const citasSection = hasTools
    ? `## Citas
Puedes consultar disponibilidad real y reservar cita con tus herramientas:
- Usa "consultar_disponibilidad" cuando pregunten por huecos (interpreta fechas relativas como "mañana" o "el jueves" a partir de la fecha de hoy).
- Para reservar con "reservar_cita" necesitas: tratamiento, fecha, hora, nombre completo, teléfono y email. Pide los datos que falten antes de llamarla.
- Si la hora pedida está ocupada, la herramienta devuelve alternativas: propónselas al usuario.
- Tras reservar, confirma fecha, hora y tratamiento.`
    : `## Citas
No tienes acceso a la agenda desde aquí. Si preguntan por disponibilidad o quieren reservar, indícales que usen el formulario "Solicitar cita" de la web, que sí comprueba huecos reales al momento.`;

  return `Eres el asistente virtual de la Clínica Dental S. Moya & R. Aranda, en Villarrubia (Córdoba). Respondes en español, con tono cercano y profesional, y en mensajes breves (2-4 frases) porque escribes en un widget de chat.

Hoy es ${today} (${todayISO}).

Responde ÚNICAMENTE con la información de la clínica que tienes a continuación. Si te preguntan algo que no está aquí (diagnósticos, temas médicos concretos, otros negocios), di amablemente que eso lo resuelve mejor el equipo por teléfono en el 957 327 291.

## Datos de la clínica
- Dirección: Av. de la Pedanía, 202, 14710 Villarrubia, Córdoba
- Teléfono: 957 327 291 (también urgencias el mismo día en horario de clínica)
- Email: citas@moyayarandavillarrubia.com
- Horario: lunes a viernes 9:00–14:00 y 15:00–20:00 · sábados 9:00–14:00 · domingos cerrado

## Tratamientos
${services.map((s) => `- ${s.title}: ${s.description}`).join("\n")}
Los precios se dan como presupuesto cerrado tras la primera revisión (gratuita). Si preguntan por un precio concreto, no lo inventes: explica que se valora en la primera visita sin compromiso.

## Equipo
${team.map((t) => `- ${t.name} — ${t.specialty} (${t.license})`).join("\n")}

## Preguntas frecuentes
${faqs.map((f) => `P: ${f.question}\nR: ${f.answer}`).join("\n\n")}

${citasSection}`;
}

const tools: Anthropic.Tool[] = [
  {
    name: "consultar_disponibilidad",
    description:
      "Devuelve los huecos libres de la agenda de la clínica para una fecha y tratamiento. Llámala cuando el usuario pregunte por disponibilidad o quiera reservar.",
    input_schema: {
      type: "object",
      properties: {
        date: { type: "string", description: "Fecha en formato YYYY-MM-DD" },
        treatment: {
          type: "string",
          description: `Tratamiento solicitado. Uno de: ${services.map((s) => s.title).join(", ")}. Si el usuario no lo especifica usa "Limpieza dental".`,
        },
      },
      required: ["date", "treatment"],
    },
  },
  {
    name: "reservar_cita",
    description:
      "Reserva una cita si el hueco está libre. Si está ocupado devuelve alternativas cercanas. Solo llámala cuando tengas todos los datos del paciente.",
    input_schema: {
      type: "object",
      properties: {
        date: { type: "string", description: "Fecha en formato YYYY-MM-DD" },
        time: { type: "string", description: "Hora en formato HH:mm" },
        treatment: { type: "string", description: "Tratamiento solicitado" },
        fullName: { type: "string", description: "Nombre completo del paciente" },
        phone: { type: "string", description: "Teléfono de contacto" },
        email: { type: "string", description: "Email de contacto" },
      },
      required: ["date", "time", "treatment", "fullName", "phone", "email"],
    },
  },
];

async function runTool(name: string, input: Record<string, string>): Promise<string> {
  if (name === "consultar_disponibilidad") {
    if (!isOpenDay(input.date)) {
      return JSON.stringify({ open: false, message: "La clínica cierra los domingos" });
    }
    const duration = treatmentDuration(input.treatment);
    const slots = freeSlotsFor(input.date, duration);
    if (slots.length === 0) {
      return JSON.stringify({
        open: true,
        freeSlots: [],
        nearestAlternatives: findSuggestions(input.date, "12:00", duration),
      });
    }
    return JSON.stringify({ open: true, freeSlots: slots });
  }

  if (name === "reservar_cita") {
    if (!isOpenDay(input.date)) {
      return JSON.stringify({ status: "error", message: "La clínica cierra los domingos" });
    }
    const outcome = tryBook({
      fullName: input.fullName,
      phone: input.phone,
      email: input.email,
      treatment: input.treatment,
      date: input.date,
      time: input.time,
    });
    if (outcome.status === "confirmed") {
      const { sendBookingConfirmation } = await import("@/server/email");
      await sendBookingConfirmation({
        fullName: input.fullName,
        email: input.email,
        treatment: input.treatment,
        date: outcome.date,
        time: outcome.time,
      });
    }
    return JSON.stringify(outcome);
  }

  return JSON.stringify({ status: "error", message: `Herramienta desconocida: ${name}` });
}

// Respuesta de emergencia cuando no hay ANTHROPIC_API_KEY configurada:
// busca la FAQ con más palabras en común y la devuelve tal cual.
function fallbackAnswer(question: string): string {
  const words = question
    .toLowerCase()
    .split(/[^a-záéíóúüñ]+/)
    .filter((w) => w.length > 3);
  let best: { score: number; answer: string } = { score: 0, answer: "" };
  for (const faq of faqs) {
    const haystack = (faq.question + " " + faq.answer).toLowerCase();
    const score = words.filter((w) => haystack.includes(w)).length;
    if (score > best.score) best = { score, answer: faq.answer };
  }
  if (best.score >= 2) return best.answer;
  return "Ahora mismo no puedo responder a eso desde el chat. Llámanos al 957 327 291 o escribe a citas@moyayarandavillarrubia.com y te ayudamos encantados.";
}

// Modelo gratuito de Cloudflare Workers AI usado como motor de pruebas
// cuando no hay ANTHROPIC_API_KEY configurada (ver wrangler.jsonc, binding "AI").
const WORKERS_AI_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";

interface WorkersAI {
  run(model: string, input: Record<string, unknown>): Promise<{ response?: string } | string>;
}

// Nitro (preset cloudflare-module) expone los bindings del Worker en
// globalThis.__env__ en cada request; es el mismo objeto para toda petición
// a este Worker, así que leerlo aquí no compite con otras peticiones.
function getWorkersAI(): WorkersAI | undefined {
  const env = (globalThis as { __env__?: { AI?: WorkersAI } }).__env__;
  return env?.AI;
}

async function answerWithClaude(turns: ChatTurn[]): Promise<string> {
  const client = new Anthropic();

  // El primer mensaje del widget es el saludo del asistente; la API exige
  // que la conversación empiece por un turno de usuario.
  const messages: Anthropic.MessageParam[] = turns
    .slice(turns.findIndex((m) => m.role === "user"))
    .map((m) => ({ role: m.role, content: m.content }));

  const system = buildSystemPrompt(true);

  for (let i = 0; i < 5; i++) {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      system,
      tools,
      messages,
    });

    if (response.stop_reason !== "tool_use") {
      const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n");
      return text || "Perdona, no te he entendido. ¿Puedes reformularlo?";
    }

    messages.push({ role: "assistant", content: response.content });
    const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
      response.content
        .filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use")
        .map(async (b) => ({
          type: "tool_result" as const,
          tool_use_id: b.id,
          content: await runTool(b.name, b.input as Record<string, string>),
        })),
    );
    messages.push({ role: "user", content: toolResults });
  }

  return "Se me está complicando gestionarlo desde el chat. Llámanos al 957 327 291 y lo cerramos en un minuto.";
}

async function answerWithWorkersAI(ai: WorkersAI, turns: ChatTurn[]): Promise<string> {
  const system = buildSystemPrompt(false);
  const messages = turns
    .slice(turns.findIndex((m) => m.role === "user"))
    .map((m) => ({ role: m.role, content: m.content }));

  try {
    const result = await ai.run(WORKERS_AI_MODEL, {
      messages: [{ role: "system", content: system }, ...messages],
      max_tokens: 512,
    });
    const text = typeof result === "string" ? result : result?.response;
    return text?.trim() || "Perdona, no te he entendido. ¿Puedes reformularlo?";
  } catch {
    const lastUser = [...turns].reverse().find((m) => m.role === "user");
    return fallbackAnswer(lastUser?.content ?? "");
  }
}

export async function answerChat(turns: ChatTurn[]): Promise<string> {
  if (process.env.ANTHROPIC_API_KEY) {
    return answerWithClaude(turns);
  }

  const workersAI = getWorkersAI();
  if (workersAI) {
    return answerWithWorkersAI(workersAI, turns);
  }

  const lastUser = [...turns].reverse().find((m) => m.role === "user");
  return fallbackAnswer(lastUser?.content ?? "");
}
