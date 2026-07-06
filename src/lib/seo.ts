import { faqs } from "@/data/faqs";
import { services } from "@/data/services";

// ─── SEO central ────────────────────────────────────────────────────────────
// Única fuente de verdad de los datos NAP (Name, Address, Phone) del negocio.
// La coherencia exacta de estos datos entre la web, el perfil de Google
// Business y los directorios es el factor nº 1 del SEO local (Google Maps).
//
// Cuando la clínica tenga dominio propio, cambia SITE_URL aquí y actualiza
// public/robots.txt y public/sitemap.xml.

export const SITE_URL = "https://clinica-dental.alex-gonzalez-ai-1310.workers.dev";

export const BUSINESS = {
  name: "Clínica Dental S. Moya & R. Aranda",
  legalName: "Clínica Dental Silvia Moya Gaona y Rafael Aranda",
  phone: "+34957327291",
  phoneDisplay: "957 327 291",
  email: "info@moyayarandavillarrubia.com",
  street: "Av. de la Pedanía, 202",
  locality: "Villarrubia",
  region: "Córdoba",
  postalCode: "14710",
  country: "ES",
  // Coordenadas aproximadas de Av. de la Pedanía (Villarrubia). Afínalas con
  // las exactas del perfil de Google Business cuando esté disponible.
  lat: 37.928,
  lng: -4.899,
} as const;

const mapsQuery = encodeURIComponent(
  `${BUSINESS.street}, ${BUSINESS.postalCode} ${BUSINESS.locality}, ${BUSINESS.region}`,
);
export const MAPS_URL = `https://www.google.com/maps?q=${mapsQuery}`;

export const SEO_TITLE = "Clínica Dental en Villarrubia (Córdoba) · S. Moya & R. Aranda";
export const SEO_DESCRIPTION =
  "Tu clínica dental en Villarrubia, Córdoba: implantes, ortodoncia e Invisalign, endodoncia, periodoncia y odontología general. Primera visita gratuita. ☎ 957 327 291.";

// Ficha de negocio local (tipo Dentist → LocalBusiness) para el pack local y
// el knowledge panel de Google.
export function dentistJsonLd(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${SITE_URL}/#clinica`,
    name: BUSINESS.name,
    alternateName: ["Clínica Dental Moya y Aranda Villarrubia", BUSINESS.legalName],
    description: SEO_DESCRIPTION,
    url: SITE_URL,
    telephone: BUSINESS.phone,
    email: BUSINESS.email,
    image: `${SITE_URL}/og-image.jpg`,
    priceRange: "€€",
    currenciesAccepted: "EUR",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.street,
      addressLocality: BUSINESS.locality,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: BUSINESS.lat, longitude: BUSINESS.lng },
    hasMap: MAPS_URL,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "13:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "16:30",
        closes: "20:00",
      },
    ],
    areaServed: [
      "Villarrubia",
      "Córdoba",
      "El Higuerón",
      "Encinarejo de Córdoba",
      "Almodóvar del Río",
      "Majaneque",
    ].map((name) => ({ "@type": "Place", name })),
    employee: [
      { "@type": "Person", name: "Silvia Lucía Moya Gaona", jobTitle: "Odontóloga" },
      { "@type": "Person", name: "Rafael Aranda", jobTitle: "Odontólogo" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Tratamientos dentales",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "MedicalProcedure", name: s.title, description: s.description },
      })),
    },
    sameAs: ["https://www.moyayarandavillarrubia.com"],
  });
}

// FAQPage: las mismas preguntas visibles en la sección de FAQs.
export function faqJsonLd(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  });
}
