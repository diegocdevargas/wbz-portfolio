// Portuguese (main language). Home copy is verbatim from the live site (desktop, pt-BR).
// en.ts and es.ts follow this exact shape; TypeScript flags any missing key.

export const pt = {
  meta: {
    title: "Webcraftz — da faísca para a órbita.",
    description:
      "Para fundadores e empresas que precisam de mais do que um site. Aplicações web, assistentes de IA e automações, entregues por meio de um processo claro, da primeira ideia ao lançamento e além.",
    skipLink: "Pular para o conteúdo",
  },

  header: {
    nav: { about: "Sobre", cases: "Cases", services: "Serviços", journey: "Jornada", faq: "FAQ" },
    contact: "Contato",
    homeLabel: "página inicial",
    mainNav: "Principal",
    mobileNav: "Menu móvel",
    menu: "Menu",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    language: "Idioma",
  },

  /** Subject line of the "Iniciar projeto" e-mail. */
  startProjectSubject: "Novo projeto",

  home: {
    // Lines are kept so the desktop break "Ideias Em / Produtos / Reais." is preserved.
    hero: {
      title: [
        { text: "Ideias Em", accent: false },
        { text: "Produtos", accent: true },
        { text: "Reais.", accent: true },
      ],
      lead: "Sites, aplicações web, assistentes com IA e automações, projetados e desenvolvidos de ponta a ponta por um dev com mais de 13 anos de experiência.",
      techLabel: "Tecnologias",
    },
    values: {
      eyebrow: "Por Que Trabalhar Comigo",
      title: { text: "Feito para Funcionar.", accent: "Feito para Durar." },
      // Same order as `valueLayout` in content/home.ts.
      items: [
        { title: "Lance com Confiança", body: "Entregue um produto testado, seguro e pronto para usuários reais." },
        { title: "Um Único Contato", body: "Design, código, IA e infraestrutura com a mesma pessoa." },
        { title: "Ganhe Velocidade:", body: "Automações e IA eliminam o trabalho manual que atrasa sua equipe." },
        { title: "Experiência Comprovada", body: "Mais de 13 anos criando para startups e grandes marcas." },
      ],
    },
    services: {
      eyebrow: "O que eu Crio",
      title: { text: "Tudo que seu Produto Precisa.", accent: "Feito do jeito Certo." },
      // Same order as `serviceIcons` in content/home.ts.
      items: [
        { title: "Aplicações Web", body: "Apps full-stack com React, Next.js e APIs sólidas." },
        { title: "Sites & E-commerce", body: "Sites e lojas feitos para performar e vender." },
        { title: "UI/UX", body: "Interfaces que as pessoas entendem de primeira." },
        { title: "Assistentes com IA & RAG", body: "Chatbots que respondem com base nos seus documentos e dados." },
        { title: "Automação de Processos", body: "Fluxos no n8n que conectam suas ferramentas e reduzem o trabalho manual." },
        { title: "Deploy & Suporte", body: "Hospedagem, segurança e cuidado muito depois do lançamento." },
      ],
    },
    journey: {
      // The live site shows no visible heading for this section; this one is for screen readers.
      srTitle: "Jornada do projeto",
      steps: [
        { title: "Faísca", body: "Transformamos sua ideia em plano, escopo e orçamento claros." },
        { title: "Forma", body: "Desenhamos a experiência antes da primeira linha de código." },
        { title: "Construção", body: "Desenvolvemos o produto, as integrações e as automações." },
        { title: "Test Drive", body: "Refinamos cada detalhe com o seu feedback real." },
        { title: "No Ar", body: "Lançamento seguro, configurado e pronto para crescer." },
      ],
    },
    clients: { eyebrow: "Empresas que confiaram no meu trabalho", label: "Clientes" },
    selectedWork: {
      eyebrow: "Trabalhos Selecionados",
      title: { text: "Projetos que", accent: "Movem" },
      cta: "Todos os Projetos",
    },
    testimonials: {
      title: { text: "Aprovado Por", accent: "Clientes." },
      rating: "Nota 4,89/5 em mais de 200 projetos na Workana.",
      label: "Depoimentos",
    },
    faq: {
      eyebrow: "Perguntas Frequentes",
      title: { text: "Perguntas", accent: "& Respostas." },
      items: [
        {
          q: "Que tipo de projeto você atende?",
          a: "Sites, e-commerce, aplicações web full-stack, assistentes com IA e RAG, e automações com n8n. Se roda na web, provavelmente dá para construir.",
        },
        {
          q: "Como um projeto começa?",
          a: "Com uma conversa rápida para entender seus objetivos. Depois, você recebe escopo, prazo e orçamento claros antes de qualquer trabalho começar.",
        },
        {
          q: "Quanto tempo leva um projeto?",
          a: "Depende do escopo. Uma landing page pode levar dias; uma aplicação sob medida, semanas. Você recebe um prazo realista desde o início, com atualizações frequentes.",
        },
        {
          q: "Você trabalha com meu site ou sistema atual?",
          a: "Sim. Posso melhorar, migrar ou integrar com o que você já tem, seja WordPress, WooCommerce, um app próprio ou suas ferramentas atuais",
        },
        {
          q: "O que acontece depois do lançamento?",
          a: "Cuido do deploy, domínio e SSL, e ofereço suporte contínuo para atualizações, correções e novas funcionalidades sempre que precisar.",
        },
        {
          q: "IA e automação podem mesmo ajudar meu negócio?",
          a: "Se sua equipe repete as mesmas tarefas, responde as mesmas perguntas ou move dados entre ferramentas, sim. Começamos identificando onde isso economiza tempo de verdade.",
        },
      ],
    },
    cta: {
      eyebrow: "Próximo passo",
      // Line breaks as on the live desktop layout. "ORBITA" has no accent on the live site.
      title: ["Tem uma ideia?", "Vamos colocar", "em orbita."],
      button: "Iniciar Projeto",
      mailLead: "ou escreva para",
    },
    loader: { caption: "Preparando a órbita" },
  },

  footer: {
    eyebrow: "Pronto para começar?",
    lead: ["Vamos construir, lançar", "e manter em movimento."],
    sitemapTitle: "Sitemap",
    sitemap: { home: "Home", work: "Work", contact: "Contato" },
    socialTitle: "Social",
    studioTitle: "Studio",
    location: ["Rio Grande do Sul,", "Brasil"],
    clockPlace: "Brasil",
    copyright: "© Webcraftz. Todos os direitos reservados.",
    reach: "Brasil — Atendendo clientes no mundo todo",
  },

  work: {
    metaTitle: "Cases",
    kicker: "Case studies",
    title: "Em Órbita",
    intro:
      "Sites, apps e identidades feitos para deixar marca, não só para lançar. Cada projeto aqui começou como uma faísca que precisava de direção.",
    categories: {
      all: "All work",
      websites: "Websites",
      ecommerce: "E-commerce",
      "web-apps": "Web Apps",
      "ai-automacao": "AI & Automação",
    },
    filterLabel: "Filtrar projetos por categoria",
    /** {count} and {label} are filled in. */
    liveCount: "{count} projetos em {label}",
    empty: "Nenhum projeto nesta categoria ainda.",
    showAll: "Ver todos os trabalhos",
  },

  caseStudy: {
    back: "Todos os trabalhos",
    client: "Client",
    year: "Year",
    discipline: "Discipline",
    services: "Services",
    visit: "Visitar o site",
    storyLabel: "(Case study)",
    challenge: "O desafio",
    approach: "Nossa abordagem",
    result: "O resultado",
    metricsLabel: "Resultados",
    galleryLabel: "Galeria",
    nextNav: "Próximo projeto",
    nextLabel: "(Next project)",
  },
};

export type Dictionary = typeof pt;
