import { Facebook, Instagram } from "lucide-react";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="bg-[#0e2c38] text-[#dfeeec]">
      {/* cenefa de arcos (arquería de la Mezquita) */}
      <div className="arcade" aria-hidden />
      <div className="container-page pt-14 pb-10">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="[&_span]:!text-white [&_span_span:last-child]:!text-white/60">
              <Logo markClassName="w-9 h-9" variant="stacked" />
            </div>
            <p className="mt-4 text-sm text-white/70 max-w-xs leading-relaxed">
              Salud bucodental de excelencia con un trato cercano y familiar en Villarrubia, Córdoba.
            </p>
          </div>
          <div className="text-sm">
            <p className="font-medium text-white">Enlaces</p>
            <ul className="mt-4 space-y-2.5 text-white/70">
              <li><a href="#servicios" className="hover:text-white transition-colors">Servicios</a></li>
              <li><a href="#equipo" className="hover:text-white transition-colors">La clínica</a></li>
              <li><a href="#faqs" className="hover:text-white transition-colors">Preguntas frecuentes</a></li>
              <li><a href="#contacto" className="hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="font-medium text-white">Contacto</p>
            <ul className="mt-4 space-y-2.5 text-white/70">
              <li><a href="tel:+34957327291" className="hover:text-white transition-colors">957 327 291</a></li>
              <li><a href="mailto:info@moyayarandavillarrubia.com" className="hover:text-white transition-colors">info@moyayarandavillarrubia.com</a></li>
            </ul>
            <div className="mt-5 flex gap-3">
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-white/20 grid place-items-center hover:bg-white/10 transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-white/20 grid place-items-center hover:bg-white/10 transition-colors"><Facebook className="w-4 h-4" /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-white/12 text-xs text-white/55 flex flex-wrap justify-between gap-2">
          <p>© {new Date().getFullYear()} Clínica Dental S. Moya &amp; R. Aranda. Todos los derechos reservados.</p>
          <p>Hecho con cuidado en Villarrubia, Córdoba.</p>
        </div>
      </div>
    </footer>
  );
}
