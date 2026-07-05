import type { BookingRequest, BookingResult } from "@/types";
import { submitBookingFn } from "@/functions/booking";

export async function submitBooking(data: BookingRequest): Promise<BookingResult> {
  return submitBookingFn({ data });
}
