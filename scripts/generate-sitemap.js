import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const SITE_URL = process.env.SITEMAP_SITE_URL || 'https://remakeup.com.br';
const API_BASE_URL =
  process.env.SITEMAP_API_BASE ||
  'https://mini-ecommerce-production-c2d9.up.railway.app';

const toUrl = (pathname) => `${SITE_URL}${pathname}`;

const buildUrlEntry = (loc, changefreq = 'weekly', priority = '0.6') => `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const buildSitemap = (entries) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

const fetchCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }
  return response.json();
};

const run = async () => {
  const categories = await fetchCategories();
  const entries = [
    buildUrlEntry(toUrl('/'), 'daily', '1.0'),
    ...categories.map((cat) =>
      buildUrlEntry(toUrl(`/categoria/${cat.id}`), 'weekly', '0.7')
    ),
  ];

  const sitemap = buildSitemap(entries);
  const outputPath = path.resolve('public', 'sitemap.xml');
  await writeFile(outputPath, sitemap, 'utf8');
  // eslint-disable-next-line no-console
  console.log(`Sitemap atualizado em: ${outputPath}`);
};

run();
