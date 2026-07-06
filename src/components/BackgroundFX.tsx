import { useEffect, useRef } from "react";
import clinic from "@/assets/hero-clinic.jpg";
import { TeethCloseup } from "@/components/Teeth";

// Fondo cinematográfico en tres fases, todo detrás del contenido:
//   1. La escena de la clínica (dentista/paciente) llena el fondo.
//   2. Al bajar, la cámara avanza hacia la boca de la paciente: zoom con
//      desenfoque y un paso cálido coral, como atravesando los labios.
//   3. Al final, el fondo es la dentadura perfecta con símbolos de brillo.
// Un velo mantiene el texto legible. Respeta prefers-reduced-motion.
//
// NOTA: la escena usa la foto de clínica del repo; MOUTH_ORIGIN marca hacia
// dónde apunta el zoom. Si se sustituye la foto por la del dentista con la
// paciente, basta ajustar ese punto a la boca (p. ej. "62% 46%").

const MOUTH_ORIGIN = "62% 50%";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const seg = (p: number, i: number, o: number) => clamp((p - i) / (o - i));

export function BackgroundFX() {
  const scene = useRef<HTMLDivElement>(null);
  const lips = useRef<HTMLDivElement>(null);
  const teeth = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const render = () => {
      raf = 0;
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const p = reduce ? 0.06 : clamp(window.scrollY / max);

      // Fase 1 → 2: la cámara avanza hacia la boca (zoom fuerte + desenfoque).
      const push = seg(p, 0, 0.58);
      const sceneScale = lerp(1, 6, Math.pow(push, 1.45));
      const sceneBlur = lerp(0, 16, seg(p, 0.3, 0.6));
      const sceneOpacity = 1 - seg(p, 0.42, 0.62);

      // Paso por los labios: velo coral que culmina a mitad de camino.
      const lipsO = Math.sin(seg(p, 0.34, 0.66) * Math.PI) * 0.85;

      // Fase 3: la dentadura emerge y se asienta.
      const reveal = seg(p, 0.52, 0.74);
      const teethScale = lerp(1.35, 1, seg(p, 0.52, 0.95));
      const teethBlur = lerp(12, 0, seg(p, 0.55, 0.8));

      // El velo de legibilidad se aligera al final para lucir la dentadura.
      const veilO = lerp(1, 0.55, seg(p, 0.7, 1));

      if (scene.current) {
        scene.current.style.transform = `scale(${sceneScale.toFixed(3)})`;
        scene.current.style.filter = `blur(${sceneBlur.toFixed(1)}px)`;
        scene.current.style.opacity = sceneOpacity.toFixed(3);
      }
      if (lips.current) lips.current.style.opacity = lipsO.toFixed(3);
      if (teeth.current) {
        teeth.current.style.opacity = reveal.toFixed(3);
        teeth.current.style.transform = `scale(${teethScale.toFixed(3)})`;
        teeth.current.style.filter = `blur(${teethBlur.toFixed(1)}px)`;
      }
      if (veil.current) veil.current.style.opacity = veilO.toFixed(3);
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
      {/* Fase 3: dentadura perfecta con brillos (queda debajo, se revela) */}
      <div ref={teeth} className="absolute inset-0 opacity-0 will-change-transform">
        <TeethCloseup className="w-full h-full" sparkles />
      </div>

      {/* Fase 1-2: escena de la clínica con zoom hacia la boca */}
      <div ref={scene} className="absolute inset-0 will-change-transform" style={{ transformOrigin: MOUTH_ORIGIN }}>
        <img src={clinic} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Paso por los labios (velo coral) */}
      <div
        ref={lips}
        className="absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(circle at 62% 50%, #f6b5a4 0%, #e88a74 45%, rgba(232,138,116,0.6) 100%)",
        }}
      />

      {/* Velo para legibilidad (se aligera al final) */}
      <div
        ref={veil}
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--background) 68%, transparent), color-mix(in srgb, var(--background) 80%, transparent))",
        }}
      />

      {/* Grano sutil */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
        style={{ backgroundImage: GRAIN, backgroundSize: "150px 150px" }}
      />
    </div>
  );
}
