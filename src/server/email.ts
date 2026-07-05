import { format } from "date-fns";
import { es } from "date-fns/locale";

// Email de confirmación de cita vía Brevo (https://brevo.com, tier gratuito
// de 300 emails/día). Requiere dos variables de entorno en el Worker:
//   BREVO_API_KEY      — clave de API de Brevo
//   BREVO_SENDER_EMAIL — remitente verificado en Brevo
// Sin ellas, la reserva funciona igual pero no se envía email.

export interface BookingEmailData {
  fullName: string;
  email: string;
  treatment: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

export async function sendBookingConfirmation(booking: BookingEmailData): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!apiKey || !senderEmail) return false;

  const prettyDate = format(new Date(booking.date + "T00:00:00"), "EEEE d 'de' MMMM 'de' yyyy", {
    locale: es,
  });

  const htmlContent = `
<div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #2b2b2b;">
  <h1 style="font-size: 22px; font-weight: normal;">Cita confirmada ✓</h1>
  <p>Hola ${escapeHtml(booking.fullName)},</p>
  <p>Te confirmamos tu cita en <strong>Clínica Dental S. Moya & R. Aranda</strong>:</p>
  <table style="border-collapse: collapse; margin: 16px 0;">
    <tr><td style="padding: 4px 12px 4px 0; color: #777;">Tratamiento</td><td style="padding: 4px 0;"><strong>${escapeHtml(booking.treatment)}</strong></td></tr>
    <tr><td style="padding: 4px 12px 4px 0; color: #777;">Fecha</td><td style="padding: 4px 0;"><strong>${prettyDate}</strong></td></tr>
    <tr><td style="padding: 4px 12px 4px 0; color: #777;">Hora</td><td style="padding: 4px 0;"><strong>${booking.time}</strong></td></tr>
    <tr><td style="padding: 4px 12px 4px 0; color: #777;">Dirección</td><td style="padding: 4px 0;">Av. de la Pedanía, 202, 14710 Villarrubia, Córdoba</td></tr>
  </table>
  <p>Si necesitas cambiar o anular la cita, llámanos al <strong>957 327 291</strong> o responde a este correo.</p>
  <p style="color: #777; font-size: 13px; margin-top: 24px;">Clínica Dental S. Moya & R. Aranda · info@moyayarandavillarrubia.com · 957 327 291</p>
</div>`;

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: process.env.BREVO_SENDER_NAME || "Clínica Dental S. Moya & R. Aranda",
          email: senderEmail,
        },
        to: [{ email: booking.email, name: booking.fullName }],
        subject: `Cita confirmada: ${booking.treatment} — ${prettyDate} a las ${booking.time}`,
        htmlContent,
      }),
    });
    if (!res.ok) {
      console.error("[email] Brevo respondió", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Error enviando confirmación", err);
    return false;
  }
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
