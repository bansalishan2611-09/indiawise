import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CalculatorDefinition } from '@/lib/calculators/types';
import Badge from '@/components/ui/Badge';

export default function CalculatorCard({ definition, href }: { definition: CalculatorDefinition; href?: string }) {
  const targetHref = href || `/calculators/${definition.categorySlug}/${definition.slug}`;
  return (
    <Link href={targetHref} className="group bg-white rounded-3xl p-6 border border-border hover:border-brand hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        <Badge variant="brand" className="mb-4">{definition.category}</Badge>
        <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-brand transition-colors">{definition.name}</h3>
        <p className="text-sm text-muted leading-relaxed">{definition.shortDescription}</p>
      </div>
      <div className="flex items-center gap-1 text-brand font-semibold text-sm mt-6">
        <span>Open Calculator</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
