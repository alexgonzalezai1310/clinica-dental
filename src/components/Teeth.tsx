// Macro de dientes perfectos (vector): encía coral festoneada y una arcada
// superior de esmalte pulido con brillo especular, sombras de contacto y
// profundidad de campo. Con `sparkles`, añade símbolos de brillo dorados que
// parpadean (mismo lenguaje que el destello del logo).
// (Para fotorrealismo total, se puede sustituir por una foto macro real.)

function sparklePath(s: number): string {
  const k = s * 0.26;
  return `M0 ${-s} L${k} ${-k} L${s} 0 L${k} ${k} L0 ${s} L${-k} ${k} L${-s} 0 L${-k} ${-k} Z`;
}

const SPARKLES = [
  { x: 0.2, y: 0.34, s: 26, delay: "0s" },
  { x: 0.44, y: 0.52, s: 18, delay: "1.2s" },
  { x: 0.58, y: 0.3, s: 32, delay: "0.5s" },
  { x: 0.78, y: 0.46, s: 20, delay: "2.1s" },
  { x: 0.9, y: 0.3, s: 14, delay: "1.7s" },
];

export function TeethCloseup({ className, sparkles }: { className?: string; sparkles?: boolean }) {
  const W = 1200;
  const H = 720;
  const N = 10;
  const teeth: { x: number; w: number; h: number; top: number }[] = [];
  let x = 40;
  for (let i = 0; i < N; i++) {
    const t = ((i + 0.5) / N) * 2 - 1;
    const bulge = Math.cos((t * Math.PI) / 2);
    const w = 96 + 46 * bulge;
    const h = 400 + 150 * bulge;
    const top = 120 + 66 * t * t;
    teeth.push({ x: x + w / 2, w, h, top });
    x += w + 10;
  }
  const total = x - 10;
  const scale = (W - 80) / total;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Dientes perfectos"
    >
      <defs>
        <linearGradient id="tc-enamel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4ecda" />
          <stop offset="0.18" stopColor="#fffdf7" />
          <stop offset="0.6" stopColor="#ffffff" />
          <stop offset="1" stopColor="#eef4f5" />
        </linearGradient>
        <linearGradient id="tc-gum" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#df7c64" />
          <stop offset="1" stopColor="#f2ab98" />
        </linearGradient>
        <radialGradient id="tc-vig" cx="50%" cy="44%" r="70%">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="0.78" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#10333f" stopOpacity="0.34" />
        </radialGradient>
        <filter id="tc-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>

      <rect x="0" y="0" width={W} height={H} fill="#f4ede2" />
      <rect x="0" y={H - 150} width={W} height="150" fill="#cf8271" opacity="0.55" filter="url(#tc-soft)" />

      {/* encía superior festoneada */}
      <g transform={`translate(40 0) scale(${scale} 1)`}>
        <path
          d={(() => {
            let d = `M ${-60 / scale} -60 L ${total + 60 / scale} -60 L ${total + 60 / scale} ${teeth[teeth.length - 1].top + 30}`;
            for (let i = teeth.length - 1; i >= 0; i--) {
              const t = teeth[i];
              d += ` L ${t.x + t.w / 2 + 5} ${t.top + 30} Q ${t.x} ${t.top - 36} ${t.x - t.w / 2 - 5} ${t.top + 30}`;
            }
            d += ` L ${-60 / scale} ${teeth[0].top + 30} Z`;
            return d;
          })()}
          fill="url(#tc-gum)"
        />
        <path
          d={`M 0 62 Q ${total / 2} 18 ${total} 62`}
          stroke="#ffffff"
          strokeOpacity="0.2"
          strokeWidth="16"
          fill="none"
          filter="url(#tc-soft)"
        />
      </g>

      {/* dientes */}
      <g transform={`translate(40 0) scale(${scale} 1)`}>
        {teeth.map((t, i) => (
          <g key={i}>
            <rect
              x={t.x - t.w / 2 - 3}
              y={t.top}
              width={t.w + 6}
              height={t.h}
              rx={t.w * 0.3}
              fill="#b5866c"
              opacity="0.5"
              filter="url(#tc-soft)"
            />
            <rect x={t.x - t.w / 2} y={t.top} width={t.w} height={t.h} rx={t.w * 0.3} fill="url(#tc-enamel)" />
            <ellipse
              cx={t.x - t.w * 0.16}
              cy={t.top + t.h * 0.42}
              rx={t.w * 0.2}
              ry={t.h * 0.3}
              fill="#ffffff"
              opacity="0.85"
              filter="url(#tc-soft)"
            />
            <circle cx={t.x + t.w * 0.16} cy={t.top + t.h * 0.2} r={t.w * 0.06} fill="#ffffff" opacity="0.9" />
          </g>
        ))}
      </g>

      <rect x="0" y="0" width={W} height={H} fill="url(#tc-vig)" />

      {/* símbolos de brillo */}
      {sparkles &&
        SPARKLES.map((sp, i) => (
          <g key={i} transform={`translate(${sp.x * W} ${sp.y * H})`}>
            <path
              d={sparklePath(sp.s)}
              fill="var(--sun)"
              className="twinkle"
              style={{ animationDelay: sp.delay, transformBox: "fill-box", transformOrigin: "center" }}
            />
            <path d={sparklePath(sp.s * 0.5)} fill="#ffffff" opacity="0.9" />
          </g>
        ))}
    </svg>
  );
}
