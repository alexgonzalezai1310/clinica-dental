import { useEffect, useRef } from "react";
import clinic from "@/assets/hero-clinic.jpg";

// Sección cinematográfica con GSAP + ScrollTrigger: la imagen de la clínica
// arranca como tarjeta enmarcada en arco y, con el scroll (sección fijada),
// se expande suavemente hasta ocupar toda la pantalla mientras la propia foto
// hace un recorrido interno (parallax / Ken Burns). El texto emerge al final.
// Respeta prefers-reduced-motion vía gsap.matchMedia.
export function Facilities() {
  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const caption = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let killed = false;
    let ctx: { revert: () => void } | undefined;

    (async () => {
      // Import dinámico: GSAP solo debe evaluarse en el navegador (SSR-safe).
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (killed || !section.current) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add("(prefers-reduced-motion: no-preference)", () => {
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: section.current,
                start: "top top",
                end: "+=170%",
                scrub: 0.6,
                pin: true,
                anticipatePin: 1,
              },
            })
            // el marco se expande de tarjeta en arco a pantalla completa
            .fromTo(
              frame.current,
              { scale: 0.58, borderRadius: "320px 320px 28px 28px" },
              { scale: 1, borderRadius: "0px 0px 0px 0px", duration: 1 },
              0,
            )
            // parallax interno: la foto viaja y se asienta (Ken Burns)
            .fromTo(
              img.current,
              { scale: 1.3, yPercent: -10 },
              { scale: 1, yPercent: 6, duration: 1 },
              0,
            )
            // el texto emerge cuando la imagen ya domina la pantalla
            .fromTo(
              caption.current,
              { opacity: 0, y: 48 },
              { opacity: 1, y: 0, duration: 0.35 },
              0.62,
            );
        });
      }, section);
    })();

    return () => {
      killed = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={section} className="relative h-screen overflow-hidden" aria-label="Nuestras instalaciones">
      <div className="absolute inset-0 grid place-items-center">
        <div ref={frame} className="relative w-full h-full overflow-hidden will-change-transform">
          <img
            ref={img}
            src={clinic}
            alt="Instalaciones de la Clínica Dental S. Moya & R. Aranda"
            className="w-full h-full object-cover will-change-transform"
          />
          {/* velo inferior para el texto */}
          <div
            className="absolute inset-x-0 bottom-0 h-2/3"
            style={{ background: "linear-gradient(180deg, transparent, rgba(12,36,46,0.72))" }}
          />
          <div ref={caption} className="absolute inset-x-0 bottom-0 pb-14 md:pb-20 text-center px-6">
            <p className="eyebrow justify-center" style={{ color: "#ffd9a1" }}>
              Nuestras instalaciones
            </p>
            <h2 className="mt-4 font-serif text-white text-3xl sm:text-5xl leading-tight drop-shadow-lg">
              Tecnología de vanguardia,
              <br />
              trato de pueblo
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
