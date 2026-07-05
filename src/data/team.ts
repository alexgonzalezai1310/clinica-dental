import type { TeamMember } from "@/types";

// Equipo real de la clínica. No hay fotos disponibles: la ficha muestra un
// avatar con las iniciales (ver src/components/Team.tsx). Cuando tengas fotos,
// añade el campo `photo` a cada miembro.
export const team: TeamMember[] = [
  {
    name: "Dra. Silvia Lucía Moya Gaona",
    specialty: "Odontología general",
    license: "Colegiada nº 14/00/1880 · Univ. de Sevilla",
  },
  {
    name: "Dr. Rafael Aranda",
    specialty: "Odontología general",
    license: "Colegio Oficial de Dentistas de Córdoba",
  },
];
