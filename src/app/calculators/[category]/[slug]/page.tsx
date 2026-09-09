import { getCalculator, getAllCalculators } from '@/lib/calculators/registry';
import { generatePageMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import CalculatorShell from '@/components/calculator/CalculatorShell';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';

export async function generateStaticParams() {
  return getAllCalculators().map(def => ({
    category: def.categorySlug,
    slug: def.slug,
  }));
}

export async function generateMetadata({ params }: { params: { category: string; slug: string } }) {
  const { slug } = await params;
  const entry = getCalculator(slug);
  if (!entry) return {};
  return generatePageMetadata({
    title: entry.definition.name,
    description: entry.definition.shortDescription,
    path: `/calculators/${entry.definition.categorySlug}/${entry.definition.slug}`,
  });
}

export default async function CalculatorPage({ params }: { params: { category: string; slug: string } }) {
  const { slug, category } = await params;
  const entry = getCalculator(slug);
  if (!entry) notFound();

  const { definition } = entry;
  const breadcrumbs = [
    { label: 'Calculators', href: '/calculators' },
    { label: definition.category, href: `/categories/${category}` },
    { label: definition.name, href: `/calculators/${category}/${slug}` },
  ];

  const siteUrl = siteConfig.url;
  
  const appSchema = {
    '@context': 'https://schema.org',
    '@type': definition.schemaType || 'WebApplication',
    name: definition.name,
    description: definition.shortDescription,
    applicationCategory: 'CalculatorApplication',
    operatingSystem: 'Any',
    url: `${siteUrl}/calculators/${category}/${slug}`,
  };

  let faqSchema = null;
  if (definition.faqs && definition.faqs.length > 0) {
    faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: definition.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-6 mb-10">
        <h1 className="text-4xl font-extrabold text-navy tracking-tight mb-3">{definition.name}</h1>
        <p className="text-lg text-muted max-w-2xl">{definition.shortDescription}</p>
      </div>
      <CalculatorShell definition={definition} slug={slug} />
    </div>
  );
}
