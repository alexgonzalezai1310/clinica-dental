import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { services } from "@/data/services";
import { submitBooking } from "@/lib/booking";
import type { BookingRequest } from "@/types";
import { toast } from "sonner";

type Errors = Partial<Record<keyof BookingRequest, string>>;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function isWeekday(iso: string) {
  const d = new Date(iso + "T00:00:00");
  const day = d.getDay();
  return day >= 1 && day <= 5;
}

export function BookingForm({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [form, setForm] = useState<BookingRequest>({
    fullName: "",
    phone: "",
    email: "",
    treatment: "",
    preferredDate: "",
    timeSlot: "morning",
    comments: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof BookingRequest>(k: K, v: BookingRequest[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function validate(): boolean {
    const e: Errors = {};
    if (form.fullName.trim().length < 3) e.fullName = "Introduce tu nombre completo";
    if (!/^[+\d\s()-]{7,}$/.test(form.phone)) e.phone = "Teléfono no válido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email no válido";
    if (!form.treatment) e.treatment = "Selecciona un tratamiento";
    if (!form.preferredDate) e.preferredDate = "Selecciona una fecha";
    else if (!isWeekday(form.preferredDate)) e.preferredDate = "Solo días laborables (L-V)";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await submitBooking(form);
      toast.success("Solicitud recibida, te contactaremos en breve");
      onOpenChange(false);
      setForm({ fullName: "", phone: "", email: "", treatment: "", preferredDate: "", timeSlot: "morning", comments: "" });
    } catch {
      toast.error("No se pudo enviar. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Reserva tu cita</DialogTitle>
          <DialogDescription>Te contactamos en menos de 24 h para confirmar.</DialogDescription>
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
              <Label htmlFor="preferredDate">Fecha preferida</Label>
              <Input id="preferredDate" type="date" min={todayISO()} value={form.preferredDate} onChange={(e) => update("preferredDate", e.target.value)} />
              {errors.preferredDate && <p className="text-xs text-destructive">{errors.preferredDate}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="timeSlot">Franja horaria</Label>
              <Select value={form.timeSlot} onValueChange={(v) => update("timeSlot", v as "morning" | "afternoon")}>
                <SelectTrigger id="timeSlot"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Mañana (9:00–14:00)</SelectItem>
                  <SelectItem value="afternoon">Tarde (15:00–20:00)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="comments">Comentarios (opcional)</Label>
            <Textarea id="comments" rows={3} value={form.comments} onChange={(e) => update("comments", e.target.value)} />
          </div>
          <Button type="submit" disabled={submitting} className="w-full rounded-full">
            {submitting ? "Enviando…" : "Solicitar cita"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
