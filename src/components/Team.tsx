import { team } from "@/data/team";

// Iniciales a partir del nombre, ignorando el tratamiento (Dr./Dra.).
function initials(name: string): string {
  const parts = name
    .replace(/^(Dr|Dra)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function Team() {
  return (
    <section id="equipo" className="py-20 md:py-28">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">La clínica</p>
          <h2 className="mt-4 text-3xl md:text-[2.75rem] leading-tight font-serif">
            Cuidamos sonrisas en Villarrubia con nombre propio
          </h2>
          <div className="mt-5 space-y-4 text-muted-foreground text-lg">
            <p>
              En la Clínica Dental S. Moya &amp; R. Aranda ofrecemos una gama completa de servicios
              odontológicos —odontología general, endodoncia, ortodoncia, implantes, prótesis y
              radiología digital— todo bajo un mismo techo, con un enfoque centrado en el paciente y
              soluciones personalizadas.
            </p>
            <p>
              Nuestro equipo se mantiene al día en las últimas técnicas y utilizamos solo los mejores
              materiales, instrumental y tecnología de vanguardia. Tu salud bucal y tu satisfacción
              son nuestra máxima prioridad.
            </p>
          </div>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 gap-6 max-w-3xl">
          {team.map((m) => (
            <div key={m.name} className="bg-card rounded-2xl p-6 border border-border flex items-center gap-5 transition-shadow hover:shadow-[0_20px_44px_-26px_rgba(16,51,63,0.4)]">
              {m.photo ? (
                <img src={m.photo} alt={m.name} className="arch-well w-16 h-20 object-cover shrink-0" />
              ) : (
                <span
                  aria-hidden
                  className="arch-well w-16 h-20 shrink-0 grid place-items-center text-xl font-serif font-semibold text-primary-foreground bg-gradient-to-b from-primary to-[#14536b]"
                >
                  {initials(m.name)}
                </span>
              )}
              <div>
                <h3 className="text-base font-serif font-medium leading-tight">{m.name}</h3>
                <p className="text-sm text-primary mt-1">{m.specialty}</p>
                {m.license && <p className="text-xs text-muted-foreground mt-1.5">{m.license}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
