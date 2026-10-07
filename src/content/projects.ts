// Editable project data. Drives the Home "Projetos que movem" grid, /cases and /cases/[slug].
// Text is copied verbatim from the live site (www.webcraftz.com.br, 2026-10-03).
// `needsReview` lists fields that look like template leftovers or need Diego's confirmation;
// it is never rendered.

import type { Locale } from "@/i18n/config";
import { projectsEn } from "./projects.en";
import { projectsEs } from "./projects.es";

export type Category = "websites" | "ecommerce" | "web-apps" | "ai-automacao";

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Metric {
  value: string;
  label: string;
}

export interface Project {
  slug: string;
  title: string;
  year: number;
  subtitle: string;
  client: string;
  discipline: string;
  services: string[];
  categories: Category[];
  /** "Visitar o site"; null hides the button. */
  url: string | null;
  /** Shown in the Home selected-work grid. */
  featured: boolean;
  order: number;
  cover: ImageAsset;
  /** Paragraphs support `inline code` spans. */
  challenge: string;
  approach: string;
  result: string;
  metrics: Metric[];
  gallery: ImageAsset[];
  needsReview?: string[];
}

/** Text that changes per language. Portuguese lives in `data` below; see projects.en.ts / projects.es.ts. */
export interface ProjectCopy {
  subtitle: string;
  discipline: string;
  services: string[];
  coverAlt: string;
  challenge: string;
  approach: string;
  result: string;
  metrics: Metric[];
  galleryAlts: string[];
}

const data: Project[] = [
  {
    slug: "azeitonas-verdes",
    title: "Azeitonas Verdes",
    year: 2026,
    subtitle: "Tema punk rock",
    client: "Azeitonas Verdes",
    discipline: "Branding",
    services: [
      "Identidade",
      "Branding",
      "Website",
      "Design System"
    ],
    categories: [
      "websites"
    ],
    url: "https://www.azeitonasverdes.com/",
    featured: true,
    order: 1,
    cover: {
      src: "/images/projects/azeitonas-verdes/cover.jpg",
      alt: "Show ao vivo com o público de braços erguidos diante de um palco iluminado por luzes verdes",
      width: 1408,
      height: 768
    },
    challenge: "Azeitonas Verdes é um power trio do interior do Rio Grande do Sul que toca punk rock cru e direto, com uma veia psicodélica. As músicas, os vídeos e as datas de show estavam espalhados pelas redes sociais. A banda precisava de uma casa própria que soasse como ela parece: barulhenta, grudenta e meio descontrolada, mas que ainda facilitasse achar o próximo show ou dar o play.",
    approach: "Construímos a marca em torno de uma imagem: a azeitona como gosma. Um logotipo escorrendo, com contornos roxo e amarelo deslocados, resgata as fotocópias desalinhadas do punk. Filtros SVG de efeito gosma fazem as azeitonas derreterem e se fundirem, pulsando em sincronia com a música. O sistema é enxuto: um palco quase preto, um único verde-ácido como cor de destaque, roxo e amarelo guardados para os toques psicodélicos, tipografia condensada de cartaz e rótulos `//` em estilo terminal, que seguram o caos. Cada seção funciona como uma faixa de disco: sobre, vídeos, discografia, shows, galeria, a banda (\"os ingredientes da conserva\") e contato.",
    result: "A banda agora tem um hub único e próprio para os vídeos ao vivo, os lançamentos e a agenda de shows, com uma identidade forte o bastante para cartazes, merch e visuais de palco.",
    metrics: [
      {
        value: "100",
        label: "Performance no Lighthouse (desktop)"
      },
      {
        value: "95",
        label: "Performance no Lighthouse (mobile)"
      },
      {
        value: "100",
        label: "Acessibilidade, Boas Práticas e SEO"
      }
    ],
    gallery: [
      {
        src: "/images/projects/azeitonas-verdes/gallery-1.jpg",
        alt: "Arte do logotipo Azeitonas Verdes com letras escorrendo em verde e uma azeitona com rosto",
        width: 1024,
        height: 1024
      },
      {
        src: "/images/projects/azeitonas-verdes/gallery-2.jpg",
        alt: "Ilustração de uma azeitona verde derretendo no espaço, cercada por anéis roxos",
        width: 1408,
        height: 768
      },
      {
        src: "/images/projects/azeitonas-verdes/gallery-3.jpg",
        alt: "Ilustração psicodélica de uma azeitona com guitarra sobre um planeta, em verde, roxo e azul",
        width: 928,
        height: 1152
      }
    ],
    needsReview: [
      "discipline"
    ]
  },
  {
    slug: "sulboro",
    title: "Sulboro",
    year: 2018,
    subtitle: "Agronegócio / Nutrição vegetal",
    client: "Sulboro",
    discipline: "Branding",
    services: [
      "Website",
      "Tema WordPress Customizado",
      "Arquitetura de Conteúdo",
      "Figma to code"
    ],
    categories: [
      "websites"
    ],
    url: "https://www.sulboro.com.br/",
    featured: true,
    order: 2,
    cover: {
      src: "/images/projects/sulboro/cover.jpeg",
      alt: "Vista aérea de um produtor de chapéu no meio de uma lavoura de milho",
      width: 4818,
      height: 3210
    },
    challenge: "A Sulboro fornece octaborato de sódio para a agricultura brasileira. A linha BoroTop já foi aplicada em mais de 22 milhões de hectares e em mais de 30 culturas. A ciência por trás do produto é sólida, mas o boro é uma venda difícil: um micronutriente que produtores e agrônomos costumam deixar em segundo plano. A Sulboro precisava de um site que explicasse o produto cultura por cultura, construísse credibilidade técnica e transformasse interesse em pedido de cotação, sem obrigar o produtor a procurar a informação num PDF.",
    approach: "Organizamos o site em torno de uma frase da própria marca: \"o boro é um micronutriente com funções macro\". Em vez de abrir com química, cada cultura ganha um guia próprio com as mesmas três respostas: as vantagens do uso, quanto boro é necessário por hectare e os sintomas de deficiência a observar. São 15 culturas, da soja, do milho e do café à uva e ao eucalipto, numa estrutura consistente que um agrônomo lê em segundos. O sistema visual é limpo e pronto para o campo: espaço em branco, um verde agrícola vivo e a fonte KoHo para uma voz amigável, mas técnica. Os grandes números de escala sustentam a prova. Os três produtos BoroTop, os experimentos, o mapa de revendas e os eventos ganham cada um a sua página. Um botão \"Pedir cotação\" no WhatsApp fica sempre ao alcance.",
    result: "A Sulboro agora tem uma ferramenta técnica de vendas, não um folder digital. O produtor encontra a sua cultura, vê a dose recomendada e os sintomas a checar, e pede cotação com um toque. O tema WordPress customizado permite à equipe incluir culturas, experimentos, eventos e vagas sem mexer em código, e já veio com SEO e Google Site Kit configurados desde o primeiro dia.",
    metrics: [
      {
        value: "15",
        label: "Guias por cultura"
      },
      {
        value: "3",
        label: "Linhas de produto"
      },
      {
        value: "1 toque",
        label: "Do guia da cultura à cotação no WhatsApp"
      }
    ],
    gallery: [
      {
        src: "/images/projects/sulboro/gallery-1.png",
        alt: "Guia tipográfico do site da Sulboro com a fonte KoHo e a paleta verde",
        width: 680,
        height: 820
      },
      {
        src: "/images/projects/sulboro/gallery-2.png",
        alt: "Home do site da Sulboro exibida em um notebook",
        width: 1000,
        height: 1000
      },
      {
        src: "/images/projects/sulboro/gallery-3.png",
        alt: "Página inicial completa do site da Sulboro, do topo ao rodapé",
        width: 1366,
        height: 4346
      }
    ],
    needsReview: [
      "discipline"
    ]
  },
  {
    slug: "mi-brasil",
    title: "Xiaomi Brasil",
    year: 2021,
    subtitle: "Official e-commerce / Consumer electronics",
    client: "Xiaomi Brasil",
    discipline: "Digital",
    services: [
      "E-commerce",
      "Desenvolvimento Front-end",
      "Implementação de UI",
      "LINX Commerce"
    ],
    categories: [
      "ecommerce"
    ],
    url: "https://www.mibrasil.com.br/",
    featured: true,
    order: 3,
    cover: {
      src: "/images/projects/mi-brasil/cover.jpg",
      alt: "Homem com bolsa transversal preta sobre jaqueta marrom, em foto de produto",
      width: 928,
      height: 1144
    },
    challenge: "A Mi Brasil é a loja online oficial da Xiaomi no Brasil, onde smartphones, casa inteligente, wearables e itens do dia a dia chegam ao consumidor brasileiro com garantia oficial. O catálogo é enorme e muda o tempo todo, os lançamentos seguem cronogramas globais apertados, e a loja precisa ser inconfundivelmente Xiaomi sem deixar de funcionar para o consumidor brasileiro: 12x sem juros, desconto à vista, frete grátis a partir de um valor mínimo e atendimento local.",
    approach: "Construímos a loja sobre o Oracle Commerce Cloud, levando a linguagem visual global da Xiaomi para uma loja local. A MiSans percorre todo o site, o laranja característico fica reservado para ações e ofertas, e o preto e o branco fazem o resto. A navegação segue o jeito como as pessoas realmente compram: celulares, smartwatches, casa inteligente, dia a dia, beleza e saúde, e áudio, cada uma abrindo subcategorias focadas, de carregadores a robôs aspiradores. Os argumentos de compra do brasileiro ganham espaço fixo: parcelamento, desconto à vista, frete grátis e o selo de garantia oficial ficam logo abaixo do header, então confiança e preço estão respondidos antes da primeira rolagem. Carrosséis de categoria, vitrines de ofertas exclusivas e banners modulares permitem trocar campanhas e lançamentos sem novo desenvolvimento.",
    result: "A Xiaomi Brasil opera um canal oficial único que escala de acessórios do dia a dia a lançamentos topo de linha. As equipes de merchandising trocam campanhas, ofertas e novos produtos com componentes reutilizáveis, enquanto analytics, automação de marketing e o chat de atendimento se conectam à mesma loja.",
    metrics: [
      {
        value: "7",
        label: "Categorias de produto"
      },
      {
        value: "30",
        label: "Subcategorias"
      },
      {
        value: "12x",
        label: "Parcelamento sem juros integrado ao fluxo de compra"
      }
    ],
    gallery: [
      {
        src: "/images/projects/mi-brasil/gallery-1.webp",
        alt: "Mulher deitada sorrindo enquanto segura um smartphone Xiaomi",
        width: 439,
        height: 539
      },
      {
        src: "/images/projects/mi-brasil/gallery-2.webp",
        alt: "Mulher mostrando um smartwatch Xiaomi no pulso",
        width: 439,
        height: 539
      },
      {
        src: "/images/projects/mi-brasil/gallery-3.webp",
        alt: "Pessoa usando um fone de ouvido sem fio Xiaomi",
        width: 439,
        height: 539
      }
    ],
    needsReview: [
      "subtitle (em inglês no site atual)",
      "services: LINX Commerce vs Oracle Commerce Cloud no texto"
    ]
  },
  {
    slug: "athie-wohnrath",
    title: "Athié Wohnrath",
    year: 2019,
    subtitle: "Arquitetura e construção corporativa",
    client: "Athié Wohnrath",
    discipline: "Branding",
    services: [
      "UX/UI Design",
      "Website",
      "Tema WordPress Customizado",
      "Acessibilidade"
    ],
    categories: [
      "websites"
    ],
    url: "https://www.athiewohnrath.com.br/",
    featured: true,
    order: 4,
    cover: {
      src: "/images/projects/athie-wohnrath/cover.webp",
      alt: "Escritório corporativo com pé-direito alto, madeira, plantas e poltronas",
      width: 1920,
      height: 1080
    },
    challenge: "A Athié | Wohnrath é uma das principais empresas de arquitetura e construção corporativa da América Latina: 30 anos de mercado, mais de 1.000 colaboradores diretos e mais de 32 milhões de m² implantados. O trabalho é preciso, de grande escala e certificado, mas o site precisava dar conta de três negócios ao mesmo tempo (arquitetura, construção e retrofit) e falar com clientes C-level, gestores de facilities e futuros colaboradores, sem virar um banco de dados de projetos.",
    approach: "Deixamos a escala falar. A home abre com as credenciais da empresa em números grandes: 30 anos, mais de 1.000 colaboradores, 32 milhões de m² implantados e 114 projetos com certificação LEED. Em seguida vêm as três linhas de negócio, cada uma com o seu capítulo. O sistema visual vem dos próprios desenhos do escritório: espaço em branco generoso, Montserrat para uma leitura limpa, Gotham Black para os números que precisam marcar, e o roxo da marca e o verde-petróleo usados com parcimônia, como cores de orientação. Os projetos em destaque rodam num carrossel, para o portfólio ficar visual e atualizado, e o selo GPTW 2025 dá à marca empregadora o seu momento. A acessibilidade faz parte da base, não vem depois: uma barra de ferramentas na página oferece ajuste de tamanho do texto, escala de cinza, alto contraste, contraste negativo, links sublinhados e fonte legível, além de um consentimento de cookies que prioriza a privacidade.",
    result: "A Athié | Wohnrath agora tem um site corporativo que se lê como os seus edifícios: estruturado, calmo e seguro. O tema WordPress customizado permite ao marketing publicar novos projetos, atualizar números e incluir campanhas por conta própria, e a camada de acessibilidade faz o site funcionar para todos os visitantes, não só para o visitante médio.",
    metrics: [
      {
        value: "4",
        label: "Métricas de credencial abrindo a home"
      },
      {
        value: "3",
        label: "Linhas de negócio, cada uma com seu capítulo"
      },
      {
        value: "7",
        label: "Modos de acessibilidade integrados"
      }
    ],
    gallery: [
      {
        src: "/images/projects/athie-wohnrath/gallery-1.png",
        alt: "Guia tipográfico do site da Athié Wohnrath com as fontes Gotham e Montserrat",
        width: 680,
        height: 820
      },
      {
        src: "/images/projects/athie-wohnrath/gallery-2.png",
        alt: "Home do site da Athié Wohnrath exibida em um notebook",
        width: 1000,
        height: 1000
      },
      {
        src: "/images/projects/athie-wohnrath/gallery-3.png",
        alt: "Página inicial completa do site da Athié Wohnrath, do topo ao rodapé",
        width: 1349,
        height: 4832
      }
    ],
    needsReview: [
      "discipline"
    ]
  },
  {
    slug: "ceunsa",
    title: "Ceunsa",
    year: 2026,
    subtitle: "Espiritualidade e comunidade / Centro de Umbanda",
    client: "Centro Espírita de Umbanda Nossa Senhora Aparecida (CEUNSA)",
    discipline: "Branding",
    services: [
      "UX/UI Design",
      "Website",
      "WordPress Headless",
      "Front-end em Next.js"
    ],
    categories: [
      "websites"
    ],
    url: null,
    featured: false,
    order: 5,
    cover: {
      src: "/images/projects/ceunsa/cover.jpg",
      alt: "Arara com roupas pretas penduradas em cabides",
      width: 2400,
      height: 1600
    },
    challenge: "Fundado em Porto Alegre em 1959, o CEUNSA acolhe pessoas há mais de seis décadas com passes, giras e trabalho de caridade. Quem chega pela primeira vez quase sempre traz perguntas práticas: em que dia vir, que roupa usar, se precisa agendar, o que pode trazer. O templo precisava de um site que respondesse a tudo isso com a mesma calma e acolhimento que as pessoas sentem na porta, honrando 60 anos de história e os guias espirituais que formaram a casa.",
    approach: "Desenhamos o site como uma visita ao templo, um espaço de cada vez. Ele começa com as boas-vindas e a história do templo, depois vêm a linhagem de caciques e seus aparelhos, a diretoria atual, os horários, os espaços, os depoimentos de visitantes, um tour pelas quatro áreas sagradas, hinos e orações, perguntas frequentes e contato. O sistema visual é sereno e luminoso: uma paleta suave de azul-aço com luz dourada quente, a Newsreader para uma voz editorial respeitosa e a Work Sans para uma leitura clara e prática. A programação é o recurso mais útil. Um calendário mostra o que cada dia reserva (Pretos Velhos às segundas, Povo do Oriente às quintas, Caboclos às sextas), o que trazer e a fase da lua do dia. O conteúdo é gerenciado no WordPress e entregue por um front-end rápido em Next.js.",
    result: "O CEUNSA agora tem uma casa digital que funciona como a sua recepção: acolhedora, clara e sempre aberta. Quem vem pela primeira vez sabe quando vir e como se preparar antes mesmo de sair de casa, e os voluntários do templo atualizam horários, hinos e avisos no WordPress sem mexer no front-end.",
    metrics: [
      {
        value: "1959",
        label: "Legacy brought online"
      },
      {
        value: "11",
        label: "Sections, a full visit from welcome to contact"
      },
      {
        value: "3",
        label: "Weekly gira days in a live calendar with moon phase"
      }
    ],
    gallery: [
      {
        src: "/images/projects/ceunsa/gallery-1.jpg",
        alt: "Máquina de costura em um ateliê com pouca luz",
        width: 1200,
        height: 800
      },
      {
        src: "/images/projects/ceunsa/gallery-2.jpg",
        alt: "Tecido de veludo vermelho dobrado",
        width: 1200,
        height: 800
      },
      {
        src: "/images/projects/ceunsa/gallery-3.jpg",
        alt: "Tecido preto em dobras suaves sobre fundo escuro",
        width: 1200,
        height: 675
      }
    ],
    needsReview: [
      "url: o site atual aponta para example.com",
      "discipline",
      "metrics em inglês no site atual",
      "imagens parecem do template Framer (alt \"Atelier Sōl\"), não do CEUNSA"
    ]
  }
];

const translations: Partial<Record<Locale, Record<string, ProjectCopy>>> = { en: projectsEn, es: projectsEs };

function localize(project: Project, locale: Locale): Project {
  const copy = translations[locale]?.[project.slug];
  if (!copy) return project;
  return {
    ...project,
    subtitle: copy.subtitle,
    discipline: copy.discipline,
    services: copy.services,
    cover: { ...project.cover, alt: copy.coverAlt },
    challenge: copy.challenge,
    approach: copy.approach,
    result: copy.result,
    metrics: copy.metrics,
    gallery: project.gallery.map((img, i) => ({ ...img, alt: copy.galleryAlts[i] ?? img.alt })),
  };
}

const sorted = [...data].sort((a, b) => a.order - b.order);

/** All projects in `order`, with text in the requested language. */
export function getProjects(locale: Locale): Project[] {
  return sorted.map((p) => localize(p, locale));
}

export const projectSlugs = sorted.map((p) => p.slug);

export function getFeaturedProjects(locale: Locale): Project[] {
  return getProjects(locale).filter((p) => p.featured);
}

export function getProject(slug: string, locale: Locale): Project | undefined {
  const p = sorted.find((x) => x.slug === slug);
  return p && localize(p, locale);
}

/** Next project in `order`, wrapping around to the first. */
export function getNextProject(slug: string, locale: Locale): Project {
  const i = sorted.findIndex((p) => p.slug === slug);
  return localize(sorted[(i + 1) % sorted.length], locale);
}
