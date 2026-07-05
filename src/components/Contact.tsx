import { MapPin, Phone, Mail, Clock } from "lucide-react";

const ADDRESS = "Av. de la Pedanía, 202, 14710 Villarrubia, Córdoba";
const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`;
const MAP_LINK = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}`;

const items = [
  { icon: MapPin, label: "Dirección", value: [ADDRESS] },
  { icon: Phone, label: "Teléfono", value: ["957 327 291"] },
  { icon: Mail, label: "Email", value: ["info@moyayarandavillarrubia.com"] },
  {
    icon: Clock,
    label: "Horarios",
    value: ["Lunes a viernes: 9:00–13:00 y 16:30–20:00", "Sábado y domingo: cerrado"],
  },
];

export function Contact() {
  return (
    <section id="contacto" className="py-20 md:py-28 bg-secondary/50 border-t border-border">
      <div className="container-page grid md:grid-cols-2 gap-10 items-start">
        <div>
          <p className="eyebrow">Contacto</p>
          <h2 className="mt-4 text-3xl md:text-[2.75rem] leading-tight font-serif">
            Estamos a un paso de tu sonrisa
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-md">
            Ven a conocernos o pide cita. Te atendemos en el centro de Villarrubia con la mejor
            tecnología y el trato de siempre.
          </p>
          <ul className="mt-9 space-y-5">
            {items.map((it) => (
              <li key={it.label} className="flex gap-4">
                <span className="grid place-items-center w-10 h-10 rounded-full bg-card border border-border text-primary shrink-0">
                  <it.icon className="w-4.5 h-4.5" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="font-medium">{it.label}</p>
                  {it.value.map((v) => (
                    <p key={v} className="text-sm text-muted-foreground">{v}</p>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <a
          href={MAP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-2xl overflow-hidden border border-border bg-card shadow-sm relative"
          aria-label="Ver ubicación en Google Maps"
        >
          <iframe
            title="Mapa de la clínica"
            src={MAP_SRC}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-[380px] md:h-[460px] block border-0 grayscale-[0.15] transition-all duration-500 group-hover:grayscale-0"
          />
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-card/95 border border-border px-3 py-1.5 text-xs font-medium shadow-sm inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" /> Cómo llegar
          </span>
        </a>
      </div>
    </section>
  );
}
