import { searchCalculators, getAllCalculators } from '@/lib/calculators/registry';
import { generatePageMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import CalculatorCard from '@/components/calculator/CalculatorCard';
import { Search } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const q = params?.q || '';
  return generatePageMetadata({
    title: q ? `"${q}" — Search Results | IndiaWise` : 'Search Calculators | IndiaWise',
    description: `Search results for ${q || 'calculators'} on IndiaWise.`,
    path: `/search`,
    noIndex: true,
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || '';
  const results = q ? searchCalculators(q) : [];
  
  // Get suggestions for the "Things you may like" section
  const allCalculators = getAllCalculators();
  const suggestions = allCalculators.slice(0, 3); // Just show the first 3 for now

  const breadcrumbItems = [
    { label: 'Search', href: '/search' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 mb-10">
        <h1 className="text-3xl font-bold text-navy">Search Results</h1>
        {q ? (
          <p className="mt-2 text-muted">
            {results.length > 0
              ? `Found ${results.length} calculator${results.length !== 1 ? 's' : ''} for `
              : 'No results found for '}
            <span className="font-semibold text-navy">"{q}"</span>
          </p>
        ) : (
          <p className="mt-2 text-muted">Enter a search term to find calculators.</p>
        )}
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {results.map(def => (
            <CalculatorCard key={def.slug} definition={def} />
          ))}
        </div>
      )}

      {q && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-border rounded-3xl bg-alt mb-16">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Search className="w-8 h-8 text-muted" />
          </div>
          <h2 className="text-xl font-bold text-navy mb-2">No calculators found</h2>
          <p className="text-muted mb-8 max-w-md">
            We couldn't find any calculators matching "{q}". Try a different keyword or browse our suggestions below.
          </p>
        </div>
      )}

      {!q && (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-border rounded-3xl bg-alt mb-16">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Search className="w-8 h-8 text-brand" />
          </div>
          <p className="text-navy font-semibold text-lg">Start typing to search for calculators.</p>
        </div>
      )}

      {/* Things You May Like Section */}
      <div className="mt-12 border-t border-border pt-12">
        <h2 className="text-2xl font-bold text-navy mb-2">Things you may like</h2>
        <p className="text-muted mb-8">Popular calculators to help you plan your finances.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map(def => (
            <CalculatorCard key={def.slug} definition={def} />
          ))}
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="mt-16 text-center">
        <p className="text-sm text-muted italic">
          * Make your future secure by calculating this (* this is not financial guaranteed advice)
        </p>
      </div>
    </div>
  );
}
