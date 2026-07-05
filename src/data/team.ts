import type { TeamMember } from "@/types";
import doctor1 from "@/assets/doctor-1.jpg";
import doctor2 from "@/assets/doctor-2.jpg";

// Datos reales de la clínica (Villarrubia, Córdoba). Las fotos son de archivo:
// sustitúyelas por las reales del equipo cuando las tengas.
export const team: TeamMember[] = [
  {
    name: "Dra. Silvia Lucía Moya Gaona",
    specialty: "Odontología general y estética dental",
    license: "Colegiada nº 14/00/1880 · Univ. de Sevilla",
    photo: doctor1,
  },
  {
    name: "Dr. Rafael Aranda",
    specialty: "Ortodoncia e implantología",
    license: "Colegio Oficial de Dentistas de Córdoba",
    photo: doctor2,
  },
];
