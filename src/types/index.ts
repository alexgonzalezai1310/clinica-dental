export interface Service {
  id: string;
  title: string;
  description: string;
  price?: string;
  icon: string;
}

export interface TeamMember {
  name: string;
  specialty: string;
  license?: string;
  photo: string;
}

export interface Testimonial {
  name: string;
  treatment: string;
  rating: number;
  quote: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface BookingRequest {
  fullName: string;
  phone: string;
  email: string;
  treatment: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  comments?: string;
}

export interface SlotSuggestion {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

export type BookingResult =
  | { status: "confirmed"; date: string; time: string }
  | { status: "conflict"; suggestions: SlotSuggestion[] };

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}
