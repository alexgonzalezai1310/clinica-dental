import { Button } from "@/components/ui/button";
import { TeethCloseup } from "@/components/Teeth";

// Cierre a pantalla completa: el "primer plano" de dientes perfectos al que
// llega la cámara al final del scroll, con el mensaje de cierre y la llamada a
// la acción. Texto oscuro sobre el esmalte brillante para que los dientes se
// vean luminosos.
export function Outro({ onBook }: { onBook: () => void }) {
  return (
    <section className="relative min-h-[86vh] flex items-center justify-center overflow-hidden border-t border-border">
      <TeethCloseup className="absolute inset-0 w-full h-full" />
      {/* velo muy suave: mantiene el esmalte luminoso y da algo de contraste */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 42%, color-mix(in srgb, var(--background) 55%, transparent), color-mix(in srgb, var(--background) 20%, transparent) 70%)",
        }}
      />
      <div className="relative text-center px-6 max-w-2xl">
        <p className="eyebrow justify-center">Tu nueva sonrisa</p>
        <h2 className="mt-5 font-serif text-4xl sm:text-6xl leading-[1.05] text-[color:var(--foreground)] drop-shadow-[0_1px_10px_rgba(255,255,255,0.65)]">
          La sonrisa que mereces,
          <br />
          más cerca de lo que crees
        </h2>
        <p className="mt-6 text-lg max-w-lg mx-auto text-[color:var(--foreground)]/80 drop-shadow-[0_1px_8px_rgba(255,255,255,0.6)]">
          Pide tu primera visita gratuita y diseñamos juntos tu plan de tratamiento, sin compromiso.
        </p>
        <div className="mt-9 flex flex-wrap gap-3 justify-center">
          <Button onClick={onBook} size="lg" className="rounded-full px-8 h-12 text-base shadow-lg">
            Reservar cita
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 h-12 text-base bg-card/80 backdrop-blur-sm"
          >
            <a href="tel:+34957327291">Llamar: 957 327 291</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
