# Clínica Dental Luminova — demo

Web de demostración para clínicas dentales: información de la clínica (localización, tarifas, equipo), reserva de cita con comprobación de disponibilidad en tiempo real y chatbot entrenado con las preguntas frecuentes.

Frontend generado con [Lovable](https://lovable.dev) sobre TanStack Start; el backend corre en el propio servidor de la app (server functions), sin servicios externos.

## Ejecutar en local

```sh
bun install
bun run dev
```

## Funcionalidades

### Reserva con propuesta de alternativas

El formulario envía la petición a `src/functions/booking.ts`, que comprueba la agenda (`src/server/schedule.ts`):

- Si el hueco está libre → confirma la cita.
- Si está ocupado → devuelve las 3 alternativas libres más cercanas (mismo día por distancia horaria, después los días siguientes) y el formulario las muestra como botones de un clic. Al aceptar una alternativa se revalida en el servidor por si alguien la ocupó entre medias.

La agenda de la demo vive en memoria y cada día se siembra con ocupación determinista (~1 de cada 3 franjas), para que siempre haya conflictos que enseñar. Horario: L-V 9:00–14:00 y 15:00–20:00, sábados solo mañana. La duración de la cita depende del tratamiento (30–60 min).

### Chatbot

`src/server/chatbot.ts` llama a la API de Claude con un system prompt construido a partir de los datos reales de la web (FAQs, tarifas, equipo, horarios) y dos herramientas conectadas a la misma agenda: `consultar_disponibilidad` y `reservar_cita`. Es decir, se puede preguntar *"¿tenéis hueco mañana por la tarde?"* y reservar desde el propio chat.

Requiere la variable de entorno:

```sh
export ANTHROPIC_API_KEY=sk-ant-...
```

Sin la clave configurada, el chat sigue funcionando en modo degradado: responde las FAQs por coincidencia de palabras clave y remite al teléfono para el resto.
