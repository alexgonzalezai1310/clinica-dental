import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "limpieza",
    title: "Limpieza dental",
    description: "Higiene profesional con ultrasonidos y pulido para una sonrisa radiante.",
    price: "Desde 45€",
    icon: "Sparkles",
  },
  {
    id: "ortodoncia",
    title: "Ortodoncia invisible",
    description: "Alineadores transparentes personalizados. Corrige tu sonrisa con discreción.",
    price: "Desde 2.900€",
    icon: "Smile",
  },
  {
    id: "implantes",
    title: "Implantes dentales",
    description: "Recupera piezas perdidas con implantes de titanio de última generación.",
    price: "Desde 950€",
    icon: "Anchor",
  },
  {
    id: "blanqueamiento",
    title: "Blanqueamiento",
    description: "Tratamiento LED en clínica para varios tonos más blancos en una sesión.",
    price: "Desde 220€",
    icon: "Sun",
  },
  {
    id: "odontopediatria",
    title: "Odontopediatría",
    description: "Cuidado dental especializado para los más pequeños en un entorno amable.",
    price: "Desde 35€",
    icon: "Baby",
  },
  {
    id: "estetica",
    title: "Estética dental",
    description: "Carillas de porcelana y composite para un resultado natural y armónico.",
    price: "Desde 400€",
    icon: "Gem",
  },
];
