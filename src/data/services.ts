import type { Service } from "@/types";

// Servicios reales de la Clínica Dental S. Moya & R. Aranda.
// Precios ocultos a propósito: presupuesto cerrado tras la primera revisión.
// El `id` de cada servicio se usa en src/server/schedule.ts para estimar la
// duración de la cita.
export const services: Service[] = [
  {
    id: "cirugia-implantes",
    title: "Cirugía e Implantes",
    description: "Implantes de titanio y cirugía oral para reponer piezas perdidas con seguridad.",
    icon: "Syringe",
  },
  {
    id: "ortodoncia",
    title: "Ortodoncia · Invisalign",
    description: "Ortodoncia fija e Invisalign: alineadores transparentes para corregir la mordida con discreción.",
    icon: "Smile",
  },
  {
    id: "protesis",
    title: "Prótesis y Rehabilitación",
    description: "Prótesis fijas y removibles y rehabilitación completa para recuperar función y estética.",
    icon: "Layers",
  },
  {
    id: "general",
    title: "Odontología General",
    description: "Revisiones, limpiezas, empastes y prevención para mantener tu boca sana.",
    icon: "Stethoscope",
  },
  {
    id: "periodoncia",
    title: "Periodoncia",
    description: "Diagnóstico y tratamiento de encías: gingivitis, periodontitis y mantenimiento periodontal.",
    icon: "ShieldCheck",
  },
  {
    id: "endodoncia",
    title: "Endodoncia",
    description: "Tratamiento de conductos para salvar dientes dañados eliminando el dolor.",
    icon: "Microscope",
  },
  {
    id: "radiologia",
    title: "Radiología digital",
    description: "Radiografía digital de baja radiación para un diagnóstico rápido y preciso.",
    icon: "Scan",
  },
];
