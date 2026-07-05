import { services } from "@/data/services";
import { Layers, Microscope, Scan, ShieldCheck, Smile, Sparkles, Stethoscope, Syringe, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = { Syringe, Smile, Layers, Stethoscope, ShieldCheck, Microscope, Scan, Sparkles };

export function Services() {
  return (
    <section id="servicios" className="py-20 md:py-28 bg-secondary/40">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary uppercase tracking-wider">Servicios</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold">
            Tratamientos completos para toda la familia
          </h2>
          <p className="mt-3 text-muted-foreground">
            Tecnología de última generación con un trato cercano. Presupuestos claros y sin sorpresas.
          </p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => {
            const Icon = iconMap[s.icon] ?? Sparkles;
            return (
              <div
                key={s.id}
                className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary grid place-items-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                {s.price && <p className="mt-4 text-sm font-medium text-foreground">{s.price}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
