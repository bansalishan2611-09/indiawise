import { generatePageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { getAllCalculators } from "@/lib/calculators/registry";
import CalculatorCard from "@/components/calculator/CalculatorCard";

export const metadata = generatePageMetadata({
  title: "All Calculators",
  description: "Find the right calculator for your next decision. Fast, accurate utilities designed for India.",
  path: "/calculators",
});

export default function AllCalculatorsPage() {
  const breadcrumbItems = [
    { label: "Calculators", href: "/calculators" },
  ];
  const calculators = getAllCalculators();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="mt-6 mb-10">
        <h1 className="text-3xl font-bold text-navy">All Calculators</h1>
        <p className="mt-2 text-muted">Find the right calculator for your next decision.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map(def => (
          <CalculatorCard key={def.slug} definition={def} />
        ))}
      </div>
    </div>
  );
}
