import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function Contact() {
  return (
    <section id="contacto" className="py-20 md:py-28 bg-secondary/40">
      <div className="container-page grid md:grid-cols-2 gap-10">
        <div>
          <p className="text-sm font-medium text-primary uppercase tracking-wider">Contacto</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold">Estamos a un paso de tu sonrisa</h2>
          <ul className="mt-8 space-y-5">
            <li className="flex gap-4">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Dirección</p>
                <p className="text-sm text-muted-foreground">Calle Serrano 148, 28006 Madrid</p>
              </div>
            </li>
            <li className="flex gap-4">
              <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Teléfono</p>
                <p className="text-sm text-muted-foreground">900 123 456</p>
              </div>
            </li>
            <li className="flex gap-4">
              <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">citas@luminova-dental.es</p>
              </div>
            </li>
            <li className="flex gap-4">
              <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Horarios</p>
                <p className="text-sm text-muted-foreground">Lun-Vie 9:00–20:00 · Sáb 9:00–14:00</p>
              </div>
            </li>
          </ul>
        </div>
        <div className="rounded-2xl overflow-hidden border border-border bg-card min-h-[320px] grid place-items-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/10 to-transparent" />
          <div className="relative text-center px-6">
            <MapPin className="w-8 h-8 text-primary mx-auto" />
            <p className="mt-3 font-medium">Encuéntranos en el centro de Madrid</p>
            <p className="text-sm text-muted-foreground mt-1">Mapa disponible próximamente</p>
          </div>
        </div>
      </div>
    </section>
  );
}
