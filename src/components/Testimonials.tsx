import { testimonials } from "@/data/testimonials";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star } from "lucide-react";

export function Testimonials() {
  return (
    <section id="testimonios" className="py-20 md:py-28 bg-secondary/40">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary uppercase tracking-wider">Testimonios</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold">Lo que dicen nuestros pacientes</h2>
        </div>
        <Carousel opts={{ align: "start", loop: true }} className="mt-12">
          <CarouselContent>
            {testimonials.map((t) => (
              <CarouselItem key={t.name} className="md:basis-1/2 lg:basis-1/3">
                <div className="h-full bg-card rounded-2xl p-6 border border-border">
                  <div className="flex gap-0.5 text-primary">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-foreground/90 leading-relaxed">"{t.quote}"</p>
                  <div className="mt-6">
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.treatment}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
