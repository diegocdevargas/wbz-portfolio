// Spanish copy for the case studies. Structural data (slugs, years, images, links) lives in projects.ts.
import type { ProjectCopy } from "./projects";

export const projectsEs: Record<string, ProjectCopy> = {
  "azeitonas-verdes": {
    subtitle: "Tema punk rock",
    discipline: "Branding",
    services: ["Identidad", "Branding", "Sitio web", "Design System"],
    coverAlt: "Concierto en vivo con el público con los brazos en alto frente a un escenario iluminado con luces verdes",
    challenge: "Azeitonas Verdes es un power trio del interior de Rio Grande do Sul que toca un punk rock crudo y directo, con una veta psicodélica. Sus canciones, videos y fechas de conciertos estaban dispersos en las redes sociales. La banda necesitaba un hogar propio que sonara como se ve: ruidoso, pegajoso y un poco descontrolado, pero que aun así facilitara encontrar el próximo concierto o darle play.",
    approach: "Construimos la marca en torno a una imagen: la aceituna como baba. Un logotipo que chorrea, con contornos morados y amarillos desfasados, recupera las fotocopias desalineadas del punk. Filtros SVG con efecto viscoso hacen que las aceitunas se derritan y se fundan, latiendo al ritmo de la música. El sistema es austero: un escenario casi negro, un único verde ácido como color de acento, morado y amarillo reservados para los toques psicodélicos, tipografía condensada de cartel y etiquetas `//` estilo terminal que contienen el caos. Cada sección funciona como una pista de un disco: acerca de, videos, discografía, conciertos, galería, la banda (\"los ingredientes de la conserva\") y contacto.",
    result: "La banda ahora tiene un hub único y propio para sus videos en vivo, sus lanzamientos y su agenda de conciertos, con una identidad lo bastante fuerte para carteles, merch y visuales de escenario.",
    metrics: [
      { value: "100", label: "Rendimiento en Lighthouse (escritorio)" },
      { value: "95", label: "Rendimiento en Lighthouse (móvil)" },
      { value: "100", label: "Accesibilidad, buenas prácticas y SEO" },
    ],
    galleryAlts: [
      "Arte del logotipo de Azeitonas Verdes con letras verdes que chorrean y una aceituna con rostro",
      "Ilustración de una aceituna verde derritiéndose en el espacio, rodeada de anillos morados",
      "Ilustración psicodélica de una aceituna con guitarra sobre un planeta, en verde, morado y azul",
    ],
  },
  sulboro: {
    subtitle: "Agronegocios / Nutrición vegetal",
    discipline: "Branding",
    services: ["Sitio web", "Tema WordPress a medida", "Arquitectura de contenidos", "Figma to code"],
    coverAlt: "Vista aérea de un productor con sombrero en medio de un cultivo de maíz",
    challenge: "Sulboro suministra octaborato de sodio a la agricultura brasileña. La línea BoroTop ya se ha aplicado en más de 22 millones de hectáreas y en más de 30 cultivos. La ciencia detrás del producto es sólida, pero el boro es difícil de vender: un micronutriente que productores y agrónomos suelen dejar en segundo plano. Sulboro necesitaba un sitio que explicara el producto cultivo por cultivo, generara credibilidad técnica y convirtiera el interés en solicitudes de cotización, sin obligar al productor a buscar la información en un PDF.",
    approach: "Organizamos el sitio en torno a una frase de la propia marca: \"el boro es un micronutriente con funciones macro\". En lugar de abrir con química, cada cultivo tiene su propia guía con las mismas tres respuestas: las ventajas de su uso, cuánto boro se necesita por hectárea y los síntomas de deficiencia a los que hay que prestar atención. Son 15 cultivos, desde la soja, el maíz y el café hasta la uva y el eucalipto, en una estructura coherente que un agrónomo lee en segundos. El sistema visual es limpio y está listo para el campo: espacio en blanco, un verde agrícola vibrante y la fuente KoHo para una voz cercana, pero técnica. Las grandes cifras de escala respaldan la prueba. Los tres productos BoroTop, los ensayos, el mapa de distribuidores y los eventos tienen cada uno su propia página. Un botón \"Pedir cotización\" de WhatsApp está siempre a mano.",
    result: "Sulboro ahora tiene una herramienta técnica de ventas, no un folleto digital. El productor encuentra su cultivo, ve la dosis recomendada y los síntomas que debe revisar, y pide una cotización con un toque. El tema WordPress a medida permite al equipo agregar cultivos, ensayos, eventos y vacantes sin tocar código, y vino con SEO y Google Site Kit configurados desde el primer día.",
    metrics: [
      { value: "15", label: "Guías por cultivo" },
      { value: "3", label: "Líneas de producto" },
      { value: "1 toque", label: "De la guía del cultivo a la cotización por WhatsApp" },
    ],
    galleryAlts: [
      "Guía tipográfica del sitio de Sulboro con la fuente KoHo y la paleta verde",
      "Página de inicio del sitio de Sulboro en una laptop",
      "Página de inicio completa del sitio de Sulboro, de la cabecera al pie de página",
    ],
  },
  "mi-brasil": {
    subtitle: "E-commerce oficial / Electrónica de consumo",
    discipline: "Digital",
    services: ["E-commerce", "Desarrollo front-end", "Implementación de UI", "LINX Commerce"],
    coverAlt: "Hombre con un bolso cruzado negro sobre una chaqueta café, en una foto de producto",
    challenge: "Mi Brasil es la tienda en línea oficial de Xiaomi en Brasil, donde smartphones, productos para el hogar inteligente, wearables y artículos de uso diario llegan al consumidor brasileño con garantía oficial. El catálogo es enorme y cambia todo el tiempo, los lanzamientos siguen calendarios globales ajustados, y la tienda tiene que ser inconfundiblemente Xiaomi sin dejar de funcionar para el consumidor brasileño: 12 cuotas sin interés, descuento por pago al contado, envío gratis a partir de un monto mínimo y atención local.",
    approach: "Construimos la tienda sobre Oracle Commerce Cloud, llevando el lenguaje visual global de Xiaomi a una tienda local. La MiSans recorre todo el sitio, el naranja característico se reserva para acciones y ofertas, y el negro y el blanco hacen el resto. La navegación sigue la forma en que la gente realmente compra: celulares, smartwatches, hogar inteligente, uso diario, belleza y salud, y audio, y cada una abre subcategorías específicas, desde cargadores hasta robots aspiradores. Los argumentos de compra del consumidor brasileño tienen un lugar fijo: pago en cuotas, descuento por pago al contado, envío gratis y el sello de garantía oficial aparecen justo debajo del header, así que la confianza y el precio quedan resueltos antes del primer scroll. Carruseles de categorías, vitrinas de ofertas exclusivas y banners modulares permiten cambiar campañas y lanzamientos sin nuevo desarrollo.",
    result: "Xiaomi Brasil opera un canal oficial único que escala desde accesorios de uso diario hasta lanzamientos de gama alta. Los equipos de merchandising cambian campañas, ofertas y nuevos productos con componentes reutilizables, mientras que la analítica, la automatización de marketing y el chat de atención al cliente se conectan a la misma tienda.",
    metrics: [
      { value: "7", label: "Categorías de producto" },
      { value: "30", label: "Subcategorías" },
      { value: "12x", label: "Pago en cuotas sin interés integrado al flujo de compra" },
    ],
    galleryAlts: [
      "Mujer recostada sonriendo mientras sostiene un smartphone Xiaomi",
      "Mujer mostrando un smartwatch Xiaomi en la muñeca",
      "Persona usando audífonos inalámbricos Xiaomi",
    ],
  },
  "athie-wohnrath": {
    subtitle: "Arquitectura y construcción corporativa",
    discipline: "Branding",
    services: ["Diseño UX/UI", "Sitio web", "Tema WordPress a medida", "Accesibilidad"],
    coverAlt: "Oficina corporativa de techos altos, con madera, plantas y sillones",
    challenge: "Athié | Wohnrath es una de las principales empresas de arquitectura y construcción corporativa de América Latina: 30 años en el mercado, más de 1.000 colaboradores directos y más de 32 millones de m² implementados. Su trabajo es preciso, de gran escala y certificado, pero el sitio tenía que abarcar tres negocios a la vez (arquitectura, construcción y retrofit) y hablarles a clientes de nivel C, gerentes de facilities y futuros colaboradores, sin convertirse en una base de datos de proyectos.",
    approach: "Dejamos que la escala hablara. La página de inicio abre con las credenciales de la empresa en cifras grandes: 30 años, más de 1.000 colaboradores, 32 millones de m² implementados y 114 proyectos con certificación LEED. Luego vienen las tres líneas de negocio, cada una con su propio capítulo. El sistema visual nace de los propios planos del estudio: espacio en blanco generoso, Montserrat para una lectura limpia, Gotham Black para las cifras que deben destacar, y el morado de la marca y el verde petróleo usados con moderación, como colores de orientación. Los proyectos destacados giran en un carrusel, para que el portafolio se mantenga visual y actualizado, y el sello GPTW 2025 le da a la marca empleadora su momento. La accesibilidad es parte de la base, no un agregado posterior: una barra de herramientas en la página ofrece ajuste del tamaño del texto, escala de grises, alto contraste, contraste negativo, enlaces subrayados y fuente legible, además de un consentimiento de cookies que prioriza la privacidad.",
    result: "Athié | Wohnrath ahora tiene un sitio corporativo que se lee como sus edificios: estructurado, sereno y seguro. El tema WordPress a medida permite a marketing publicar nuevos proyectos, actualizar cifras y sumar campañas por su cuenta, y la capa de accesibilidad hace que el sitio funcione para todos los visitantes, no solo para el visitante promedio.",
    metrics: [
      { value: "4", label: "Cifras de credenciales que abren la página de inicio" },
      { value: "3", label: "Líneas de negocio, cada una con su propio capítulo" },
      { value: "7", label: "Modos de accesibilidad integrados" },
    ],
    galleryAlts: [
      "Guía tipográfica del sitio de Athié Wohnrath con las fuentes Gotham y Montserrat",
      "Página de inicio del sitio de Athié Wohnrath en una laptop",
      "Página de inicio completa del sitio de Athié Wohnrath, de la cabecera al pie de página",
    ],
  },
  ceunsa: {
    subtitle: "Espiritualidad y comunidad / Centro de Umbanda",
    discipline: "Branding",
    services: ["Diseño UX/UI", "Sitio web", "WordPress Headless", "Front-end en Next.js"],
    coverAlt: "Perchero con ropa negra colgada en ganchos",
    challenge: "Fundado en Porto Alegre en 1959, el CEUNSA ha acogido a personas durante más de seis décadas con passes, giras y obras de caridad. Quien llega por primera vez casi siempre trae preguntas prácticas: qué día venir, qué ropa usar, si hace falta agendar, qué puede traer. El templo necesitaba un sitio que respondiera todo eso con la misma calma y calidez que la gente siente en la puerta, honrando 60 años de historia y a los guías espirituales que formaron la casa.",
    approach: "Diseñamos el sitio como una visita al templo, un espacio a la vez. Comienza con la bienvenida y la historia del templo; luego vienen el linaje de caciques y sus médiums, la directiva actual, los horarios, los espacios, los testimonios de visitantes, un recorrido por las cuatro áreas sagradas, himnos y oraciones, preguntas frecuentes y contacto. El sistema visual es sereno y luminoso: una paleta suave de azul acero con una cálida luz dorada, Newsreader para una voz editorial respetuosa y Work Sans para una lectura clara y práctica. La programación es el recurso más útil. Un calendario muestra lo que depara cada día (Pretos Velhos los lunes, Povo do Oriente los jueves, Caboclos los viernes), qué traer y la fase lunar del día. El contenido se gestiona en WordPress y se entrega mediante un front-end rápido en Next.js.",
    result: "El CEUNSA ahora tiene un hogar digital que funciona como su recepción: acogedor, claro y siempre abierto. Quien viene por primera vez sabe cuándo venir y cómo prepararse antes incluso de salir de casa, y los voluntarios del templo actualizan horarios, himnos y avisos en WordPress sin tocar el front-end.",
    metrics: [
      { value: "1959", label: "Un legado llevado al mundo digital" },
      { value: "11", label: "Secciones: una visita completa, de la bienvenida al contacto" },
      { value: "3", label: "Días de gira por semana en un calendario en vivo con fase lunar" },
    ],
    galleryAlts: [
      "Máquina de coser en un taller con poca luz",
      "Tela de terciopelo rojo doblada",
      "Tela negra en pliegues suaves sobre fondo oscuro",
    ],
  },
};
