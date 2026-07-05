import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { BookingResult } from "@/types";

const bookingSchema = z.object({
  fullName: z.string().trim().min(3),
  phone: z.string().regex(/^[+\d\s()-]{7,}$/),
  email: z.string().email(),
  treatment: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  comments: z.string().max(500).optional(),
});

export const submitBookingFn = createServerFn({ method: "POST" })
  .validator(bookingSchema)
  .handler(async ({ data }): Promise<BookingResult> => {
    // Import dinámico: el motor de agenda vive en src/server y nunca
    // debe llegar al bundle del cliente.
    const { isOpenDay, tryBook } = await import("@/server/schedule");
    if (!isOpenDay(data.date)) {
      throw new Error("La clínica cierra los domingos");
    }
    const result = tryBook(data);
    if (result.status === "confirmed") {
      // El email no debe bloquear ni romper la reserva: si falla, la cita
      // sigue confirmada y queda el aviso en los logs del Worker.
      const { sendBookingConfirmation } = await import("@/server/email");
      await sendBookingConfirmation({
        fullName: data.fullName,
        email: data.email,
        treatment: data.treatment,
        date: result.date,
        time: result.time,
      });
    }
    return result;
  });
