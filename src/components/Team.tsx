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
          <p className="text-sm font-medium text-primary uppercase tracking-wider">La clínica</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold">
            Excelencia en cuidado dental en Villarrubia
          </h2>
          <div className="mt-4 space-y-4 text-muted-foreground">
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
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((m) => (
            <div key={m.name} className="bg-card rounded-2xl p-6 border border-border flex items-center gap-4">
              {m.photo ? (
                <img src={m.photo} alt={m.name} className="w-16 h-16 rounded-full object-cover shrink-0" />
              ) : (
                <span
                  aria-hidden
                  className="w-16 h-16 rounded-full shrink-0 grid place-items-center text-lg font-serif font-semibold text-primary-foreground bg-gradient-to-br from-[#93C2EE] to-[#4C86C9]"
                >
                  {initials(m.name)}
                </span>
              )}
              <div>
                <h3 className="text-base font-semibold leading-tight">{m.name}</h3>
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
