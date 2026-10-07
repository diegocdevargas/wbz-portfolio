// Client feedback, edited separately from projects. Quotes are verbatim from the live site
// (Workana reviews) and stay in their original Portuguese on every language version.
// Do not add endorsements that are not real.

export interface Testimonial {
  name: string;
  quote: string;
  avatar?: string;
  source: "Workana";
  needsReview?: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Vivian",
    quote:
      "Rápido e direto ao ponto, facilitando o projeto interagindo com outros recursos, recomendo",
    avatar: "/images/testimonials/vivian.jpg",
    source: "Workana",
  },
  {
    name: "Pedro",
    quote:
      "Profissional brilhante, muito hábil superou todas minhas expectativas! Recomendo 100%.",
    avatar: "/images/testimonials/pedro.jpg",
    source: "Workana",
  },
  {
    name: "Analee",
    quote:
      "Projeto desenvolvido com diligência e atenção a pontos técnicos. Sempre disponível a esclarecerecimentos em linguagem acessível.",
    avatar: "/images/testimonials/analee.jpg",
    source: "Workana",
    needsReview: 'Typo "esclarecerecimentos" kept as on the live site until confirmed.',
  },
];
