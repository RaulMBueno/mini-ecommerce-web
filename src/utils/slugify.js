/**
 * Converte texto em slug amigável para URL (SEO).
 * Não é usado no backend — apenas na URL do front.
 */
export function slugify(text) {
  if (text == null || text === '') return 'produto';
  const str = String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'c')
    .toLowerCase()
    .trim();
  const slug = str
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
  return slug || 'produto';
}

/**
 * Caminho da página de detalhes: /product/:id/:slug
 */
export function productPath(product) {
  const id = product?.id;
  const slug = slugify(product?.name);
  return `/product/${id}/${slug}`;
}
