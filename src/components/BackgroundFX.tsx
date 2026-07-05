import { useEffect, useRef } from "react";

// Fondo vivo: una boca estilizada —encías coral y dos arcadas de dientes
// marfil con brillo— dibujada en SVG detrás del contenido. Al hacer scroll,
// el encuadre recorre la dentadura de un lado al otro (parallax horizontal),
// con destellos que parpadean como el del logo. Debajo, un degradado cálido y
// un grano sutil evitan el blanco plano. Respeta prefers-reduced-motion.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const TOOTH_COUNT = 16;
const GAP = 14;
const PAD = 150;
const VIEW_H = 520;

interface Tooth {
  x: number; // centro X (sin PAD)
  w: number;
  h: number;
  topY: number;
  bottomY: number;
}

interface Arch {
  teeth: Tooth[];
  width: number;
}

// Arcada superior: incisivos grandes al centro, bordes inferiores siguiendo
// la curva de la sonrisa. La inferior se genera espejada y algo menor.
function buildUpper(): Arch {
  const teeth: Tooth[] = [];
  let x = 0;
  for (let i = 0; i < TOOTH_COUNT; i++) {
    const t = ((i + 0.5) / TOOTH_COUNT) * 2 - 1; // -1 … 1
    const bulge = Math.cos((t * Math.PI) / 2);
    const w = 58 + 30 * bulge;
    const h = 118 + 52 * bulge;
    const bottomY = 252 - 58 * t * t;
    teeth.push({ x: x + w / 2, w, h, topY: bottomY - h, bottomY });
    x += w + GAP;
  }
  return { teeth, width: x - GAP };
}

function buildLower(upper: Arch): Arch {
  const teeth: Tooth[] = upper.teeth.map((u, i) => {
    const t = ((i + 0.5) / TOOTH_COUNT) * 2 - 1;
    const bulge = Math.cos((t * Math.PI) / 2);
    const w = u.w * 0.86;
    const h = 92 + 40 * bulge;
    const topY = u.bottomY + 44 + 22 * t * t; // apertura de la boca
    return { x: u.x, w, h, topY, bottomY: topY + h };
  });
  return { teeth, width: upper.width };
}

const UPPER = buildUpper();
const LOWER = buildLower(UPPER);
const VIEW_W = UPPER.width + PAD * 2;

// Encía festoneada: el margen sube en arco sobre cada corona y baja en las
// papilas entre dientes. `dir` = 1 para la arcada superior (encía arriba),
// -1 para la inferior (encía abajo).
function gumPath(arch: Arch, dir: 1 | -1): string {
  const teeth = arch.teeth;
  const margin = (t: Tooth) => (dir === 1 ? t.topY + t.h * 0.34 : t.bottomY - t.h * 0.34);
  const apex = (t: Tooth) => (dir === 1 ? t.topY + t.h * 0.06 : t.bottomY - t.h * 0.06);
  const edgeY = dir === 1 ? -60 : VIEW_H + 60;

  const first = teeth[0];
  const last = teeth[teeth.length - 1];
  const leftX = first.x - first.w / 2 - GAP / 2 + PAD;
  const rightX = last.x + last.w / 2 + GAP / 2 + PAD;

  let d = `M ${leftX - 90} ${edgeY} L ${leftX - 90} ${margin(first)} L ${leftX} ${margin(first)}`;
  for (const t of teeth) {
    const papR = t.x + t.w / 2 + GAP / 2 + PAD;
    d += ` Q ${t.x + PAD} ${apex(t)} ${papR} ${margin(t)}`;
  }
  d += ` L ${rightX + 90} ${margin(last)} L ${rightX + 90} ${edgeY} Z`;
  return d;
}

const UPPER_GUM = gumPath(UPPER, 1);
const LOWER_GUM = gumPath(LOWER, -1);

// Destello de 4 puntas (mismo lenguaje que el logo).
function sparklePath(s: number): string {
  const k = s * 0.26;
  return `M0 ${-s} L${k} ${-k} L${s} 0 L${k} ${k} L0 ${s} L${-k} ${k} L${-s} 0 L${-k} ${-k} Z`;
}

const SPARKLES = [
  { tooth: 3, dx: -0.2, dy: 0.52, s: 15, delay: "0s" },
  { tooth: 7, dx: 0.24, dy: 0.6, s: 19, delay: "1.1s" },
  { tooth: 8, dx: -0.28, dy: 0.46, s: 12, delay: "2.3s" },
  { tooth: 12, dx: 0.18, dy: 0.55, s: 16, delay: "0.6s" },
];

function ToothShape({ t, flip }: { t: Tooth; flip?: boolean }) {
  return (
    <g>
      <rect
        x={t.x - t.w / 2 + PAD}
        y={t.topY}
        width={t.w}
        height={t.h}
        rx={t.w * 0.34}
        fill="url(#bgfx-tooth)"
        stroke="color-mix(in srgb, var(--primary) 14%, transparent)"
        strokeWidth="1.5"
        filter="url(#bgfx-shadow)"
      />
      {/* brillo especular en la zona visible de la corona */}
      <ellipse
        cx={t.x + PAD - t.w * 0.18}
        cy={flip ? t.topY + t.h * 0.32 : t.bottomY - t.h * 0.34}
        rx={t.w * 0.15}
        ry={t.h * 0.16}
        fill="#ffffff"
        opacity="0.9"
      />
    </g>
  );
}

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
      // p=0 → extremo izquierdo de la boca; p=1 → extremo derecho.
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
            "linear-gradient(180deg, color-mix(in srgb, var(--sun) 9%, var(--background)) 0%, var(--background) 38%, color-mix(in srgb, var(--primary) 7%, var(--background)) 100%)",
        }}
      />

      {/* la boca: banda ancha que se recorre al hacer scroll */}
      <div
        ref={band}
        className="absolute top-1/2 -translate-y-1/2 will-change-transform"
        style={{ width: "205vw", minWidth: 1500, maxWidth: 3000 }}
      >
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full h-auto" style={{ opacity: 0.62 }}>
          <defs>
            <linearGradient id="bgfx-tooth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fffef9" />
              <stop offset="0.7" stopColor="#f7f1e4" />
              <stop offset="1" stopColor="#ece2cd" />
            </linearGradient>
            {/* la encía se funde con el fondo lejos de los dientes */}
            <linearGradient id="bgfx-gum-up" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f6b5a4" stopOpacity="0" />
              <stop offset="0.45" stopColor="#f3a08f" stopOpacity="0.55" />
              <stop offset="1" stopColor="#e88a74" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="bgfx-gum-down" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e88a74" stopOpacity="0.95" />
              <stop offset="0.55" stopColor="#f3a08f" stopOpacity="0.55" />
              <stop offset="1" stopColor="#f6b5a4" stopOpacity="0" />
            </linearGradient>
            <filter id="bgfx-shadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#10333f" floodOpacity="0.14" />
            </filter>
            <filter id="bgfx-gum-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="#8c3f2e" floodOpacity="0.18" />
            </filter>
          </defs>

          {/* sombra del interior de la boca, entre arcadas */}
          <ellipse
            cx={VIEW_W / 2}
            cy={(UPPER.teeth[0].bottomY + LOWER.teeth[0].topY) / 2 + 8}
            rx={VIEW_W * 0.46}
            ry={60}
            fill="var(--primary)"
            opacity="0.07"
          />

          {/* arcada superior: dientes bajo la encía */}
          {UPPER.teeth.map((t, i) => (
            <ToothShape key={`u-${i}`} t={t} />
          ))}
          <path d={UPPER_GUM} fill="url(#bgfx-gum-up)" filter="url(#bgfx-gum-shadow)" opacity="0.9" />

          {/* arcada inferior */}
          {LOWER.teeth.map((t, i) => (
            <ToothShape key={`l-${i}`} t={t} flip />
          ))}
          <path d={LOWER_GUM} fill="url(#bgfx-gum-down)" filter="url(#bgfx-gum-shadow)" opacity="0.9" />

          {/* destellos */}
          {SPARKLES.map((sp, i) => {
            const t = UPPER.teeth[sp.tooth];
            const cx = t.x + PAD + t.w * sp.dx;
            const cy = t.topY + t.h * sp.dy;
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
