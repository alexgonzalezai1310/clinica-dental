export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: string;
}

export interface TeamMember {
  name: string;
  specialty: string;
  license: string;
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
  preferredDate: string;
  timeSlot: "morning" | "afternoon";
  comments?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}
