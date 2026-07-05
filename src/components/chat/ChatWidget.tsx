import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ChatMessage } from "@/types";
import { sendChatMessage } from "@/lib/chat";
import { LogoMark } from "@/components/Logo";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "¡Hola! Soy el asistente de la Clínica Dental Silvia Moya Gaona. ¿En qué puedo ayudarte?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || typing) return;
    const userMsg: ChatMessage = { role: "user", content: text, timestamp: Date.now() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setTyping(true);
    try {
      const reply = await sendChatMessage(next);
      setMessages((m) => [...m, { role: "assistant", content: reply, timestamp: Date.now() }]);
    } finally {
      setTyping(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Cerrar chat" : "Abrir chat"}
        className="fixed z-50 bottom-5 right-5 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg grid place-items-center hover:scale-105 transition-transform"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Asistente de la Clínica Dental Silvia Moya Gaona"
          className="fixed z-50 bg-card border border-border shadow-2xl overflow-hidden flex flex-col
            inset-x-3 bottom-24 top-20 rounded-2xl
            sm:inset-auto sm:bottom-24 sm:right-5 sm:top-auto sm:w-[380px] sm:h-[560px]"
        >
          <header className="px-4 py-3 border-b border-border flex items-center gap-3 bg-secondary/40">
            <span className="w-8 h-8 rounded-full bg-background border border-border grid place-items-center">
              <LogoMark className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-semibold leading-none">Asistente Silvia Moya</p>
              <p className="text-xs text-muted-foreground mt-0.5">En línea · te respondemos al momento</p>
            </div>
          </header>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`animate-chat-in flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary text-foreground rounded-bl-md"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start animate-chat-in">
                <div className="bg-secondary rounded-2xl rounded-bl-md px-3.5 py-2.5 text-sm inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>
          <form onSubmit={onSend} className="p-3 border-t border-border flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje…"
              aria-label="Mensaje"
            />
            <Button type="submit" size="icon" aria-label="Enviar" disabled={typing || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
