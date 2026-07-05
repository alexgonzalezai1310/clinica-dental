import type { Service } from "@/types";

// Precios ocultos a propósito: la clínica entrega presupuesto cerrado tras la
// primera revisión. Si en el futuro quieres mostrar importes, añade el campo
// `price` a cada servicio.
export const services: Service[] = [
  {
    id: "limpieza",
    title: "Limpieza dental",
    description: "Higiene profesional con ultrasonidos y pulido para una sonrisa radiante.",
    icon: "Sparkles",
  },
  {
    id: "ortodoncia",
    title: "Ortodoncia",
    description: "Ortodoncia y alineadores transparentes para corregir tu sonrisa con discreción.",
    icon: "Smile",
  },
  {
    id: "implantes",
    title: "Implantes dentales",
    description: "Recupera piezas perdidas con implantes de titanio de última generación.",
    icon: "Anchor",
  },
  {
    id: "blanqueamiento",
    title: "Blanqueamiento",
    description: "Tratamiento en clínica para varios tonos más blancos en una sesión.",
    icon: "Sun",
  },
  {
    id: "odontopediatria",
    title: "Odontopediatría",
    description: "Cuidado dental especializado para los más pequeños en un entorno amable.",
    icon: "Baby",
  },
  {
    id: "estetica",
    title: "Estética dental",
    description: "Carillas de porcelana y composite para un resultado natural y armónico.",
    icon: "Gem",
  },
];
