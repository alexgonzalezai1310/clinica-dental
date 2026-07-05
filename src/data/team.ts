import type { TeamMember } from "@/types";
import doctor1 from "@/assets/doctor-1.jpg";
import doctor2 from "@/assets/doctor-2.jpg";
import doctor3 from "@/assets/doctor-3.jpg";

export const team: TeamMember[] = [
  {
    name: "Dra. Elena Vargas",
    specialty: "Directora médica · Estética dental",
    license: "Colegiada nº 28-04521",
    photo: doctor1,
  },
  {
    name: "Dr. Martín Ibáñez",
    specialty: "Implantología y cirugía oral",
    license: "Colegiado nº 28-06183",
    photo: doctor2,
  },
  {
    name: "Dra. Clara Molina",
    specialty: "Ortodoncia y odontopediatría",
    license: "Colegiada nº 28-07940",
    photo: doctor3,
  },
];
