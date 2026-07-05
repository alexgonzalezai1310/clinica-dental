import { useId } from "react";

// Marca de la clínica recreada como SVG vectorial (diente + destello). Nítida
// a cualquier tamaño y sin depender de un archivo de imagen. El color se toma
// del gradiente azul de la marca.
export function LogoMark({ className }: { className?: string }) {
  const gid = useId();
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Clínica Dental Silvia Moya Gaona">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#93C2EE" />
          <stop offset="1" stopColor="#5A93D4" />
        </linearGradient>
      </defs>
      <path
        d="M20 13 C15 12 12 16 12 22 C12 31 14 41 17 49 C18 52 21 53 22 50 C25 44 29 40 32 40 C35 40 39 45 42 50 C43 53 46 52 47 49 C50 41 52 31 52 22 C52 16 49 12 44 13 C40 14 37 16 32 16 C27 16 24 14 20 13 Z"
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M48 4 L50.2 11.8 L56 14 L50.2 16.2 L48 24 L45.8 16.2 L40 14 L45.8 11.8 Z"
        fill={`url(#${gid})`}
      />
    </svg>
  );
}

// Logo completo: marca + nombre. `variant="stacked"` añade el subtítulo
// "CLÍNICA DENTAL" bajo el nombre (para el pie de página).
export function Logo({
  className,
  markClassName = "w-8 h-8",
  variant = "inline",
}: {
  className?: string;
  markClassName?: string;
  variant?: "inline" | "stacked";
}) {
  return (
    <span className={`flex items-center gap-2 ${className ?? ""}`}>
      <LogoMark className={markClassName} />
      <span className="flex flex-col leading-none">
        <span className="font-sans font-light tracking-tight text-base sm:text-lg text-[#4C86C9]">
          Silvia Moya Gaona
        </span>
        <span
          className={`mt-0.5 text-[10px] tracking-[0.3em] text-[#4C86C9]/70 ${
            variant === "stacked" ? "" : "hidden sm:block"
          }`}
        >
          CLÍNICA DENTAL
        </span>
      </span>
    </span>
  );
}
