import { Facebook, Instagram, Twitter } from "lucide-react";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container-page grid md:grid-cols-3 gap-8">
        <div>
          <Logo markClassName="w-9 h-9" variant="stacked" />
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Salud bucodental de excelencia con un trato cercano en Villarrubia, Córdoba.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-medium">Enlaces</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li><a href="#servicios" className="hover:text-foreground">Servicios</a></li>
            <li><a href="#equipo" className="hover:text-foreground">Equipo</a></li>
            <li><a href="#contacto" className="hover:text-foreground">Contacto</a></li>
            <li><a href="#" className="hover:text-foreground">Aviso legal</a></li>
            <li><a href="#" className="hover:text-foreground">Política de privacidad</a></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-medium">Síguenos</p>
          <div className="mt-3 flex gap-3">
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-border grid place-items-center hover:bg-secondary"><Instagram className="w-4 h-4" /></a>
            <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-border grid place-items-center hover:bg-secondary"><Facebook className="w-4 h-4" /></a>
            <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full border border-border grid place-items-center hover:bg-secondary"><Twitter className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
      <div className="container-page mt-10 pt-6 border-t border-border text-xs text-muted-foreground flex flex-wrap justify-between gap-2">
        <p>© {new Date().getFullYear()} Clínica Dental Silvia Moya Gaona. Todos los derechos reservados.</p>
        <p>Hecho con cuidado en Villarrubia, Córdoba.</p>
      </div>
    </footer>
  );
}
