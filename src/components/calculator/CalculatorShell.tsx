'use client';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { CalculatorDefinition, CalculatorResult, AmortizationRow, GrowthRow } from '@/lib/calculators/types';
import { getCalculateFn } from '@/lib/calculators/clientRegistry';
import CalculatorInputComponent from './CalculatorInput';
import ResultDisplay from './ResultDisplay';
import AmortizationSchedule from './AmortizationSchedule';
import GrowthChart from './GrowthChart';
import WhatIfPanel from './WhatIfPanel';
import { FDComparePanel } from './FDComparePanel';
import CalculatorPrintReport from './CalculatorPrintReport';
import { ChevronDown, Download, Copy, Check, Lock, Calculator, User, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatIndianCurrency, formatIndianNumber } from '@/lib/calculators/formatters';
import { sanitizeShareName, formatShareHeading } from '@/lib/calculators/share-utils';

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
  if (definition.whatIf) {
    defaults[definition.whatIf.id] = definition.whatIf.defaultValue;
  }
  return defaults;
}

function extractValuesFromSearchParams(
  definition: CalculatorDefinition,
  searchParams: URLSearchParams | ReturnType<typeof useSearchParams>
): Record<string, string | number> {
  const defaults = buildDefaults(definition);
  if (!searchParams) return defaults;

  const getParam = (id: string, aliases: string[] = []): string | null => {
    let val = searchParams.get(id);
    if (val !== null) return val;
    for (const a of aliases) {
      val = searchParams.get(a);
      if (val !== null) return val;
    }
    return null;
  };

  definition.inputs.forEach(i => {
    const aliases: string[] = [];
    if (i.id === 'loanAmount') aliases.push('amount', 'principal');
    if (i.id === 'interestRate') aliases.push('rate');
    if (i.id === 'expectedReturn') aliases.push('expectedReturnRate', 'rate', 'interestRate');
    if (i.id === 'duration' || i.id === 'timePeriod') aliases.push('tenure', 'years');
    if (i.id === 'amount') aliases.push('baseAmount');
    if (i.id === 'cost') aliases.push('costOfGoods');
    if (i.id === 'calculationType') aliases.push('gstMode');

    const val = getParam(i.id, aliases);
    if (val !== null) {
      if (i.type === 'number') {
        const num = parseFloat(val);
        if (!isNaN(num)) defaults[i.id] = num;
      } else {
        if (i.id === 'calculationType') {
          defaults[i.id] = (val === 'remove' || val === 'inclusive') ? 'inclusive' : 'exclusive';
        } else {
          defaults[i.id] = val;
        }
      }
    }

    const unit = searchParams.get(`${i.id}_unit`);
    if (unit && i.unitOptions?.includes(unit)) {
      defaults[`${i.id}_unit`] = unit;
    }
  });

  if (definition.whatIf) {
    const whatIfAliases: string[] = [];
    if (definition.whatIf.id === 'extraPayment') whatIfAliases.push('extra', 'extraEmi');
    if (definition.whatIf.id === 'extraInvestment') whatIfAliases.push('extraSip', 'extraRd');
    if (definition.whatIf.id === 'extraWeight') whatIfAliases.push('weightChange');
    if (definition.whatIf.id === 'hikePercentage') whatIfAliases.push('hike', 'salaryHike');

    const whatIfVal = getParam(definition.whatIf.id, whatIfAliases);
    if (whatIfVal !== null) {
      const num = parseFloat(whatIfVal);
      if (!isNaN(num)) defaults[definition.whatIf.id] = num;
    }

    if (definition.whatIf.type === 'fd-compare') {
      ['compareAmount', 'compareRate', 'compareTenure'].forEach(id => {
        const val = searchParams.get(id);
        if (val !== null) {
          const num = parseFloat(val);
          if (!isNaN(num)) defaults[id] = num;
        }
      });
      if (searchParams.has('compareAmount') || searchParams.has('compareRate') || searchParams.has('compareTenure')) {
        defaults.fdCompareActive = 1;
      }
    }
  }

  return defaults;
}

export default function CalculatorShell({ definition, slug }: Props) {
  const searchParams = useSearchParams();

  // Deterministic initial state matching SSR
  const [values, setValues] = useState<Record<string, string | number>>(() => buildDefaults(definition));
  const [shareName, setShareName] = useState<string>('');
  const [originalSharer, setOriginalSharer] = useState<string>('');
  const [isReadOnlyView, setIsReadOnlyView] = useState<boolean>(false);
  const [shareMode, setShareMode] = useState<'readonly' | 'editable'>('editable');
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);
  const [calcError, setCalcError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Client-side hydration & search parameters synchronization
  useEffect(() => {
    setIsMounted(true);
    const searchString = (typeof window !== 'undefined' && window.location.search)
      ? window.location.search.slice(1)
      : (searchParams?.toString() || '');
    if (!searchString) return;

    const sp = new URLSearchParams(searchString);
    setValues(extractValuesFromSearchParams(definition, sp));

    const nameParam = sp.get('name') || sp.get('Name') || sp.get('sender') || sp.get('user') || sp.get('by') || sp.get('sharedBy');
    if (nameParam) {
      const clean = sanitizeShareName(nameParam);
      setOriginalSharer(clean);
      setShareName(clean);
    }

    const isReadOnly = sp.get('mode') === 'readonly' || 
                       sp.get('shareMode') === 'readonly' || 
                       sp.get('readonly') === 'true' || 
                       sp.get('view') === 'readonly';
    if (isReadOnly) {
      setIsReadOnlyView(true);
      setShareMode('readonly');
    } else {
      setIsReadOnlyView(false);
      setShareMode('editable');
    }

    const hasAdvanced = definition.inputs.some(i => i.isAdvanced && sp.has(i.id));
    if (hasAdvanced) {
      setAdvancedOpen(true);
    }
  }, [searchParams, definition]);

  const cleanPath = `/calculators/${definition.categorySlug}/${definition.slug}`;
  const calculateFn = getCalculateFn(slug);

  // Derive attribution & remix status
  const isInteractiveRemix = Boolean(originalSharer) && !isReadOnlyView;
  const baseSharer = originalSharer ? originalSharer.replace(/\s*-\s*Remix$/i, '').trim() : '';

  const effectiveShareName = useMemo(() => {
    if (isReadOnlyView) {
      return originalSharer ? sanitizeShareName(originalSharer) : sanitizeShareName(shareName);
    }
    if (isInteractiveRemix) {
      return `${baseSharer} - Remix`;
    }
    return sanitizeShareName(shareName);
  }, [isReadOnlyView, isInteractiveRemix, originalSharer, baseSharer, shareName]);

  // URL for recipient to calculate their own values starting from a read-only snapshot
  const calculateYoursUrl = useMemo(() => {
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
    if (definition.whatIf && values[definition.whatIf.id]) {
      params.set(definition.whatIf.id, values[definition.whatIf.id].toString());
      if (definition.whatIf.type === 'fd-compare') {
        ['compareAmount', 'compareRate', 'compareTenure'].forEach(id => {
          if (values[id] !== undefined && values[id] !== '') {
            params.set(id, values[id].toString());
          }
        });
      }
    }
    const sharer = baseSharer || sanitizeShareName(shareName);
    if (sharer) {
      params.set('name', `${sharer} - Remix`);
    }
    params.set('mode', 'editable');
    return `${cleanPath}?${params.toString()}`;
  }, [cleanPath, definition, values, baseSharer, shareName]);

  let results: CalculatorResult[] = [];
  let whatIfResults: CalculatorResult[] | undefined = undefined;
  let amortization: AmortizationRow[] | undefined = undefined;
  let growthData: GrowthRow[] | undefined = undefined;

  if (calculateFn) {
    try {
      const payload = calculateFn(values);
      results = payload.results || [];
      whatIfResults = payload.whatIfResults;
      amortization = payload.amortization;
      growthData = payload.growthData;
    } catch {
      if (!calcError) setCalcError('Calculation error. Please check your inputs.');
    }
  }

  const handleChange = useCallback((id: string, value: string | number) => {
    if (isReadOnlyView) return; // Hard security: immutable state in readOnly mode
    setValues(prev => ({ ...prev, [id]: value }));
    setCalcError(null);
  }, [isReadOnlyView]);

  const buildShareUrl = useCallback(() => {
    const baseUrl = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_SITE_URL || window.location.origin) : '';
    const cleanPath = typeof window !== 'undefined' ? window.location.pathname : `/calculators/${definition.categorySlug}/${definition.slug}`;
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

    if (definition.whatIf && values[definition.whatIf.id]) {
      params.set(definition.whatIf.id, values[definition.whatIf.id].toString());
      if (definition.whatIf.type === 'fd-compare') {
        ['compareAmount', 'compareRate', 'compareTenure'].forEach(id => {
          if (values[id] !== undefined && values[id] !== '') {
            params.set(id, values[id].toString());
          }
        });
      }
    }

    if (effectiveShareName) {
      params.set('name', effectiveShareName);
    }

    if (shareMode === 'readonly') {
      params.set('mode', 'readonly');
    } else if (shareMode === 'editable') {
      params.set('mode', 'editable');
    }

    const qs = params.toString();
    return qs ? `${baseUrl}${cleanPath}?${qs}` : `${baseUrl}${cleanPath}`;
  }, [definition, values, effectiveShareName, shareMode]);

  // Real-time synchronization of browser address bar with current calculation parameters & share name
  useEffect(() => {
    if (!isMounted) return;
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.history?.replaceState) {
        const url = buildShareUrl();
        window.history.replaceState(null, '', url);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [values, effectiveShareName, shareMode, isMounted, buildShareUrl]);

  const handleWhatsAppShare = useCallback(() => {
    const shareUrl = buildShareUrl();
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState(null, '', shareUrl);
    }
    const lines: string[] = [];
    const shareHeading = formatShareHeading(effectiveShareName, definition.name);
    const modeTag = shareMode === 'readonly' ? ' (Read-Only Snapshot)' : ' (Interactive Calculation)';
    lines.push(`*${shareHeading}${modeTag}:*`);
    lines.push('');
    lines.push(`*Inputs:*`);

    definition.inputs.forEach(input => {
      const val = values[input.id];
      if (val !== undefined && val !== '') {
        if (input.isAdvanced && (val === 0 || val === '0')) return;
        const isCurr = input.unit === '₹';
        const numVal = typeof val === 'string' ? parseFloat(val) : val;
        const formattedVal = (!isNaN(numVal as number)) ? formatIndianNumber(numVal as number) : val;
        const u = values[`${input.id}_unit`] ? ` ${values[`${input.id}_unit`]}` : (!isCurr && input.unit ? ` ${input.unit}` : '');
        lines.push(`• *${input.label}:* ${isCurr ? '₹' : ''}${formattedVal}${u}`);
      }
    });

    lines.push('');
    lines.push(`*Original Calculation:*`);
    results.forEach(res => {
      let resVal = res.value;
      if (typeof res.value === 'number') {
        resVal = res.isCurrency ? formatIndianCurrency(res.value) : formatIndianNumber(res.value);
      } else if (res.isCurrency && !isNaN(parseFloat(res.value as string))) {
        resVal = formatIndianCurrency(parseFloat(res.value as string));
      }
      lines.push(`• *${res.label}:* ${resVal}`);
    });

    if (definition.whatIf && values[definition.whatIf.id] && whatIfResults && whatIfResults.length > 0) {
      lines.push('');
      lines.push(`*What-If Scenario:*`);
      const wi = definition.whatIf;

      if (wi.type === 'fd-compare') {
        if (values['compareAmount']) lines.push(`• *Compare Amount:* ₹${formatIndianNumber(Number(values['compareAmount']))}`);
        if (values['compareRate']) lines.push(`• *Compare Rate:* ${values['compareRate']}%`);
        if (values['compareTenure']) lines.push(`• *Compare Tenure:* ${values['compareTenure']} Years`);
      } else {
        const val = values[wi.id];
        const formattedVal = formatIndianNumber(typeof val === 'string' ? parseFloat(val) : val as number);
        lines.push(`• *${wi.label}:* ${(wi.unit === '₹' || wi.unit === 'Rs.') ? '₹' : ''}${formattedVal}`);
      }

      whatIfResults.forEach(res => {
        let resVal = res.value;
        if (res.unit === 'Months' && typeof res.value === 'number') {
          const y = Math.floor(res.value / 12);
          const m = res.value % 12;
          resVal = m > 0 ? (y > 0 ? `${y} years ${m} months` : `${m} months`) : `${y} years`;
        } else if (typeof res.value === 'number') {
          resVal = res.isCurrency ? formatIndianCurrency(res.value) : formatIndianNumber(res.value);
        }
        lines.push(`• *${res.label}:* ${resVal}`);
      });
    }

    lines.push('');
    if (shareMode === 'readonly') {
      lines.push(`*🔒 View Read-Only Snapshot:*`);
    } else {
      lines.push(`*✏️ View Interactive Calculation (Editable):*`);
    }
    lines.push(shareUrl);

    const rawText = lines.join('\n');
    const encodedText = encodeURIComponent(rawText);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  }, [buildShareUrl, definition, effectiveShareName, results, shareMode, values, whatIfResults]);

  const handleCopyLink = useCallback(async () => {
    const shareUrl = buildShareUrl();
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState(null, '', shareUrl);
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      // clipboard fallback
    }
  }, [buildShareUrl]);

  return (
    <div className="w-full" suppressHydrationWarning>
      
      {/* ========================================================================= */}
      {/* DEDICATED OFFICIAL PRINT / PDF REPORT (Visible ONLY during window.print)   */}
      {/* ========================================================================= */}
      <div className="hidden print:block w-full">
        <CalculatorPrintReport
          definition={definition}
          values={values}
          results={results}
          whatIfResults={whatIfResults}
          amortization={amortization}
          growthData={growthData}
          shareName={effectiveShareName}
          shareMode={shareMode}
        />
      </div>

      {/* ========================================================================= */}
      {/* BROWSER INTERACTIVE UI (Hidden during window.print)                       */}
      {/* ========================================================================= */}
      <div className="print:hidden">

        {/* 1. Prominent Read-Only Shared Snapshot Banner */}
        {isMounted && isReadOnlyView && (
          <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-blue-50 via-indigo-50/40 to-blue-50 border border-blue-200 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-blue-950 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-brand flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Lock className="w-5 h-5 text-brand" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base text-navy">Shared Calculation Snapshot</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Read-Only
                  </span>
                </div>
                <p className="text-xs text-blue-800/80 mt-0.5">
                  {effectiveShareName 
                    ? `Viewing calculation shared by ${effectiveShareName}. All parameters and results are locked.` 
                    : 'Viewing shared calculation snapshot. All parameters and results are locked.'}
                </p>
              </div>
            </div>
            <a
              href={calculateYoursUrl}
              className="px-5 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md flex-shrink-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Yours →</span>
            </a>
          </div>
        )}

        {/* 2. Prominent Editable Shared Calculation Banner */}
        {isMounted && !isReadOnlyView && Boolean(originalSharer) && (
          <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50/40 to-blue-50 border border-emerald-200 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-emerald-950 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
                <User className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base text-navy">
                    Calculation Shared by {baseSharer || originalSharer}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    ✏️ Interactive Remix
                  </span>
                </div>
                <p className="text-xs text-emerald-900/80 mt-0.5">
                  Pre-filled with <strong>{baseSharer || originalSharer}</strong>&apos;s scenario. Adjust the numbers below to calculate your own version — re-shares will be attributed as <strong>{effectiveShareName}</strong>!
                </p>
              </div>
            </div>
            <a
              href={cleanPath}
              className="px-4 py-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl font-bold text-xs transition-all shadow-2xs flex-shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
              title="Reset all inputs to standard defaults"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </a>
          </div>
        )}
        
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          
          {/* Inputs Column */}
          <div className="bg-white rounded-3xl border border-border p-8 space-y-6 h-fit shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-lg font-bold text-navy">Enter Details</h2>
              {isMounted && isReadOnlyView && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                  <Lock className="w-3 h-3 text-amber-600" /> Locked Inputs
                </span>
              )}
            </div>

            {definition.inputs.filter(i => !i.isAdvanced).map(input => (
              <CalculatorInputComponent
                key={input.id}
                input={input}
                value={values[input.id]}
                unitValue={values[`${input.id}_unit`] as string}
                onChange={handleChange}
                readOnly={isReadOnlyView}
              />
            ))}

            {definition.inputs.some(i => i.isAdvanced) && (
              <div className="mt-6 border-t border-border pt-6">
                <button 
                  onClick={() => setAdvancedOpen(!advancedOpen)}
                  suppressHydrationWarning
                  className="flex items-center justify-between w-full text-navy font-semibold text-lg hover:text-brand transition-colors cursor-pointer"
                >
                  <span>Advanced Settings</span>
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
                        readOnly={isReadOnlyView}
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

          {/* Results Column */}
          <div className="bg-alt rounded-3xl border border-border p-6 sm:p-8 shadow-sm">
            <div className="border-b border-border pb-5 mb-6 space-y-4">
              
              {/* Row 1: Heading & Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-navy">Results Summary</h2>
                  {isMounted && effectiveShareName ? (
                    <p className="text-xs text-brand font-bold mt-0.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-brand flex-shrink-0" />
                      <span>Calculation for <strong>{effectiveShareName}</strong></span>
                    </p>
                  ) : (
                    <p className="text-xs text-muted mt-0.5">
                      Live calculation updated in real time
                    </p>
                  )}
                </div>

                {results.length > 0 && (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => window.print()}
                      suppressHydrationWarning
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-navy text-white rounded-xl text-xs font-bold shadow-xs hover:bg-brand transition-colors cursor-pointer"
                      title="Save or print formal PDF report"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Save PDF</span>
                    </button>

                    <button 
                      suppressHydrationWarning
                      onClick={handleWhatsAppShare}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                      title="Share calculation snapshot via WhatsApp"
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                      </svg>
                      <span>WhatsApp</span>
                    </button>

                    <button 
                      suppressHydrationWarning
                      onClick={handleCopyLink}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-navy rounded-xl text-xs font-bold shadow-xs border border-border hover:bg-slate-50 transition-colors cursor-pointer"
                      title="Copy calculation link"
                    >
                      {copySuccess ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-navy" />}
                      <span>{copySuccess ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Row 2: Clean Personalization & Sharing Mode Bar */}
              {results.length > 0 && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-white border border-border rounded-2xl p-2 sm:px-3 text-xs shadow-2xs">
                  {/* Name: Locked in Read-Only mode and in Interactive Remix mode. Editable only for original creator */}
                  {isMounted && (isReadOnlyView || Boolean(originalSharer)) ? (
                    <div 
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-not-allowed",
                        isReadOnlyView
                          ? "bg-slate-100/90 text-slate-700 border-border/80"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                      )}
                      title={isReadOnlyView ? "Locked read-only calculation snapshot" : "Original creator attribution is locked as Remix"}
                    >
                      <User className={cn("w-3.5 h-3.5 flex-shrink-0", isReadOnlyView ? "text-slate-500" : "text-emerald-600")} />
                      <span className="truncate max-w-[170px]">{effectiveShareName || 'Shared Calculation'}</span>
                      <Lock className={cn("w-3 h-3 ml-0.5 flex-shrink-0", isReadOnlyView ? "text-slate-400" : "text-emerald-500")} />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <User className="w-4 h-4 text-muted flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Your name (optional)"
                        maxLength={30}
                        value={shareName}
                        onChange={(e) => setShareName(e.target.value)}
                        suppressHydrationWarning
                        className="w-full sm:max-w-[200px] px-2.5 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-border rounded-lg text-navy placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand transition-all"
                        title="Optional: Name to personalize your WhatsApp message, PDF report & share link"
                      />
                    </div>
                  )}

                  {/* Mode Selector: Disabled & Locked in Read-Only mode */}
                  <div className="flex items-center justify-end gap-1.5 flex-shrink-0 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-border/50">
                    <span className="text-[11px] font-medium text-muted">Share as:</span>
                    <div className={cn(
                      "inline-flex items-center bg-slate-100 p-0.5 rounded-lg border border-border/70 text-xs font-medium",
                      isReadOnlyView && "opacity-85 cursor-not-allowed"
                    )}>
                      <button
                        type="button"
                        disabled={isReadOnlyView}
                        onClick={() => !isReadOnlyView && setShareMode('editable')}
                        suppressHydrationWarning
                        className={cn(
                          "px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 text-xs",
                          isReadOnlyView
                            ? "text-slate-400 cursor-not-allowed"
                            : (shareMode === 'editable'
                                ? 'bg-white text-navy font-bold shadow-2xs border border-border/60 cursor-pointer'
                                : 'text-muted hover:text-navy cursor-pointer')
                        )}
                        title={isReadOnlyView ? "Mode is locked for this shared calculation" : "Recipient receives interactive calculation and can calculate their own"}
                      >
                        <Calculator className="w-3 h-3 text-slate-400" />
                        <span>Calculate Yours</span>
                      </button>
                      <button
                        type="button"
                        disabled={isReadOnlyView}
                        onClick={() => !isReadOnlyView && setShareMode('readonly')}
                        suppressHydrationWarning
                        className={cn(
                          "px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 text-xs",
                          isReadOnlyView
                            ? "bg-white text-navy font-bold shadow-2xs border border-border/60 cursor-not-allowed"
                            : (shareMode === 'readonly'
                                ? 'bg-white text-navy font-bold shadow-2xs border border-border/60 cursor-pointer'
                                : 'text-muted hover:text-navy cursor-pointer')
                        )}
                        title={isReadOnlyView ? "Locked Read-Only Snapshot" : "Recipient receives a locked calculation snapshot with a Calculate Yours button"}
                      >
                        <Lock className="w-3 h-3 text-amber-600" />
                        <span>Read Only</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <ResultDisplay results={results} />
          </div>
        </div>

        {/* What-If Section */}
        {definition.whatIf && (
          <div className="mt-8">
            {definition.whatIf.type === 'fd-compare' ? (
              <FDComparePanel 
                config={definition.whatIf}
                values={values}
                onChange={handleChange}
                originalResults={results}
                whatIfResults={whatIfResults}
                readOnly={isReadOnlyView}
              />
            ) : (
              <WhatIfPanel 
                config={definition.whatIf} 
                value={values[definition.whatIf.id] as number}
                onChange={handleChange}
                originalResults={results}
                whatIfResults={whatIfResults}
                readOnly={isReadOnlyView}
              />
            )}
          </div>
        )}

        {/* Full Width Visualizations & Tables */}
        {growthData && <GrowthChart data={growthData} />}
        {amortization && <AmortizationSchedule data={amortization} />}

        {/* FAQs */}
        {definition.faqs && definition.faqs.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-navy mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {definition.faqs.map((faq, i) => (
                <div key={i} className="bg-white border border-border rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-navy hover:bg-alt transition-colors cursor-pointer"
                    aria-expanded={openFaq === i}
                    suppressHydrationWarning
                  >
                    <span>{faq.question}</span>
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

    </div>
  );
}

