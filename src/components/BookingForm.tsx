import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { services } from "@/data/services";
import { submitBooking } from "@/lib/booking";
import type { BookingRequest, SlotSuggestion } from "@/types";
import { toast } from "sonner";

type Errors = Partial<Record<keyof BookingRequest, string>>;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function dayOfWeek(iso: string) {
  return new Date(iso + "T00:00:00").getDay();
}

function isOpenDay(iso: string) {
  const day = dayOfWeek(iso);
  return day >= 1 && day <= 5; // L-V; fines de semana cerrado
}

// Horas seleccionables: L-V 9:00–13:00 y 16:30–20:00 (horario real de la clínica)
function timesFor(): string[] {
  const times: string[] = [];
  for (let m = 9 * 60; m < 13 * 60; m += 30) times.push(toTime(m));
  for (let m = 16 * 60 + 30; m < 20 * 60; m += 30) times.push(toTime(m));
  return times;
}

function toTime(min: number) {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

function suggestionLabel(s: SlotSuggestion) {
  return `${format(new Date(s.date + "T00:00:00"), "EEE d MMM", { locale: es })} · ${s.time}`;
}

const EMPTY_FORM: BookingRequest = {
  fullName: "",
  phone: "",
  email: "",
  treatment: "",
  date: "",
  time: "",
  comments: "",
};

export function BookingForm({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [form, setForm] = useState<BookingRequest>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState<SlotSuggestion[] | null>(null);

  function update<K extends keyof BookingRequest>(k: K, v: BookingRequest[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    if (k === "date" || k === "time") setSuggestions(null);
  }

  function validate(candidate: BookingRequest): boolean {
    const e: Errors = {};
    if (candidate.fullName.trim().length < 3) e.fullName = "Introduce tu nombre completo";
    if (!/^[+\d\s()-]{7,}$/.test(candidate.phone)) e.phone = "Teléfono no válido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate.email)) e.email = "Email no válido";
    if (!candidate.treatment) e.treatment = "Selecciona un tratamiento";
    if (!candidate.date) e.date = "Selecciona una fecha";
    else if (!isOpenDay(candidate.date)) e.date = "Solo atendemos de lunes a viernes";
    if (!candidate.time) e.time = "Selecciona una hora";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function book(candidate: BookingRequest) {
    if (!validate(candidate)) return;
    setSubmitting(true);
    try {
      const result = await submitBooking(candidate);
      if (result.status === "confirmed") {
        toast.success(
          `Cita confirmada: ${format(new Date(result.date + "T00:00:00"), "EEEE d 'de' MMMM", { locale: es })} a las ${result.time}`,
        );
        onOpenChange(false);
        setForm(EMPTY_FORM);
        setSuggestions(null);
      } else {
        setSuggestions(result.suggestions);
      }
    } catch {
      toast.error("No se pudo enviar. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    await book(form);
  }

  // Reservar directamente la alternativa propuesta (se revalida en el servidor)
  async function acceptSuggestion(s: SlotSuggestion) {
    const candidate = { ...form, date: s.date, time: s.time };
    setForm(candidate);
    setSuggestions(null);
    await book(candidate);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Reserva tu cita</DialogTitle>
          <DialogDescription>Comprobamos la agenda al momento y confirmamos tu hueco.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 mt-2" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input id="fullName" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
            {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" inputMode="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="treatment">Tratamiento</Label>
            <Select value={form.treatment} onValueChange={(v) => update("treatment", v)}>
              <SelectTrigger id="treatment"><SelectValue placeholder="Selecciona un tratamiento" /></SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.treatment && <p className="text-xs text-destructive">{errors.treatment}</p>}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" type="date" min={todayISO()} value={form.date} onChange={(e) => update("date", e.target.value)} />
              {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="time">Hora</Label>
              <Select value={form.time} onValueChange={(v) => update("time", v)}>
                <SelectTrigger id="time"><SelectValue placeholder="Elige hora" /></SelectTrigger>
                <SelectContent>
                  {timesFor().map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.time && <p className="text-xs text-destructive">{errors.time}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="comments">Comentarios (opcional)</Label>
            <Textarea id="comments" rows={3} value={form.comments} onChange={(e) => update("comments", e.target.value)} />
          </div>

          {suggestions && (
            <div className="rounded-xl border border-border bg-secondary/40 p-4 space-y-3">
              <p className="text-sm font-medium">
                Las {form.time} de ese día ya está ocupada. Te proponemos el hueco libre más cercano:
              </p>
              {suggestions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <Button
                      key={`${s.date}-${s.time}`}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      disabled={submitting}
                      onClick={() => acceptSuggestion(s)}
                    >
                      {suggestionLabel(s)}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No quedan huecos próximos. Llámanos al 957 327 291 y te buscamos sitio.
                </p>
              )}
            </div>
          )}

          <Button type="submit" disabled={submitting} className="w-full rounded-full">
            {submitting ? "Comprobando agenda…" : "Solicitar cita"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
