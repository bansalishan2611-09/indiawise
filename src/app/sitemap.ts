import { MetadataRoute } from 'next';
import { getAllCalculators } from '@/lib/calculators/registry';
import { getAllGuides } from '@/lib/guides/content';
import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteConfig.url;

  const staticRoutes = [
    '',
    '/financial-health-score',
    '/calculators',
    '/categories',
    '/guides',
    '/about',
    '/founder',
    '/contact',
    '/faq',
    '/search',
    '/privacy-policy',
    '/terms',
    '/disclaimer',
    '/ai-disclaimer',
    '/editorial-policy',
    '/advertising-disclosure',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const calculatorRoutes = getAllCalculators().map((def) => ({
    url: `${siteUrl}/calculators/${def.categorySlug}/${def.slug}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // Dynamic Category pages
  const categories = Array.from(new Set(getAllCalculators().map(def => def.categorySlug)));
  const categoryRoutes = categories.map((cat) => ({
    url: `${siteUrl}/categories/${cat}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Educational Guide pages
  const guideRoutes = getAllGuides().map((guide) => ({
    url: `${siteUrl}/guides/${guide.slug}`,
    lastModified: guide.publishedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...calculatorRoutes, ...guideRoutes];
}
