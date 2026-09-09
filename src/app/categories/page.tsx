import { generatePageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import CategoryCard from "@/components/calculator/CategoryCard";
import { Landmark, Briefcase, Receipt, GraduationCap, Building2, Calculator as CalcIcon } from "lucide-react";
import { getCalculatorsByCategory } from "@/lib/calculators/registry";

export const metadata = generatePageMetadata({
  title: "All Categories",
  description: "Browse all calculator categories on IndiaWise.",
  path: "/categories",
});

export default function AllCategoriesPage() {
  const breadcrumbItems = [
    { label: "Categories", href: "/categories" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="mt-6 mb-10">
        <h1 className="text-3xl font-bold text-navy">All Categories</h1>
        <p className="mt-2 text-muted">Browse calculators by category.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CategoryCard slug="finance" name="Finance" description="EMI, SIP, Loans, and Investment planners." icon={<Landmark className="w-6 h-6" />} count={getCalculatorsByCategory('finance').length} />
        <CategoryCard slug="salary" name="Salary" description="In-hand salary, CTC, and increment calculators." icon={<Briefcase className="w-6 h-6" />} count={getCalculatorsByCategory('salary').length} />
        <CategoryCard slug="tax" name="Tax" description="GST, Income Tax, and deductions." icon={<Receipt className="w-6 h-6" />} count={getCalculatorsByCategory('tax').length} />
        <CategoryCard slug="education" name="Education" description="Student loans and college cost planners." icon={<GraduationCap className="w-6 h-6" />} count={getCalculatorsByCategory('education').length} />
        <CategoryCard slug="business" name="Business" description="Margin, markup, and break-even analysis." icon={<Building2 className="w-6 h-6" />} count={getCalculatorsByCategory('business').length} />
        <CategoryCard slug="everyday" name="Everyday" description="Age, percentage, and quick math utilities." icon={<CalcIcon className="w-6 h-6" />} count={getCalculatorsByCategory('everyday').length} />
      </div>
    </div>
  );
}
