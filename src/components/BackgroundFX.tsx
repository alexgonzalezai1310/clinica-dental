import { useEffect, useRef } from "react";

// Fondo vivo: capa fija detrás de todo el contenido. Tres manchas de color
// suaves (petróleo / miel / menta) que derivan lentamente y, sobre todo, se
// desplazan en parallax al hacer scroll, más un grano muy sutil que quita la
// sensación de blanco plano. Respeta prefers-reduced-motion.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function BackgroundFX() {
  const b1 = useRef<HTMLDivElement>(null);
  const b2 = useRef<HTMLDivElement>(null);
  const b3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      // cada mancha se mueve a distinta velocidad → sensación de profundidad
      if (b1.current) b1.current.style.transform = `translate3d(0, ${y * 0.22}px, 0)`;
      if (b2.current) b2.current.style.transform = `translate3d(0, ${y * -0.14}px, 0)`;
      if (b3.current) b3.current.style.transform = `translate3d(0, ${y * 0.32}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* base con un leve degradado vertical para que no sea plano */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--sun) 6%, var(--background)) 0%, var(--background) 34%, color-mix(in srgb, var(--primary) 5%, var(--background)) 100%)",
        }}
      />
      {/* manchas de color (parallax + deriva) */}
      <div ref={b1} className="absolute -top-24 -right-24 will-change-transform">
        <div
          className="drift w-[46rem] h-[46rem] rounded-full blur-3xl opacity-70"
          style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--sun) 34%, transparent), transparent)" }}
        />
      </div>
      <div ref={b2} className="absolute top-[38%] -left-40 will-change-transform">
        <div
          className="drift-2 w-[42rem] h-[42rem] rounded-full blur-3xl opacity-60"
          style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--primary) 26%, transparent), transparent)" }}
        />
      </div>
      <div ref={b3} className="absolute bottom-[-10%] right-[6%] will-change-transform">
        <div
          className="drift-3 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-55"
          style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 22%, transparent), transparent)" }}
        />
      </div>
      {/* grano sutil */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
        style={{ backgroundImage: GRAIN, backgroundSize: "150px 150px" }}
      />
    </div>
  );
}
