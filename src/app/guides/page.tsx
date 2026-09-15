import { generatePageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { BookOpen, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { getAllGuides } from "@/lib/guides/content";

export const metadata = generatePageMetadata({
  title: "Educational Financial Guides — Learn Before You Calculate",
  description: "Comprehensive, high-confidence personal finance guides for Indian taxpayers, homebuyers, and investors. Understand the math behind EMIs, SIPs, taxes, and financial health.",
  path: "/guides",
});

export default function AllGuidesPage() {
  const breadcrumbItems = [
    { label: "Guides", href: "/guides" },
  ];

  const guides = getAllGuides();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="mt-6 mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">Educational Financial Guides</h1>
        <p className="mt-2 text-muted text-base sm:text-lg max-w-2xl">
          Learn the methodology, formulas, and practical rules of thumb before calculating. Unbiased, deterministic financial education built for India.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {guides.map((guide) => (
          <Link 
            key={guide.slug}
            href={`/guides/${guide.slug}`} 
            className="group bg-white rounded-3xl p-6 sm:p-8 border border-border hover:border-brand hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-brand/10 text-brand text-xs font-bold rounded-full uppercase tracking-wider">
                  {guide.category}
                </span>
                <span className="text-xs text-muted flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {guide.readTime}
                </span>
              </div>
              <h2 className="text-xl font-bold text-navy mb-2 group-hover:text-brand transition-colors">
                {guide.title}
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-6">
                {guide.description}
              </p>
            </div>

            <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-brand">
              <span>Read Guide</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
