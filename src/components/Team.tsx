import { team } from "@/data/team";

export function Team() {
  return (
    <section id="equipo" className="py-20 md:py-28">
      <div className="container-page">
        <div className="grid md:grid-cols-2 gap-10 items-end">
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-wider">Nuestro equipo</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold">
              Profesionales que cuidan de ti
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            Desde 2009 combinamos la excelencia clínica con un trato humano.
            Un equipo multidisciplinar que se forma cada año en las técnicas más avanzadas.
          </p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((m) => (
            <div key={m.name} className="bg-card rounded-2xl overflow-hidden border border-border">
              <img src={m.photo} alt={m.name} className="w-full aspect-[4/5] object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-semibold">{m.name}</h3>
                <p className="text-sm text-primary mt-1">{m.specialty}</p>
                <p className="text-xs text-muted-foreground mt-2">{m.license}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
