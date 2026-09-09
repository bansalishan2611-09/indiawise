import { generatePageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { BookOpen } from "lucide-react";

export const metadata = generatePageMetadata({
  title: "Educational Guides",
  description: "Learn before you calculate. Browse our comprehensive financial and educational guides.",
  path: "/guides",
});

export default function AllGuidesPage() {
  const breadcrumbItems = [
    { label: "Guides", href: "/guides" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="mt-6 mb-10">
        <h1 className="text-3xl font-bold text-navy">Educational Guides</h1>
        <p className="mt-2 text-muted">Learn before you calculate with our detailed guides.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a href="/guides/personal-finance-101" className="group bg-white rounded-3xl p-6 border border-border hover:border-brand hover:shadow-md transition-all duration-200">
          <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-brand" />
          </div>
          <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-brand transition-colors">Personal Finance 101</h3>
          <p className="text-sm text-muted leading-relaxed">Master the basics of saving, investing, and budgeting in India. A complete beginner's guide to managing money.</p>
        </a>

        <a href="/guides/understanding-income-tax" className="group bg-white rounded-3xl p-6 border border-border hover:border-brand hover:shadow-md transition-all duration-200">
          <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-brand" />
          </div>
          <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-brand transition-colors">Understanding Income Tax</h3>
          <p className="text-sm text-muted leading-relaxed">Learn how the Old vs New tax regimes work, standard deductions, and how to file your IT returns effectively.</p>
        </a>
      </div>
    </div>
  );
}
