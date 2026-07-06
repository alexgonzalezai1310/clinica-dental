import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { BackgroundFX } from "@/components/BackgroundFX";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { Team } from "@/components/Team";
import { FAQs } from "@/components/FAQs";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { BookingForm } from "@/components/BookingForm";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const openBooking = () => setBookingOpen(true);

  return (
    <div className="min-h-screen text-foreground">
      <BackgroundFX />
      <Header onBook={openBooking} />
      <main>
        <Hero onBook={openBooking} />
        <Services />
        <Team />
        <FAQs />
        <Contact />
      </main>
      <Footer />
      <BookingForm open={bookingOpen} onOpenChange={setBookingOpen} />
      <ChatWidget />
      <Toaster position="top-center" richColors />
    </div>
  );
}
