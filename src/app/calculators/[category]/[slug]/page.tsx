import { getCalculator, getAllCalculators } from '@/lib/calculators/registry';
import { generatePageMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import CalculatorShell from '@/components/calculator/CalculatorShell';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { Suspense } from 'react';

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
    '@type': definition.schemaType || 'SoftwareApplication',
    name: definition.name,
    description: definition.shortDescription,
    applicationCategory: definition.category === 'Health' ? 'HealthApplication' : 'FinanceApplication',
    operatingSystem: 'All',
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

  const relatedLinks = (definition.relatedCalculators || []).map(relatedSlug => {
    const relDef = getCalculator(relatedSlug)?.definition;
    return {
      slug: relatedSlug,
      name: relDef?.name || relatedSlug.replace(/-/g, ' '),
      href: relDef ? `/calculators/${relDef.categorySlug}/${relatedSlug}` : `/calculators/${category}/${relatedSlug}`
    };
  });

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
      <div className="print:hidden">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      
      {/* Page Header */}
      <div className="mt-6 mb-10 print:hidden">
        <h1 className="text-4xl font-extrabold text-navy tracking-tight mb-3">{definition.name}</h1>
        <p className="text-lg text-muted max-w-2xl">{definition.shortDescription}</p>
      </div>

      {/* Main Interactive Shell */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center animate-pulse bg-alt rounded-3xl border border-border">Loading calculator...</div>}>
        <CalculatorShell definition={definition} slug={slug} />
      </Suspense>

      {/* SEO Content Section */}
      <div className="mt-16 prose prose-lg prose-navy max-w-none print:hidden">
        <h2 className="text-2xl font-bold text-navy mb-4">About the {definition.name}</h2>
        <p className="text-muted leading-relaxed whitespace-pre-line">
          {definition.longDescription}
        </p>
      </div>

      {/* Server-Rendered Internal Links */}
      {relatedLinks.length > 0 && (
        <div className="mt-12 print:hidden">
          <h2 className="text-2xl font-bold text-navy mb-6">Related Calculators</h2>
          <div className="flex flex-wrap gap-3">
            {relatedLinks.map(link => (
              <a
                key={link.slug}
                href={link.href}
                className="px-5 py-2.5 bg-white border border-border rounded-xl font-medium text-navy hover:border-brand hover:text-brand transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
