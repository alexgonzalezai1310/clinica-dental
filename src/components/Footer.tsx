import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container-page grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary grid place-items-center text-primary-foreground font-serif font-bold">L</span>
            <span className="font-serif text-lg font-semibold">Clínica Dental Luminova</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            Salud bucodental de excelencia con un trato cercano en el corazón de Madrid.
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
        <p>© {new Date().getFullYear()} Clínica Dental Luminova. Todos los derechos reservados.</p>
        <p>Hecho con cuidado en Madrid.</p>
      </div>
    </footer>
  );
}
