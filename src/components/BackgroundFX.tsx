import { useEffect, useRef } from "react";
import clinic from "@/assets/hero-clinic.jpg";

// Fondo cinematográfico ambiental: la escena de la clínica que, al bajar por
// la página, se acerca (zoom) como si la cámara avanzara hacia el paciente,
// desvaneciéndose después en el color de fondo. El cierre en primer plano de
// dientes vive en su propia sección (ver Outro / Teeth). Un velo mantiene el
// texto legible; respeta prefers-reduced-motion.
//
// NOTA: la escena usa la foto de clínica del repo. Para la foto exacta (p. ej.
// la escena del dentista con el paciente), basta con cambiar esta imagen.

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const seg = (p: number, i: number, o: number) => clamp((p - i) / (o - i));

export function BackgroundFX() {
  const scene = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const render = () => {
      raf = 0;
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const p = reduce ? 0.08 : clamp(window.scrollY / max);

      // La cámara avanza hacia el paciente (zoom) durante la primera mitad y
      // después la escena se retira dando paso al contenido y al cierre.
      const scale = lerp(1, 3.4, Math.pow(seg(p, 0, 0.62), 1.3));
      const blur = lerp(0, 9, seg(p, 0.34, 0.66));
      const opacity = lerp(0.9, 0, seg(p, 0.4, 0.72));

      if (scene.current) {
        scene.current.style.transform = `scale(${scale.toFixed(3)})`;
        scene.current.style.filter = `blur(${blur.toFixed(1)}px)`;
        scene.current.style.opacity = opacity.toFixed(3);
      }
    };

    render();
    if (reduce) return;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-background">
      {/* degradado cálido de base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--sun) 8%, var(--background)) 0%, var(--background) 42%, color-mix(in srgb, var(--primary) 7%, var(--background)) 100%)",
        }}
      />

      {/* escena de la clínica con zoom (origen ≈ donde estaría la boca) */}
      <div ref={scene} className="absolute inset-0 will-change-transform" style={{ transformOrigin: "62% 52%" }}>
        <img src={clinic} alt="" className="w-full h-full object-cover" />
      </div>

      {/* velo para legibilidad */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--background) 66%, transparent), color-mix(in srgb, var(--background) 80%, transparent))",
        }}
      />

      {/* grano sutil */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
        style={{ backgroundImage: GRAIN, backgroundSize: "150px 150px" }}
      />
    </div>
  );
}
