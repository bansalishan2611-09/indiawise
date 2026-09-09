import { generatePageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

import { getCalculatorsByCategory } from "@/lib/calculators/registry";
import CalculatorCard from "@/components/calculator/CalculatorCard";
import { Search } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  
  return generatePageMetadata({
    title: `${slug} Calculators`,
    description: `Browse all our free, accurate ${slug} calculators designed for India.`,
    path: `/categories/${slug}`,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const calculators = getCalculatorsByCategory(slug);
  
  const breadcrumbItems = [
    { label: "Categories", href: "/categories" },
    { label: slug, href: `/categories/${slug}` },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="mt-6 mb-10">
        <h1 className="text-3xl font-bold text-navy capitalize">{slug.replace(/-/g, " ")} Calculators</h1>
        <p className="mt-2 text-muted">
          {calculators.length > 0 
            ? `Browse ${calculators.length} calculators in this category.`
            : `We are still building calculators for this category.`}
        </p>
      </div>

      {calculators.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {calculators.map(def => (
            <CalculatorCard key={def.slug} definition={def} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-border rounded-3xl bg-alt mb-16">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Search className="w-8 h-8 text-muted" />
          </div>
          <h2 className="text-xl font-bold text-navy mb-2">Coming Soon</h2>
          <p className="text-muted mb-8 max-w-md">
            We are working hard to bring you the best {slug} calculators. Check back soon!
          </p>
          <Link
            href="/calculators"
            className="inline-flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-hover transition-colors"
          >
            Browse Other Calculators
          </Link>
        </div>
      )}
    </div>
  );
}
