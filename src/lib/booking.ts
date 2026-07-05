import type { BookingRequest } from "@/types";

// TODO: conectar con API de reservas
export async function submitBooking(data: BookingRequest): Promise<{ ok: true }> {
  console.log("[booking] submitBooking", data);
  await new Promise((r) => setTimeout(r, 400));
  return { ok: true };
}
