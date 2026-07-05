import { faqs } from "@/data/faqs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQs() {
  return (
    <section id="faqs" className="py-20 md:py-28">
      <div className="container-page max-w-3xl">
        <p className="eyebrow">Preguntas frecuentes</p>
        <h2 className="mt-4 text-3xl md:text-[2.75rem] leading-tight font-serif">Resolvemos tus dudas</h2>
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`i-${i}`} className="border-border">
              <AccordionTrigger className="text-left text-base font-medium hover:no-underline">{f.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-[0.95rem] leading-relaxed">{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
