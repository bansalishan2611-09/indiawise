import { notFound } from "next/navigation";
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { siteConfig } from "@/config/site";
import { getGuide, getAllGuides } from "@/lib/guides/content";
import { Calculator, ArrowRight, Clock, Calendar, ChevronRight } from "lucide-react";

export async function generateStaticParams() {
  return getAllGuides().map((g) => ({
    slug: g.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};

  return generatePageMetadata({
    title: guide.seoTitle,
    description: guide.description,
    path: `/guides/${slug}`,
    openGraph: {
      type: "article",
      publishedTime: guide.publishedAt,
    },
  });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const siteUrl = siteConfig.url;

  const breadcrumbItems = [
    { label: "Guides", href: "/guides" },
    { label: guide.title, href: `/guides/${slug}` },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    author: {
      "@type": "Person",
      name: "Ishan Bansal",
      url: `${siteUrl}/founder`,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteUrl,
      logo: `${siteUrl}/images/logo.png`,
    },
    datePublished: guide.publishedAt,
    dateModified: guide.publishedAt,
    mainEntityOfPage: `${siteUrl}/guides/${slug}`,
  };

  const faqSchema = guide.faqs && guide.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  } : null;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <Breadcrumbs items={breadcrumbItems} />

      <article className="mt-8">
        {/* Article Meta Header */}
        <div className="space-y-4 border-b border-border pb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <span className="px-3 py-1 bg-brand/10 text-brand rounded-full uppercase tracking-wider">
              {guide.category}
            </span>
            <span className="text-muted flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {guide.readTime}
            </span>
            <span className="text-muted flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Published {guide.publishedAt}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-navy tracking-tight leading-tight">
            {guide.title}
          </h1>

          <p className="text-lg sm:text-xl text-muted leading-relaxed font-normal">
            {guide.description}
          </p>

          <div className="text-xs text-slate-500 pt-2">
            By <Link href="/founder" className="text-brand font-semibold hover:underline">Ishan Bansal</Link> • Reviewed for deterministic accuracy on IndiaWise
          </div>
        </div>

        {/* Primary Calculator CTA Banner */}
        <div className="my-8 p-6 bg-gradient-to-r from-blue-50 via-indigo-50/40 to-white border border-blue-200 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-brand text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-brand">Interactive Tool Available</div>
              <div className="font-bold text-base text-navy">{guide.primaryCalculator.name}</div>
              <div className="text-xs text-muted">Run this calculation with your own live numbers</div>
            </div>
          </div>
          <Link
            href={guide.primaryCalculator.href}
            className="px-5 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md flex-shrink-0 flex items-center justify-center gap-2"
          >
            <span>{guide.primaryCalculator.cta}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Article Body */}
        <div className="space-y-10 text-slate-800 text-base sm:text-lg leading-relaxed pt-4">
          {guide.sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">
                {section.heading}
              </h2>
              {section.content.map((p, pIdx) => (
                <p key={pIdx} className="text-slate-700 leading-relaxed">
                  {p}
                </p>
              ))}

              {section.callout && (
                <div className={`p-5 rounded-2xl border my-6 ${
                  section.callout.type === 'caution'
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : section.callout.type === 'tip'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-blue-50 border-blue-200 text-blue-950'
                }`}>
                  <div className="font-bold text-sm mb-1">{section.callout.title}</div>
                  <div className="text-sm leading-relaxed opacity-90">{section.callout.text}</div>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Frequently Asked Questions */}
        {guide.faqs && guide.faqs.length > 0 && (
          <div className="mt-14 pt-10 border-t border-border">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {guide.faqs.map((faq, fIdx) => (
                <div key={fIdx} className="bg-alt/60 rounded-2xl p-5 border border-border">
                  <h3 className="text-base font-bold text-navy mb-2">{faq.question}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Calculators */}
        {guide.relatedCalculators && guide.relatedCalculators.length > 0 && (
          <div className="mt-14 pt-10 border-t border-border">
            <h2 className="text-xl sm:text-2xl font-bold text-navy mb-4">Related IndiaWise Calculators</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {guide.relatedCalculators.map((rel, rIdx) => (
                <Link
                  key={rIdx}
                  href={rel.href}
                  className="p-4 bg-white border border-border hover:border-brand rounded-2xl text-xs font-bold text-navy hover:text-brand transition-colors flex items-center justify-between shadow-2xs group"
                >
                  <span>{rel.name}</span>
                  <ChevronRight className="w-4 h-4 text-muted group-hover:text-brand transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
