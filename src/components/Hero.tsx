import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Clock } from "lucide-react";
import hero from "@/assets/hero-clinic.jpg";

export function Hero({ onBook }: { onBook: () => void }) {
  const heroImg = useRef<HTMLImageElement>(null);

  // Parallax sutil de la imagen del hero con GSAP + ScrollTrigger.
  useEffect(() => {
    let killed = false;
    let ctx: { revert: () => void } | undefined;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (killed || !heroImg.current) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap.fromTo(
            heroImg.current,
            { yPercent: -6, scale: 1.12 },
            {
              yPercent: 6,
              scale: 1.02,
              ease: "none",
              scrollTrigger: {
                trigger: heroImg.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
              },
            },
          );
        });
      });
    })();
    return () => {
      killed = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section id="inicio" className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="container-page relative grid md:grid-cols-[1.05fr_0.95fr] gap-12 md:gap-10 items-center">
        <div className="rise">
          <p className="eyebrow">Clínica dental en Villarrubia · Córdoba</p>
          <h1 className="mt-5 text-[2.6rem] leading-[1.03] sm:text-6xl md:text-[4.1rem] font-serif">
            Tu sonrisa,
            <br />
            en las{" "}
            <span className="relative whitespace-nowrap text-primary">
              mejores manos
              <svg
                aria-hidden
                viewBox="0 0 300 20"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 w-full h-[0.5em]"
              >
                <path
                  d="M4 13 C 70 4, 150 4, 296 11"
                  fill="none"
                  stroke="var(--sun)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <p className="mt-7 text-lg text-muted-foreground max-w-lg">
            En la Clínica Dental S. Moya &amp; R. Aranda ofrecemos odontología general, implantes,
            ortodoncia y más, todo bajo un mismo techo, con un trato cercano y familiar.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={onBook} size="lg" className="rounded-full px-7 h-12 text-base shadow-sm">
              Reservar cita
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-7 h-12 text-base bg-card">
              <a href="#servicios">Ver servicios</a>
            </Button>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm">
            <a href="tel:+34957327291" className="inline-flex items-center gap-2 font-medium hover:text-primary transition-colors">
              <span className="grid place-items-center w-8 h-8 rounded-full bg-secondary text-primary">
                <Phone className="w-4 h-4" />
              </span>
              957 327 291
            </a>
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <span className="grid place-items-center w-8 h-8 rounded-full bg-secondary text-primary">
                <Clock className="w-4 h-4" />
              </span>
              L-V · 9:00–13:00 y 16:30–20:00
            </span>
          </div>
        </div>

        <div className="rise [animation-delay:120ms]">
          <div className="relative mx-auto max-w-sm md:max-w-none">
            {/* marco en arco (Mezquita de Córdoba) */}
            <div className="arch-frame border border-border shadow-[0_30px_60px_-24px_rgba(16,51,63,0.45)]">
              <img
                ref={heroImg}
                src={hero}
                alt="Interior de la Clínica Dental S. Moya & R. Aranda en Villarrubia, Córdoba"
                fetchPriority="high"
                decoding="async"
                className="w-full aspect-[4/5] object-cover will-change-transform"
              />
            </div>
            {/* pastilla flotante */}
            <div className="absolute -left-3 bottom-8 md:-left-6 rounded-2xl bg-card border border-border shadow-lg px-4 py-3">
              <p className="text-xs text-muted-foreground">Primera visita</p>
              <p className="font-serif text-lg text-primary leading-none mt-0.5">Gratuita</p>
            </div>
            <div className="absolute -right-2 top-6 md:-right-5 rounded-full bg-sun text-[var(--sun-foreground)] text-xs font-semibold px-4 py-2 shadow-md rotate-3">
              +20 años de experiencia
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
