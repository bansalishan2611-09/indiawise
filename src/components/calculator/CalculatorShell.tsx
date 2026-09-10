'use client';
import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { CalculatorDefinition, CalculatorResult, AmortizationRow, GrowthRow } from '@/lib/calculators/types';
import { getCalculateFn } from '@/lib/calculators/clientRegistry';
import CalculatorInputComponent from './CalculatorInput';
import ResultDisplay from './ResultDisplay';
import AmortizationSchedule from './AmortizationSchedule';
import GrowthChart from './GrowthChart';
import Link from 'next/link';
import { ChevronDown, Download } from 'lucide-react';
import { formatIndianCurrency, formatIndianNumber } from '@/lib/calculators/formatters';

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
  const searchParams = useSearchParams();

  const [values, setValues] = useState<Record<string, string | number>>(() => {
    const defaults = buildDefaults(definition);
    if (searchParams) {
      definition.inputs.forEach(i => {
        const val = searchParams.get(i.id);
        if (val !== null) {
          const num = parseFloat(val);
          if (!isNaN(num)) defaults[i.id] = num;
        }
        const unit = searchParams.get(`${i.id}_unit`);
        if (unit && i.unitOptions?.includes(unit)) {
          defaults[`${i.id}_unit`] = unit;
        }
      });
    }
    return defaults;
  });

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(() => {
    // Open advanced if any advanced parameter is present in URL
    if (searchParams) {
      return definition.inputs.some(i => i.isAdvanced && searchParams.has(i.id));
    }
    return false;
  });
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
    <div className="w-full" suppressHydrationWarning>
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
                suppressHydrationWarning
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
            <h2 className="text-lg font-bold text-navy">Results Summary</h2>
          </div>
          <ResultDisplay results={results} />
          
          {/* Premium Action Bar */}
          {results.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center gap-4 print:hidden">
              <button 
                onClick={() => window.print()}
                suppressHydrationWarning
                className="flex-1 w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-navy text-white rounded-xl text-sm font-bold shadow-sm hover:bg-brand transition-colors"
              >
                <Download className="w-4 h-4" />
                Save as PDF
              </button>
              <button 
                suppressHydrationWarning
                onClick={() => {
                  // Build URL with state parameters
                  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
                  const cleanPath = window.location.pathname;
                  const params = new URLSearchParams();
                  
                  definition.inputs.forEach(i => {
                    const val = values[i.id];
                    if (val !== undefined && val !== '') {
                      if (i.isAdvanced && (val === 0 || val === '0')) return;
                      params.set(i.id, val.toString());
                    }
                    const unit = values[`${i.id}_unit`];
                    if (unit) params.set(`${i.id}_unit`, unit.toString());
                  });
                  
                  const shareUrl = `${baseUrl}${cleanPath}?${params.toString()}`;
                  const genericUrl = `${baseUrl}${cleanPath}`;

                  // Build message lines
                  const lines: string[] = [];
                  lines.push(`*My ${definition.name} from IndiaWise:*`);
                  lines.push('');
                  lines.push(`*Inputs:*`);
                  
                  definition.inputs.forEach(input => {
                    const val = values[input.id];
                    if (val !== undefined && val !== '') {
                      // Omit advanced inputs that are 0
                      if (input.isAdvanced && (val === 0 || val === '0')) return;

                      const isCurr = input.unit === '₹';
                      const numVal = typeof val === 'string' ? parseFloat(val) : val;
                      const formattedVal = (!isNaN(numVal as number)) ? formatIndianNumber(numVal as number) : val;
                      const u = values[`${input.id}_unit`] ? ` ${values[`${input.id}_unit`]}` : (!isCurr && input.unit ? ` ${input.unit}` : '');
                      lines.push(`• *${input.label}:* ${isCurr ? '₹' : ''}${formattedVal}${u}`);
                    }
                  });
                  
                  lines.push('');
                  lines.push(`*Results:*`);
                  results.forEach(res => {
                    let resVal = res.value;
                    if (typeof res.value === 'number') {
                      resVal = res.isCurrency ? formatIndianCurrency(res.value) : formatIndianNumber(res.value);
                    } else if (res.isCurrency && !isNaN(parseFloat(res.value as string))) {
                      resVal = formatIndianCurrency(parseFloat(res.value as string));
                    }
                    lines.push(`• *${res.label}:* ${resVal}`);
                  });
                  
                  lines.push('');
                  lines.push(`*View My Calculation:*`);
                  lines.push(shareUrl);
                  
                  // Use map + join to explicitly encode each line
                  const rawText = lines.join('\n');
                  const encodedText = encodeURIComponent(rawText);
                  
                  // Use the official WhatsApp API link
                  window.open(`https://wa.me/?text=${encodedText}`, '_blank');
                }}
                className="flex-1 w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-green-500 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-green-600 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                Share on WhatsApp
              </button>
            </div>
          )}
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

    </div>
  );
}
