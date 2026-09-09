'use client';
import { useState, useCallback } from 'react';
import { CalculatorDefinition, CalculatorResult, AmortizationRow, GrowthRow } from '@/lib/calculators/types';
import { getCalculateFn } from '@/lib/calculators/clientRegistry';
import CalculatorInputComponent from './CalculatorInput';
import ResultDisplay from './ResultDisplay';
import AmortizationSchedule from './AmortizationSchedule';
import GrowthChart from './GrowthChart';
import Link from 'next/link';
import { ChevronDown, Printer } from 'lucide-react';

interface Props {
  definition: CalculatorDefinition;
  slug: string;
}

function buildDefaults(definition: CalculatorDefinition): Record<string, string | number> {
  const defaults: Record<string, string | number> = {};
  definition.inputs.forEach(i => {
    defaults[i.id] = i.defaultValue;
    if (i.unitOptions && i.unitOptions.length > 0) {
      defaults[`${i.id}_unit`] = i.unitOptions[0];
    }
  });
  return defaults;
}

export default function CalculatorShell({ definition, slug }: Props) {
  const [values, setValues] = useState<Record<string, string | number>>(buildDefaults(definition));
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [calcError, setCalcError] = useState<string | null>(null);

  const calculateFn = getCalculateFn(slug);

  let results: CalculatorResult[] = [];
  let amortization: any = undefined;
  let growthData: any = undefined;

  if (calculateFn) {
    try {
      const payload = calculateFn(values);
      results = payload.results || [];
      amortization = payload.amortization;
      growthData = payload.growthData;
    } catch {
      if (!calcError) setCalcError('Calculation error. Please check your inputs.');
    }
  }

  const handleChange = useCallback((id: string, value: string | number) => {
    setValues(prev => ({ ...prev, [id]: value }));
    setCalcError(null);
  }, []);

  const getCategoryHref = (slug: string) => {
    const def = definition;
    if (slug === 'gst-calculator') return `/calculators/tax/${slug}`;
    return `/calculators/${def.categorySlug}/${slug}`;
  };

  return (
    <div className="w-full">
      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block print:w-full">
        {/* Inputs (Hidden in Print) */}
        <div className="bg-white rounded-3xl border border-border p-8 space-y-6 h-fit shadow-sm print:hidden">
          <h2 className="text-lg font-bold text-navy border-b border-border pb-4 print:hidden">Enter Details</h2>
          {definition.inputs.filter(i => !i.isAdvanced).map(input => (
            <CalculatorInputComponent
              key={input.id}
              input={input}
              value={values[input.id]}
              unitValue={values[`${input.id}_unit`] as string}
              onChange={handleChange}
            />
          ))}

          {definition.inputs.some(i => i.isAdvanced) && (
            <div className="mt-6 border-t border-border pt-6 print:hidden">
              <button 
                onClick={() => setAdvancedOpen(!advancedOpen)}
                className="flex items-center justify-between w-full text-navy font-semibold text-lg hover:text-brand transition-colors"
              >
                Advanced Settings
                <ChevronDown className={`w-5 h-5 transition-transform ${advancedOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {advancedOpen && (
                <div className="mt-6 space-y-6">
                  {definition.inputs.filter(i => i.isAdvanced).map(input => (
                    <CalculatorInputComponent
                      key={input.id}
                      input={input}
                      value={values[input.id]}
                      unitValue={values[`${input.id}_unit`] as string}
                      onChange={handleChange}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {calcError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{calcError}</div>
          )}
        </div>

        {/* Print-only Inputs Summary */}
        <div className="hidden print:block mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-200">
          <h2 className="text-sm uppercase tracking-widest font-bold text-gray-400 mb-6 pb-2 border-b border-gray-200">Inputs Summary</h2>
          <div className="grid grid-cols-3 gap-y-6 gap-x-8">
            {definition.inputs.map(input => {
              const val = values[input.id];
              if (input.isAdvanced && (val === 0 || val === '0' || !val)) return null;
              
              const u = values[`${input.id}_unit`] ? ` ${values[`${input.id}_unit`]}` : (input.unit && input.unit !== '₹' ? ` ${input.unit}` : '');
              const isCurr = input.unit === '₹';
              return (
                <div key={input.id} className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">{input.label}</span>
                  <span className="font-mono text-base font-bold text-navy border-b border-gray-200 pb-1">
                    {isCurr ? '₹' : ''}{val}{u}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <div className="bg-alt rounded-3xl border border-border p-8 shadow-sm print:border-none print:shadow-none print:p-0 print:bg-transparent print:mb-6">
          <div className="flex justify-between items-center border-b border-border pb-4 mb-6 print:hidden">
            <h2 className="text-lg font-bold text-navy">Results</h2>
            {results.length > 0 && (
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 text-sm font-semibold text-brand hover:text-navy transition-colors print:hidden"
              >
                <Printer className="w-4 h-4" />
                Print Report
              </button>
            )}
          </div>
          <ResultDisplay results={results} />
        </div>
      </div>

      {/* Full Width Visualizations & Tables */}
      {growthData && <GrowthChart data={growthData} />}
      {amortization && <AmortizationSchedule data={amortization} />}

      {/* FAQs */}
      {definition.faqs && definition.faqs.length > 0 && (
        <div className="mt-16 print:hidden">
          <h2 className="text-2xl font-bold text-navy mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {definition.faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-border rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-navy hover:bg-alt transition-colors"
                  aria-expanded={openFaq === i}
                  suppressHydrationWarning
                >
                  {faq.question}
                  <ChevronDown className={`w-5 h-5 text-muted transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-muted leading-relaxed border-t border-border pt-4">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Calculators */}
      {definition.relatedCalculators && definition.relatedCalculators.length > 0 && (
        <div className="mt-12 print:hidden">
          <h2 className="text-2xl font-bold text-navy mb-6">Related Calculators</h2>
          <div className="flex flex-wrap gap-3">
            {definition.relatedCalculators.map(slug => (
              <Link
                key={slug}
                href={getCategoryHref(slug)}
                className="px-5 py-2.5 bg-white border border-border rounded-xl font-medium text-navy hover:border-brand hover:text-brand transition-colors capitalize"
              >
                {slug.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
