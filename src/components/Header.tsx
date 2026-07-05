import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";

const links = [
  { href: "#inicio", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#equipo", label: "Equipo" },
  { href: "#contacto", label: "Contacto" },
];

export function Header({ onBook }: { onBook: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-40 backdrop-blur-md bg-background/85 border-b border-border/70">
      <div className="container-page flex items-center justify-between h-16">
        <a href="#inicio" aria-label="Clínica Dental S. Moya & R. Aranda">
          <Logo />
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative text-sm text-muted-foreground hover:text-foreground transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-sun after:transition-all hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button onClick={onBook} className="hidden sm:inline-flex rounded-full px-6 h-10">Reservar cita</Button>
          <button
            className="md:hidden p-2 -mr-2"
            aria-label="Abrir menú"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-page py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-foreground"
              >
                {l.label}
              </a>
            ))}
            <Button onClick={() => { setOpen(false); onBook(); }} className="rounded-full mt-2">Reservar cita</Button>
          </div>
        </div>
      )}
    </header>
  );
}
