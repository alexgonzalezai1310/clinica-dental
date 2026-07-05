import type { BookingRequest, SlotSuggestion } from "@/types";
import { services } from "@/data/services";

// Motor de agenda de la demo. Las citas viven en memoria y cada día se
// siembra con ocupación pseudoaleatoria pero determinista, para que al
// enseñar la demo siempre haya huecos ocupados y se vea la propuesta de
// alternativas.

const SLOT_MIN = 30;
// Horario real de la clínica: L-V 9:00–13:00 y 16:30–20:00 (sábados cerrado).
const MORNING = { start: 9 * 60, end: 13 * 60 };
const AFTERNOON = { start: 16 * 60 + 30, end: 20 * 60 };

// Duración estimada de cada tratamiento (minutos)
const DURATIONS: Record<string, number> = {
  "cirugia-implantes": 60,
  ortodoncia: 45,
  protesis: 60,
  general: 30,
  periodoncia: 45,
  endodoncia: 60,
};

interface StoredAppointment {
  date: string; // YYYY-MM-DD
  startMin: number;
  durationMin: number;
  treatment: string;
  fullName: string;
  phone: string;
  email: string;
  comments?: string;
}

const bookings: StoredAppointment[] = [];

export function treatmentDuration(treatment: string): number {
  const service = services.find((s) => s.title === treatment || s.id === treatment);
  return (service && DURATIONS[service.id]) || 30;
}

export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function toTime(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

function dayOfWeek(date: string): number {
  return new Date(date + "T00:00:00").getDay();
}

// Lun-Vie mañana y tarde; fines de semana cerrado (horario real de la clínica)
function windowsFor(date: string): { start: number; end: number }[] {
  const day = dayOfWeek(date);
  if (day === 0 || day === 6) return [];
  return [MORNING, AFTERNOON];
}

export function isOpenDay(date: string): boolean {
  return windowsFor(date).length > 0;
}

// Ocupación sembrada: ~1 de cada 3 franjas de 30 min aparece como reservada
function isSeededBusy(date: string, startMin: number): boolean {
  let h = 0;
  const key = `${date}:${startMin}`;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h % 3 === 0;
}

function overlapsBooking(date: string, startMin: number, durationMin: number): boolean {
  return bookings.some(
    (b) => b.date === date && startMin < b.startMin + b.durationMin && startMin + durationMin > b.startMin,
  );
}

export function isFree(date: string, startMin: number, durationMin: number): boolean {
  const fitsWindow = windowsFor(date).some((w) => startMin >= w.start && startMin + durationMin <= w.end);
  if (!fitsWindow) return false;
  for (let t = startMin; t < startMin + durationMin; t += SLOT_MIN) {
    if (isSeededBusy(date, t)) return false;
  }
  return !overlapsBooking(date, startMin, durationMin);
}

export function freeSlotsFor(date: string, durationMin: number): string[] {
  const slots: string[] = [];
  for (const w of windowsFor(date)) {
    for (let t = w.start; t + durationMin <= w.end; t += SLOT_MIN) {
      if (isFree(date, t, durationMin)) slots.push(toTime(t));
    }
  }
  return slots;
}

function nextDate(date: string): string {
  const d = new Date(date + "T00:00:00");
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

// Alternativas más cercanas a la hora pedida: primero el mismo día
// (ordenadas por distancia horaria), después los primeros huecos de los
// días siguientes, hasta reunir `count` propuestas.
export function findSuggestions(
  date: string,
  time: string,
  durationMin: number,
  count = 3,
): SlotSuggestion[] {
  const requested = toMinutes(time);
  const suggestions: SlotSuggestion[] = freeSlotsFor(date, durationMin)
    .sort((a, b) => Math.abs(toMinutes(a) - requested) - Math.abs(toMinutes(b) - requested))
    .slice(0, count)
    .map((t) => ({ date, time: t }));

  let day = date;
  for (let i = 0; i < 14 && suggestions.length < count; i++) {
    day = nextDate(day);
    for (const t of freeSlotsFor(day, durationMin)) {
      suggestions.push({ date: day, time: t });
      if (suggestions.length >= count) break;
    }
  }
  return suggestions;
}

export type BookingOutcome =
  | { status: "confirmed"; date: string; time: string }
  | { status: "conflict"; suggestions: SlotSuggestion[] };

export function tryBook(request: BookingRequest): BookingOutcome {
  const durationMin = treatmentDuration(request.treatment);
  const startMin = toMinutes(request.time);

  if (!isFree(request.date, startMin, durationMin)) {
    return { status: "conflict", suggestions: findSuggestions(request.date, request.time, durationMin) };
  }

  bookings.push({
    date: request.date,
    startMin,
    durationMin,
    treatment: request.treatment,
    fullName: request.fullName,
    phone: request.phone,
    email: request.email,
    comments: request.comments,
  });
  return { status: "confirmed", date: request.date, time: request.time };
}
