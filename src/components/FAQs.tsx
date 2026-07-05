import { faqs } from "@/data/faqs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQs() {
  return (
    <section id="faqs" className="py-20 md:py-28">
      <div className="container-page max-w-3xl">
        <p className="text-sm font-medium text-primary uppercase tracking-wider">Preguntas frecuentes</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-semibold">Resolvemos tus dudas</h2>
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`i-${i}`}>
              <AccordionTrigger className="text-left text-base">{f.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
