import { getCalculator, getAllCalculators } from '@/lib/calculators/registry';
import { generatePageMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import CalculatorShell from '@/components/calculator/CalculatorShell';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Calculator, Sparkles, HelpCircle, Table } from 'lucide-react';

export async function generateStaticParams() {
  return getAllCalculators().map(def => ({
    category: def.categorySlug,
    slug: def.slug,
  }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ category: string; slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const hasQueryParams = Object.keys(resolvedSearchParams).length > 0;
  
  const entry = getCalculator(slug);
  if (!entry) return {};

  return generatePageMetadata({
    title: entry.definition.seoTitle || `${entry.definition.name} — Free Online Tool | IndiaWise`,
    description: entry.definition.seoDescription || entry.definition.shortDescription,
    path: `/calculators/${entry.definition.categorySlug}/${entry.definition.slug}`,
    noIndex: hasQueryParams,
  });
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
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

      {/* Server-Rendered Formula & Mathematical Logic */}
      {definition.formulaExplanation && (
        <div className="mt-14 print:hidden bg-alt/60 border border-border rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 text-brand font-semibold text-sm mb-2">
            <Calculator className="w-4 h-4" />
            <span>Calculation Methodology</span>
          </div>
          <h2 className="text-2xl font-bold text-navy mb-4">{definition.formulaExplanation.title}</h2>
          <div className="p-4 bg-white border border-border/80 rounded-xl font-mono text-sm sm:text-base text-navy font-semibold overflow-x-auto mb-4">
            {definition.formulaExplanation.formula}
          </div>
          <p className="text-muted leading-relaxed text-base">
            {definition.formulaExplanation.explanation}
          </p>
        </div>
      )}

      {/* Server-Rendered Representative Benchmarks Table */}
      {definition.benchmarks && (
        <div className="mt-12 print:hidden bg-white border border-border rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 text-brand font-semibold text-sm mb-1">
            <Table className="w-4 h-4" />
            <span>Market Benchmarks</span>
          </div>
          <h2 className="text-2xl font-bold text-navy mb-1">{definition.benchmarks.title}</h2>
          {definition.benchmarks.subtitle && (
            <p className="text-muted text-sm mb-6">{definition.benchmarks.subtitle}</p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-alt/80 border-b border-border text-navy font-semibold">
                <tr>
                  {definition.benchmarks.headers.map((header, idx) => (
                    <th key={idx} className="py-3 px-4 first:rounded-l-lg last:rounded-r-lg whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {definition.benchmarks.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-alt/30 transition-colors">
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className={`py-3.5 px-4 text-muted font-medium whitespace-nowrap ${cellIdx === 0 ? 'text-navy font-semibold' : ''}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Flagship Financial Health Score Callout Banner */}
      <div className="mt-12 print:hidden bg-gradient-to-br from-navy via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/20 border border-brand/40 text-brand text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand" />
            Flagship Diagnostic
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Check Your 360° Financial Health Score</h2>
          <p className="text-slate-300 text-sm sm:text-base mb-6 leading-relaxed">
            One calculator solves one question. Your Financial Health Score connects all the dots — evaluating debt-to-income, savings rate, investment velocity, and emergency runway in 60 seconds with zero data stored.
          </p>
          <Link
            href="/financial-health-score"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand/90 transition-all shadow-md hover:shadow-brand/25"
          >
            <span>Analyze Your Financial Health Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Educational Guides Section */}
      {definition.relatedGuides && definition.relatedGuides.length > 0 && (
        <div className="mt-12 print:hidden">
          <div className="flex items-center gap-2 text-brand font-semibold text-sm mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Deep Dive Guides</span>
          </div>
          <h2 className="text-2xl font-bold text-navy mb-4">Recommended Financial Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {definition.relatedGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="group p-5 bg-white border border-border rounded-xl hover:border-brand hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-navy group-hover:text-brand transition-colors mb-1.5">
                    {guide.title}
                  </h3>
                  <p className="text-sm text-muted line-clamp-2 leading-relaxed">
                    {guide.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-brand group-hover:translate-x-1 transition-transform">
                  <span>Read full guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* About Section */}
      <div className="mt-14 prose prose-lg prose-navy max-w-none print:hidden bg-white border border-border rounded-2xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-navy mb-4">About the {definition.name}</h2>
        <p className="text-muted leading-relaxed whitespace-pre-line text-base">
          {definition.longDescription}
        </p>
      </div>

      {/* Frequently Asked Questions */}
      {definition.faqs && definition.faqs.length > 0 && (
        <div className="mt-12 print:hidden">
          <div className="flex items-center gap-2 text-brand font-semibold text-sm mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Clear Answers</span>
          </div>
          <h2 className="text-2xl font-bold text-navy mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {definition.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white border border-border rounded-xl p-4 sm:p-5 [&_summary::-webkit-details-marker]:hidden cursor-pointer open:ring-1 open:ring-brand/30"
              >
                <summary className="flex items-center justify-between font-semibold text-navy text-base list-none">
                  <span>{faq.question}</span>
                  <span className="text-muted group-open:rotate-180 transition-transform text-lg ml-2 font-mono">
                    ↓
                  </span>
                </summary>
                <p className="mt-3 text-muted text-sm sm:text-base leading-relaxed border-t border-border/60 pt-3">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Server-Rendered Internal Links */}
      {relatedLinks.length > 0 && (
        <div className="mt-14 print:hidden">
          <h2 className="text-2xl font-bold text-navy mb-6">Related Calculators</h2>
          <div className="flex flex-wrap gap-3">
            {relatedLinks.map(link => (
              <Link
                key={link.slug}
                href={link.href}
                className="px-5 py-2.5 bg-white border border-border rounded-xl font-medium text-navy hover:border-brand hover:text-brand transition-colors text-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
