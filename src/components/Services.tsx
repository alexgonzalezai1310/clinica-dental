import { services } from "@/data/services";
import { Layers, Microscope, Scan, ShieldCheck, Smile, Sparkles, Stethoscope, Syringe, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = { Syringe, Smile, Layers, Stethoscope, ShieldCheck, Microscope, Scan, Sparkles };

export function Services() {
  return (
    <section id="servicios" className="py-20 md:py-28 bg-secondary/50 border-y border-border">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">Lo que hacemos</p>
          <h2 className="mt-4 text-3xl md:text-[2.75rem] leading-tight font-serif">
            Todo tu cuidado dental, bajo un mismo techo
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            De la revisión a la cirugía, con tecnología actual y un trato cercano. Presupuesto
            cerrado tras la primera visita, sin sorpresas.
          </p>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => {
            const Icon = iconMap[s.icon] ?? Sparkles;
            return (
              <article
                key={s.id}
                className="group relative bg-card rounded-2xl p-7 border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(16,51,63,0.4)]"
              >
                <div className="arch-well w-14 h-14 grid place-items-center bg-secondary text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <h3 className="mt-6 text-lg font-serif font-medium">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                {s.price && <p className="mt-4 text-sm font-medium">{s.price}</p>}
                <span
                  aria-hidden
                  className="mt-5 block h-0.5 w-8 rounded-full bg-sun transition-all duration-300 group-hover:w-14"
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
