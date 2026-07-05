import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import hero from "@/assets/hero-clinic.jpg";

export function Hero({ onBook }: { onBook: () => void }) {
  return (
    <section id="inicio" className="pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="container-page grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/40 text-accent-foreground px-3 py-1 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            +15 años de experiencia · +5.000 pacientes
          </div>
          <h1 className="mt-5 text-4xl md:text-6xl font-semibold leading-[1.05]">
            Tu sonrisa, <br />
            <span className="text-primary">en las mejores manos</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-lg">
            En la Clínica Dental Silvia Moya Gaona cuidamos cada detalle para ofrecerte una
            experiencia cercana, profesional y sin dolor. Primera visita gratuita.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={onBook} size="lg" className="rounded-full px-7">Reservar cita</Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-7">
              <a href="#servicios">Ver servicios</a>
            </Button>
          </div>
        </div>
        <div className="relative animate-fade-up">
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-primary/10 via-accent/20 to-transparent blur-2xl" />
          <img
            src={hero}
            alt="Clínica Dental Silvia Moya Gaona"
            className="relative rounded-[2rem] shadow-xl w-full aspect-square object-cover"
          />
        </div>
      </div>
    </section>
  );
}
