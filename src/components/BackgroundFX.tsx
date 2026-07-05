import { useEffect, useRef } from "react";

// Fondo vivo: una arcada de dientes blancos, perfectos y con brillo, dibujada
// en SVG detrás del contenido. Al hacer scroll, el encuadre recorre la
// dentadura de un lado al otro (parallax horizontal), con destellos que
// parpadean como el del logo. Debajo, un degradado cálido y un grano sutil
// evitan el blanco plano. Respeta prefers-reduced-motion.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const TOOTH_COUNT = 16;
const GAP = 14;

interface Tooth {
  x: number; // centro X
  bottomY: number;
  w: number;
  h: number;
  rot: number;
}

// Arcada superior estilizada: incisivos grandes en el centro, piezas más
// pequeñas hacia los extremos, bordes inferiores siguiendo la curva de la
// sonrisa y un leve abanico en la rotación.
function buildArch(): { teeth: Tooth[]; width: number } {
  const teeth: Tooth[] = [];
  let x = 0;
  for (let i = 0; i < TOOTH_COUNT; i++) {
    const t = ((i + 0.5) / TOOTH_COUNT) * 2 - 1; // -1 … 1
    const bulge = Math.cos((t * Math.PI) / 2); // 1 en el centro, 0 en los extremos
    const w = 58 + 30 * bulge;
    const h = 104 + 62 * bulge;
    const bottomY = 236 - 62 * t * t; // curva de la sonrisa
    teeth.push({ x: x + w / 2, bottomY, w, h, rot: t * 7 });
    x += w + GAP;
  }
  return { teeth, width: x - GAP };
}

const ARCH = buildArch();
const PAD = 120;
const VIEW_W = ARCH.width + PAD * 2;
const VIEW_H = 300;

// Destello de 4 puntas (mismo lenguaje que el logo).
function sparklePath(s: number): string {
  const k = s * 0.26;
  return `M0 ${-s} L${k} ${-k} L${s} 0 L${k} ${k} L0 ${s} L${-k} ${k} L${-s} 0 L${-k} ${-k} Z`;
}

const SPARKLES = [
  { tooth: 3, dx: -0.22, dy: 0.3, s: 15, delay: "0s" },
  { tooth: 7, dx: 0.26, dy: 0.22, s: 19, delay: "1.1s" },
  { tooth: 8, dx: -0.3, dy: 0.42, s: 12, delay: "2.3s" },
  { tooth: 12, dx: 0.2, dy: 0.3, s: 16, delay: "0.6s" },
];

export function BackgroundFX() {
  const band = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = band.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const vw = window.innerWidth;
      const stripW = el.offsetWidth;
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const p = reduce ? 0.5 : Math.min(window.scrollY / max, 1);
      // p=0 → extremo izquierdo de la dentadura; p=1 → extremo derecho.
      const x = (vw - stripW) * p;
      el.style.transform = `translate3d(${x}px, 0, 0)`;
    };
    update();
    if (reduce) return;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
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
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* base con degradado suave para que no sea blanco plano */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--sun) 7%, var(--background)) 0%, var(--background) 36%, color-mix(in srgb, var(--primary) 6%, var(--background)) 100%)",
        }}
      />

      {/* la dentadura: banda ancha que se recorre al hacer scroll */}
      <div
        ref={band}
        className="absolute top-1/2 -translate-y-1/2 will-change-transform"
        style={{ width: "230vw", minWidth: 1600, maxWidth: 3200 }}
      >
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full h-auto" style={{ opacity: 0.55 }}>
          <defs>
            <linearGradient id="bgfx-tooth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.75" stopColor="#f2f7f8" />
              <stop offset="1" stopColor="#e3edf0" />
            </linearGradient>
            <filter id="bgfx-shadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="7" stdDeviation="9" floodColor="#10333f" floodOpacity="0.13" />
            </filter>
          </defs>
          {ARCH.teeth.map((t, i) => (
            <g key={i} transform={`translate(${t.x + PAD} ${t.bottomY}) rotate(${t.rot})`}>
              {/* pieza */}
              <rect
                x={-t.w / 2}
                y={-t.h}
                width={t.w}
                height={t.h}
                rx={t.w * 0.34}
                fill="url(#bgfx-tooth)"
                stroke="color-mix(in srgb, var(--primary) 14%, transparent)"
                strokeWidth="1.5"
                filter="url(#bgfx-shadow)"
              />
              {/* brillo especular */}
              <ellipse
                cx={-t.w * 0.18}
                cy={-t.h * 0.66}
                rx={t.w * 0.16}
                ry={t.h * 0.2}
                fill="#ffffff"
                opacity="0.95"
              />
            </g>
          ))}
          {SPARKLES.map((sp, i) => {
            const t = ARCH.teeth[sp.tooth];
            const cx = t.x + PAD + t.w * sp.dx;
            const cy = t.bottomY - t.h * sp.dy - t.h * 0.35;
            return (
              <g key={`s-${i}`} transform={`translate(${cx} ${cy})`}>
                <path
                  d={sparklePath(sp.s)}
                  fill="var(--sun)"
                  className="twinkle"
                  style={{ animationDelay: sp.delay, transformBox: "fill-box", transformOrigin: "center" }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* grano sutil */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
        style={{ backgroundImage: GRAIN, backgroundSize: "150px 150px" }}
      />
    </div>
  );
}
