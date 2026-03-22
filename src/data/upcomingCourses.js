/**
 * Cursos em pré-lançamento (conteúdo estático — sem backend).
 */
export const UPCOMING_COURSES = [
  {
    slug: 'automaquiagem-basica',
    title: 'Automaquiagem Básica',
    shortDescription:
      'Do zero ao dia a dia: pele natural, olhos e boca com técnicas simples e rápidas.',
    image: '/hero-banner.jpg',
    accent: 'from-rose-100/90 to-pink-50/80',
  },
  {
    slug: 'pele-perfeita',
    title: 'Pele Perfeita',
    shortDescription:
      'Preparação, corretivos e acabamento para uma pele uniforme e fotogênica em qualquer luz.',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
    accent: 'from-fuchsia-100/90 to-rose-50/80',
  },
  {
    slug: 'maquiagem-profissional',
    title: 'Maquiagem Profissional',
    shortDescription:
      'Técnicas de estúdio, produtos e finalização para quem quer nivelar o trabalho.',
    image:
      'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80',
    accent: 'from-purple-100/90 to-pink-50/80',
  },
];

export function getCourseBySlug(slug) {
  return UPCOMING_COURSES.find((c) => c.slug === slug);
}
