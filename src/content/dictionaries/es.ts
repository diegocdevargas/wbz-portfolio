// Spanish (neutral Latin American).
import type { Dictionary } from "./pt";

export const es: Dictionary = {
  meta: {
    title: "Webcraftz — de la chispa a la órbita.",
    description:
      "Para fundadores y empresas que necesitan más que un sitio web. Aplicaciones web, asistentes de IA y automatizaciones, entregados con un proceso claro, desde la primera idea hasta el lanzamiento y más allá.",
    skipLink: "Saltar al contenido",
  },

  header: {
    nav: { about: "Sobre mí", cases: "Proyectos", services: "Servicios", journey: "Proceso", faq: "FAQ" },
    contact: "Contacto",
    homeLabel: "página de inicio",
    mainNav: "Principal",
    mobileNav: "Menú móvil",
    menu: "Menú",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    language: "Idioma",
  },

  startProjectSubject: "Nuevo proyecto",

  home: {
    hero: {
      title: [
        { text: "Ideas En", accent: false },
        { text: "Productos", accent: true },
        { text: "Reales.", accent: true },
      ],
      lead: "Sitios web, aplicaciones web, asistentes con IA y automatizaciones, diseñados y desarrollados de punta a punta por un desarrollador con más de 13 años de experiencia.",
      techLabel: "Tecnologías",
    },
    values: {
      eyebrow: "Por Qué Trabajar Conmigo",
      title: { text: "Hecho para Funcionar.", accent: "Hecho para Durar." },
      items: [
        { title: "Lanza con Confianza", body: "Entrega un producto probado, seguro y listo para usuarios reales." },
        { title: "Un Único Contacto", body: "Diseño, código, IA e infraestructura con la misma persona." },
        { title: "Gana Velocidad", body: "Las automatizaciones y la IA eliminan el trabajo manual que frena a tu equipo." },
        { title: "Experiencia Comprobada", body: "Más de 13 años creando para startups y grandes marcas." },
      ],
    },
    services: {
      eyebrow: "Lo Que Creo",
      title: { text: "Todo lo que tu Producto Necesita.", accent: "Hecho de la Forma Correcta." },
      items: [
        { title: "Aplicaciones Web", body: "Apps full-stack con React, Next.js y APIs sólidas." },
        { title: "Sitios & E-commerce", body: "Sitios y tiendas hechos para rendir y vender." },
        { title: "UI/UX", body: "Interfaces que las personas entienden a la primera." },
        { title: "Asistentes con IA & RAG", body: "Chatbots que responden con base en tus documentos y datos." },
        { title: "Automatización de Procesos", body: "Flujos en n8n que conectan tus herramientas y reducen el trabajo manual." },
        { title: "Deploy & Soporte", body: "Hosting, seguridad y cuidado mucho después del lanzamiento." },
      ],
    },
    journey: {
      srTitle: "Proceso del proyecto",
      steps: [
        { title: "Chispa", body: "Convertimos tu idea en un plan, un alcance y un presupuesto claros." },
        { title: "Forma", body: "Diseñamos la experiencia antes de la primera línea de código." },
        { title: "Construcción", body: "Desarrollamos el producto, las integraciones y las automatizaciones." },
        { title: "Test Drive", body: "Refinamos cada detalle con tu feedback real." },
        { title: "Al Aire", body: "Lanzamiento seguro, configurado y listo para crecer." },
      ],
    },
    clients: { eyebrow: "Empresas que confiaron en mi trabajo", label: "Clientes" },
    selectedWork: {
      eyebrow: "Trabajos Seleccionados",
      title: { text: "Proyectos que", accent: "Mueven" },
      cta: "Todos los Proyectos",
    },
    testimonials: {
      title: { text: "Aprobado Por", accent: "Clientes." },
      rating: "Calificación de 4,89/5 en más de 200 proyectos en Workana.",
      label: "Testimonios",
    },
    faq: {
      eyebrow: "Preguntas Frecuentes",
      title: { text: "Preguntas", accent: "& Respuestas." },
      items: [
        {
          q: "¿Qué tipo de proyectos atiendes?",
          a: "Sitios web, e-commerce, aplicaciones web full-stack, asistentes con IA y RAG, y automatizaciones con n8n. Si funciona en la web, probablemente se puede construir.",
        },
        {
          q: "¿Cómo empieza un proyecto?",
          a: "Con una conversación rápida para entender tus objetivos. Después recibes un alcance, un plazo y un presupuesto claros antes de que empiece cualquier trabajo.",
        },
        {
          q: "¿Cuánto tarda un proyecto?",
          a: "Depende del alcance. Una landing page puede tomar días; una aplicación a medida, semanas. Recibes un plazo realista desde el inicio, con actualizaciones frecuentes.",
        },
        {
          q: "¿Trabajas con mi sitio o sistema actual?",
          a: "Sí. Puedo mejorar, migrar o integrar lo que ya tienes, sea WordPress, WooCommerce, una app propia o tus herramientas actuales.",
        },
        {
          q: "¿Qué pasa después del lanzamiento?",
          a: "Me encargo del deploy, el dominio y el SSL, y ofrezco soporte continuo para actualizaciones, correcciones y nuevas funcionalidades cuando las necesites.",
        },
        {
          q: "¿La IA y la automatización realmente pueden ayudar a mi negocio?",
          a: "Si tu equipo repite las mismas tareas, responde las mismas preguntas o mueve datos entre herramientas, sí. Empezamos identificando dónde ahorra tiempo de verdad.",
        },
      ],
    },
    cta: {
      eyebrow: "Próximo paso",
      title: ["¿Tienes una idea?", "Pongámosla", "en órbita."],
      button: "Iniciar Proyecto",
      mailLead: "o escribe a",
    },
    loader: { caption: "Preparando la órbita" },
  },

  footer: {
    eyebrow: "¿Listo para empezar?",
    lead: ["Construyamos, lancemos", "y sigamos en movimiento."],
    sitemapTitle: "Mapa del sitio",
    sitemap: { home: "Inicio", work: "Proyectos", contact: "Contacto" },
    socialTitle: "Redes",
    studioTitle: "Estudio",
    location: ["Rio Grande do Sul,", "Brasil"],
    clockPlace: "Brasil",
    copyright: "© Webcraftz. Todos los derechos reservados.",
    reach: "Brasil — Atendiendo clientes en todo el mundo",
  },

  work: {
    metaTitle: "Proyectos",
    kicker: "Casos de estudio",
    title: "En Órbita",
    intro:
      "Sitios, apps e identidades hechos para dejar huella, no solo para lanzarse. Cada proyecto aquí empezó como una chispa que necesitaba dirección.",
    categories: {
      all: "Todos",
      websites: "Sitios web",
      ecommerce: "E-commerce",
      "web-apps": "Web Apps",
      "ai-automacao": "IA y automatización",
    },
    filterLabel: "Filtrar proyectos por categoría",
    liveCount: "{count} proyectos en {label}",
    empty: "Todavía no hay proyectos en esta categoría.",
    showAll: "Ver todos los proyectos",
  },

  caseStudy: {
    back: "Todos los proyectos",
    client: "Cliente",
    year: "Año",
    discipline: "Disciplina",
    services: "Servicios",
    visit: "Visitar el sitio",
    storyLabel: "(Caso de estudio)",
    challenge: "El desafío",
    approach: "Nuestro enfoque",
    result: "El resultado",
    metricsLabel: "Resultados",
    galleryLabel: "Galería",
    nextNav: "Siguiente proyecto",
    nextLabel: "(Siguiente proyecto)",
  },
};
