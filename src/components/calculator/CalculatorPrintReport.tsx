'use client';

import React from 'react';
import { CalculatorDefinition, CalculatorResult, AmortizationRow, GrowthRow } from '@/lib/calculators/types';
import { formatIndianCurrency, formatIndianNumber } from '@/lib/calculators/formatters';
import { formatShareHeading, sanitizeShareName } from '@/lib/calculators/share-utils';
import { ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface CalculatorPrintReportProps {
  definition: CalculatorDefinition;
  values: Record<string, string | number>;
  results: CalculatorResult[];
  whatIfResults?: CalculatorResult[];
  amortization?: AmortizationRow[];
  growthData?: GrowthRow[];
  shareName?: string;
  shareMode?: 'readonly' | 'editable';
}

function formatResultValue(result: CalculatorResult): string {
  if (typeof result.value === 'string') return result.value;
  if (result.isCurrency) return formatIndianCurrency(result.value as number);
  return formatIndianNumber(result.value as number);
}

// Category-specific or calculator-specific formula and methodology details
function getFormulaInfo(slug: string, category: string, definition: CalculatorDefinition): {
  formulaTitle: string;
  formulaMath: string;
  variables: { sym: string; desc: string }[];
  methodologyText: string;
} {
  switch (slug) {
    case 'home-loan-emi':
    case 'personal-loan':
    case 'student-loan':
      return {
        formulaTitle: 'Standard Monthly Reducing Balance EMI Methodology',
        formulaMath: 'EMI = [P × R × (1 + R)^N] / [(1 + R)^N - 1]',
        variables: [
          { sym: 'P', desc: 'Principal loan amount sanctioned' },
          { sym: 'R', desc: 'Monthly interest rate (Annual Rate ÷ 12 ÷ 100)' },
          { sym: 'N', desc: 'Loan tenure in total months (Years × 12)' },
        ],
        methodologyText: 'Interest is charged only on the reducing outstanding principal at the end of each monthly cycle. With each EMI installment, the interest portion declines and the principal repayment portion progressively increases.',
      };

    case 'sip':
      return {
        formulaTitle: 'Compound Future Value of an Annuity-Due Methodology',
        formulaMath: 'M = P × [((1 + i)^n - 1) / i] × (1 + i)',
        variables: [
          { sym: 'M', desc: 'Expected maturity amount at end of tenure' },
          { sym: 'P', desc: 'Monthly SIP installment amount' },
          { sym: 'i', desc: 'Monthly rate of return (Expected Annual Return ÷ 12 ÷ 100)' },
          { sym: 'n', desc: 'Total number of monthly installments (Years × 12)' },
        ],
        methodologyText: 'Calculated assuming disciplined monthly investments at the beginning of each period with monthly compounding of returns. Mutual fund returns are market-linked and subject to standard volatility.',
      };

    case 'fd':
      return {
        formulaTitle: 'Quarterly Compounded Fixed Deposit Methodology',
        formulaMath: 'A = P × (1 + r / n)^(n × t)',
        variables: [
          { sym: 'A', desc: 'Final maturity amount payable on completion' },
          { sym: 'P', desc: 'Principal deposit amount' },
          { sym: 'r', desc: 'Annual interest rate (in decimal form)' },
          { sym: 'n', desc: 'Compounding frequency per annum (n = 4 for standard Indian quarterly bank compounding)' },
          { sym: 't', desc: 'Tenure in years' },
        ],
        methodologyText: 'As per Reserve Bank of India (RBI) guidelines, interest on fixed deposits of 6 months and above is compounded quarterly across scheduled commercial banks.',
      };

    case 'rd':
      return {
        formulaTitle: 'Recurring Deposit Maturity Methodology (RBI Standard)',
        formulaMath: 'M = P × n + P × [(n × (n + 1)) / (2 × 12)] × (r / 100)',
        variables: [
          { sym: 'M', desc: 'Total maturity proceeds received' },
          { sym: 'P', desc: 'Fixed monthly deposit installment' },
          { sym: 'n', desc: 'Tenure expressed in months' },
          { sym: 'r', desc: 'Annual rate of interest' },
        ],
        methodologyText: 'Each installment earns interest for the duration it remains with the bank, compounded quarterly according to standard banking conventions.',
      };

    case 'gst':
      return {
        formulaTitle: 'Goods and Services Tax (GST) Statutory Computation Rules',
        formulaMath: 'GST (Exclusive) = (Amount × Rate) / 100  |  GST (Inclusive) = Amount - [Amount × 100 / (100 + Rate)]',
        variables: [
          { sym: 'CGST', desc: 'Central GST (50% of total GST for intra-state supply)' },
          { sym: 'SGST', desc: 'State GST (50% of total GST for intra-state supply)' },
          { sym: 'IGST', desc: 'Integrated GST (100% of GST for inter-state supply)' },
        ],
        methodologyText: 'Applies statutory GST slabs (5%, 12%, 18%, 28%) prescribed by the GST Council of India, computing intra-state equal 50:50 apportionment between CGST and SGST.',
      };

    case 'income-tax':
      return {
        formulaTitle: 'Finance Act Income Tax Progressive Slab Assessment',
        formulaMath: 'Tax = Σ(Taxable Income in Slab × Slab Rate) + 4% Cess - 87A Rebate',
        variables: [
          { sym: 'Standard Deduction', desc: '₹75,000 under New Tax Regime; ₹50,000 under Old Regime' },
          { sym: 'Section 87A', desc: 'Full tax rebate for taxable income up to ₹7,00,000 in New Regime' },
          { sym: 'Cess', desc: 'Mandatory 4% Health & Education Cess applied on total computed tax' },
        ],
        methodologyText: 'Computed deterministically according to the latest Indian union budget tax slabs, comparing progressive tax rates, deductions, and applicable statutory cess.',
      };

    case 'salary':
      return {
        formulaTitle: 'Cost-to-Company (CTC) to Net Take-Home Derivation',
        formulaMath: 'Net Monthly Salary = (CTC - Employer EPF - Gratuity) ÷ 12 - Employee EPF - PT - TDS',
        variables: [
          { sym: 'EPF', desc: 'Employee Provident Fund (12% of Basic + DA)' },
          { sym: 'PT', desc: 'Professional Tax (state-governed statutory deduction up to ₹2,500/year)' },
          { sym: 'TDS', desc: 'Tax Deducted at Source based on estimated annual income tax liability' },
        ],
        methodologyText: 'Separates gross CTC from actual monthly cash credited to bank account, factoring in statutory social security deductions and monthly withholding tax.',
      };

    case 'bmi':
      return {
        formulaTitle: 'Body Mass Index (BMI) Quetelet Methodology',
        formulaMath: 'BMI = Weight in Kilograms / (Height in Metres)²',
        variables: [
          { sym: 'Underweight', desc: '< 18.5 kg/m²' },
          { sym: 'Normal (Asian)', desc: '18.5 – 22.9 kg/m² (WHO Asian-Indian criteria)' },
          { sym: 'Overweight (Asian)', desc: '23.0 – 24.9 kg/m²' },
          { sym: 'Obese (Asian)', desc: '≥ 25.0 kg/m²' },
        ],
        methodologyText: 'Uses WHO and Indian Ministry of Health & Family Welfare Asian-specific cut-offs, reflecting higher abdominal adiposity risks at lower BMI thresholds in South Asian populations.',
      };

    case 'margin':
      return {
        formulaTitle: 'Commercial Gross Margin & Markup Formulation',
        formulaMath: 'Gross Margin (%) = [(Revenue - Cost) / Revenue] × 100  |  Markup (%) = [(Revenue - Cost) / Cost] × 100',
        variables: [
          { sym: 'Revenue', desc: 'Total selling price charged to customer' },
          { sym: 'Cost (COGS)', desc: 'Direct cost of goods or services sold' },
          { sym: 'Gross Profit', desc: 'Absolute cash surplus (Revenue - Cost)' },
        ],
        methodologyText: 'Margin measures profit as a percentage of top-line selling price, whereas markup measures profit as a percentage of base production cost.',
      };

    case 'age':
      return {
        formulaTitle: 'Precise Chronological Gregorian Calendar Interval',
        formulaMath: 'Interval = Target Date - Date of Birth (Accounting for leap years & variable month lengths)',
        variables: [
          { sym: 'Completed Years', desc: 'Full 12-month solar cycles elapsed' },
          { sym: 'Completed Months', desc: 'Calendar month increments elapsed in current cycle' },
          { sym: 'Completed Days', desc: 'Exact day differences based on specific calendar month durations' },
        ],
        methodologyText: 'Executes exact calendar arithmetic accounting for Gregorian leap years (366 days) and specific month lengths (28, 29, 30, 31 days).',
      };

    default:
      return {
        formulaTitle: `${definition.name} Methodology`,
        formulaMath: definition.shortDescription,
        variables: [],
        methodologyText: definition.longDescription || 'Computed deterministically using standard mathematical and regulatory conventions.',
      };
  }
}

// Category-appropriate formal disclaimer
function getCategoryDisclaimer(category: string, slug: string): string {
  if (category === 'Health' || slug === 'bmi') {
    return 'This report is provided for informational and general wellness reference only. Results are estimates based on standard epidemiological Body Mass Index thresholds (WHO Asian-Indian criteria). It does not constitute medical diagnosis, clinical evaluation, or personal healthcare advice. Users should consult a qualified physician or healthcare professional for individualized medical guidance.';
  }
  if (slug === 'age') {
    return 'This calculation report is provided for informational and chronological reference only. Calendar calculations are computed deterministically based on standard Gregorian calendar conventions.';
  }
  return 'This report is provided for informational and calculation purposes only. Results are estimates based on the inputs provided and the methodology used by IndiaWise. Actual financial, tax, loan, investment, banking, or other outcomes may vary depending on applicable terms, rates, rules, policies, institutions, and individual circumstances. IndiaWise does not provide financial, investment, tax, legal, or professional advice through this calculation. Users should consult a qualified financial advisor, chartered accountant, or lending officer before entering into binding commitments.';
}

export default function CalculatorPrintReport({
  definition,
  values,
  results,
  whatIfResults,
  amortization,
  growthData,
  shareName,
  shareMode,
}: CalculatorPrintReportProps) {
  const cleanName = sanitizeShareName(shareName);
  const documentTitle = formatShareHeading(cleanName, definition.name);
  const formulaInfo = getFormulaInfo(definition.slug, definition.category, definition);
  const disclaimerText = getCategoryDisclaimer(definition.category, definition.slug);

  const highlighted = results.find(r => r.isHighlighted);
  const secondaryResults = results.filter(r => !r.isHighlighted);

  // Distribution data (e.g. Loan principal vs interest, Investment invested vs returns)
  const principalRes = results.find(r => r.id === 'principal' || r.id === 'principal_amount');
  const interestRes = results.find(r => r.id === 'total_interest' || r.id === 'wealth_gained');
  let principalNum = principalRes ? Number(principalRes.value) : 0;
  let interestNum = interestRes ? Number(interestRes.value) : 0;
  const totalNum = principalNum + interestNum;
  const principalPct = totalNum > 0 ? Math.round((principalNum / totalNum) * 100) : 0;
  const interestPct = totalNum > 0 ? 100 - principalPct : 0;

  // What-If comparison data
  const hasActiveWhatIf = Boolean(
    definition.whatIf &&
    values[definition.whatIf.id] &&
    whatIfResults &&
    whatIfResults.length > 0 &&
    values[definition.whatIf.id] !== 0 &&
    values[definition.whatIf.id] !== '0'
  );

  const isFDCompare = definition.whatIf?.type === 'fd-compare' && Boolean(values.compareRate || values.compareAmount);

  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const canonicalUrl = `https://indiawise.vercel.app/calculators/${definition.categorySlug}/${definition.slug}`;

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4 text-slate-900 bg-white font-sans text-xs leading-normal">
      
      {/* ========================================================================= */}
      {/* 1. FORMAL REPORT HEADER                                                   */}
      {/* ========================================================================= */}
      <div className="border-b-2 border-slate-900 pb-3 mb-4 print-avoid-break">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="IndiaWise Logo"
              className="h-9 w-auto object-contain flex-shrink-0"
            />
            <div className="border-l border-slate-300 pl-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                Calculation Report
              </span>
              <span className="text-[10px] font-medium text-slate-500">
                Generated using IndiaWise&apos;s deterministic calculation engine.
              </span>
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-600">
            <div>Date: <strong className="text-slate-900">{todayFormatted}</strong></div>
            <div className="font-semibold text-brand">indiawise.vercel.app</div>
            <div className="text-[10px] text-slate-500">Support: <strong className="text-slate-700">indiawiseofficial@outlook.com</strong></div>
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              {documentTitle}
            </h1>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Calculator: <span className="font-semibold text-slate-700">{definition.name}</span> • Category: <span className="font-semibold text-slate-700">{definition.category}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {cleanName && (
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-900 border border-blue-200 text-[10px] font-bold">
                Prepared for {cleanName}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-300 text-[10px] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Verified Report</span>
            </span>
            {shareMode === 'readonly' && (
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-600" />
                <span>Read-Only Snapshot</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. REPORT METADATA SECTION                                                */}
      {/* ========================================================================= */}
      <div className="mb-4 print-avoid-break">
        <div className="grid grid-cols-4 gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px]">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Calculator</span>
            <span className="font-bold text-slate-900 truncate block">{definition.name}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Generated</span>
            <span className="font-bold text-slate-900 block">{todayFormatted}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Reference URL</span>
            <span className="font-mono text-brand truncate block" title={canonicalUrl}>{canonicalUrl}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Calculation Status</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1 block">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" /> Calculation completed
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SECTION: INPUT PARAMETERS                                              */}
      {/* ========================================================================= */}
      <div className="mb-5 print-avoid-break">
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-brand" />
            <span>Input Parameters</span>
          </h2>
          <span className="text-[10px] text-slate-400 font-medium">Configured Calculation Inputs</span>
        </div>

        <div className="grid grid-cols-3 gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-200">
          {definition.inputs.map(input => {
            const val = values[input.id];
            if (input.isAdvanced && (val === 0 || val === '0' || !val)) return null;

            const unitVal = values[`${input.id}_unit`];
            const u = unitVal ? ` ${unitVal}` : (input.unit && input.unit !== '₹' ? ` ${input.unit}` : '');
            const isCurr = input.unit === '₹';
            
            let displayVal = val;
            if (typeof val === 'number') {
              displayVal = formatIndianNumber(val);
            } else if (typeof val === 'string' && !isNaN(parseFloat(val)) && input.type === 'number') {
              displayVal = formatIndianNumber(parseFloat(val));
            }

            return (
              <div key={input.id} className="border-b border-slate-200/80 pb-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-500 block truncate" title={input.label}>
                  {input.label}
                </span>
                <span className="font-mono text-sm font-bold text-slate-900">
                  {isCurr ? '₹' : ''}{displayVal}{u}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. SECTION: CALCULATION RESULTS & SECONDARY METRICS                       */}
      {/* ========================================================================= */}
      <div className="mb-5 print-avoid-break">
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Calculation Results</span>
          </h2>
          <span className="text-[10px] text-slate-400 font-medium">Deterministic Engine Output</span>
        </div>

        {/* Primary Hero Result */}
        {highlighted && (
          <div className="bg-slate-900 text-white rounded-xl p-4 mb-3 text-center border border-slate-800">
            <p className="text-[11px] uppercase tracking-wider text-slate-300 font-bold mb-1">
              {highlighted.label}
            </p>
            <p className="text-3xl font-black font-mono tracking-tight text-white">
              {formatResultValue(highlighted)}
            </p>
            {highlighted.description && (
              <p className="text-[11px] text-slate-300/80 mt-1 max-w-md mx-auto">
                {highlighted.description}
              </p>
            )}
          </div>
        )}

        {/* Secondary Metrics Grid */}
        {secondaryResults.length > 0 && (
          <div className="grid grid-cols-3 gap-2.5 mb-3">
            {secondaryResults.map(res => (
              <div key={res.id} className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block truncate" title={res.label}>
                  {res.label}
                </span>
                <span className="font-mono text-base font-bold text-slate-900 block mt-0.5">
                  {formatResultValue(res)}
                </span>
                {res.description && (
                  <span className="text-[10px] text-slate-500 block mt-0.5 truncate" title={res.description}>
                    {res.description}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Breakdown distribution bar if principal and interest exist */}
        {totalNum > 0 && (
          <div className="p-3 bg-slate-50/60 rounded-xl border border-slate-200 text-xs">
            <div className="flex justify-between items-center text-[11px] font-semibold text-slate-700 mb-1.5">
              <span>{principalRes?.label || 'Principal'}: <strong>{formatIndianCurrency(principalNum)} ({principalPct}%)</strong></span>
              <span>{interestRes?.label || 'Interest / Gains'}: <strong>{formatIndianCurrency(interestNum)} ({interestPct}%)</strong></span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden flex">
              <div className="bg-blue-600 h-full" style={{ width: `${principalPct}%` }} />
              <div className="bg-emerald-500 h-full" style={{ width: `${interestPct}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. SECTION: WHAT-IF / COMPARISON (Conditional)                            */}
      {/* ========================================================================= */}
      {hasActiveWhatIf && definition.whatIf && whatIfResults && (
        <div className="mb-5 print-avoid-break">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {isFDCompare ? 'Fixed Deposit Comparison' : 'What-If Scenario Analysis'}
            </h2>
            <span className="text-[10px] font-bold text-brand uppercase">Simulation Active</span>
          </div>

          <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/40 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">
                Applied Scenario Parameter: <span className="text-brand">{definition.whatIf.label}</span>
              </span>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-blue-200">
                {definition.whatIf.unit === '₹' ? '₹' : ''}
                {formatIndianNumber(Number(values[definition.whatIf.id]))}
                {definition.whatIf.unit && definition.whatIf.unit !== '₹' ? ` ${definition.whatIf.unit}` : ''}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-blue-200/60">
              {whatIfResults.map(res => {
                let resVal = res.value;
                if (res.unit === 'Months' && typeof res.value === 'number') {
                  const y = Math.floor(res.value / 12);
                  const m = res.value % 12;
                  resVal = m > 0 ? (y > 0 ? `${y} yrs ${m} mos` : `${m} mos`) : `${y} yrs`;
                } else if (typeof res.value === 'number') {
                  resVal = res.isCurrency ? formatIndianCurrency(res.value) : formatIndianNumber(res.value);
                }

                return (
                  <div key={res.id} className="p-2 bg-white rounded-lg border border-blue-200 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block truncate">
                      {res.label}
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-900 block mt-0.5">
                      {String(resVal)}
                    </span>
                    {res.description && (
                      <span className="text-[10px] text-slate-500 block truncate">
                        {res.description}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. SECTION: YEARLY GROWTH TRAJECTORY (SIP / Investment Calculators)       */}
      {/* ========================================================================= */}
      {growthData && growthData.length > 0 && (
        <div className="mb-5 print-avoid-break">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Investment Growth Trajectory (Yearly Summary)
            </h2>
            <span className="text-[10px] text-slate-400 font-medium">Compound Projection</span>
          </div>

          <div className="overflow-hidden border border-slate-200 rounded-xl bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">Year</th>
                  <th className="px-3 py-2 text-right">Invested Amount</th>
                  <th className="px-3 py-2 text-right">Wealth Gained</th>
                  <th className="px-3 py-2 text-right">Total Future Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {growthData.map(row => (
                  <tr key={row.period} className="even:bg-slate-50/50">
                    <td className="px-3 py-1.5 font-bold text-slate-900">Year {row.period}</td>
                    <td className="px-3 py-1.5 text-right font-mono text-slate-600">{formatIndianCurrency(row.invested)}</td>
                    <td className="px-3 py-1.5 text-right font-mono text-emerald-600 font-semibold">{formatIndianCurrency(row.returns)}</td>
                    <td className="px-3 py-1.5 text-right font-mono text-slate-900 font-bold">{formatIndianCurrency(row.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. SECTION: COMPLETE AMORTIZATION SCHEDULE (Loan Calculators)             */}
      {/* ========================================================================= */}
      {amortization && amortization.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200 print-avoid-break">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Loan Amortization Repayment Schedule
            </h2>
            <span className="text-[10px] text-slate-400 font-medium">{amortization.length} Total Monthly Cycles</span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-[11px] leading-tight">
              <thead className="bg-slate-100 text-slate-900 font-bold border-b-2 border-slate-800">
                <tr>
                  <th className="px-2.5 py-2">Month</th>
                  <th className="px-2.5 py-2 text-right">Opening Balance</th>
                  <th className="px-2.5 py-2 text-right">Monthly EMI</th>
                  <th className="px-2.5 py-2 text-right">Principal Paid</th>
                  <th className="px-2.5 py-2 text-right">Interest Paid</th>
                  <th className="px-2.5 py-2 text-right">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {amortization.map(row => (
                  <tr key={row.period} className="even:bg-slate-50/60 print-avoid-break">
                    <td className="px-2.5 py-1.5 font-bold text-slate-900">{row.period}</td>
                    <td className="px-2.5 py-1.5 text-right font-mono text-slate-600">{formatIndianCurrency(row.openingBalance)}</td>
                    <td className="px-2.5 py-1.5 text-right font-mono text-slate-900 font-semibold">{formatIndianCurrency(row.emi)}</td>
                    <td className="px-2.5 py-1.5 text-right font-mono text-emerald-600 font-semibold">{formatIndianCurrency(row.principalPaid)}</td>
                    <td className="px-2.5 py-1.5 text-right font-mono text-rose-600 font-semibold">{formatIndianCurrency(row.interestPaid)}</td>
                    <td className="px-2.5 py-1.5 text-right font-mono text-slate-900 font-bold">{formatIndianCurrency(row.closingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. SECTION: FORMULA & METHODOLOGY                                         */}
      {/* ========================================================================= */}
      <div className="mb-5 print-avoid-break">
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Formula & Methodology
          </h2>
          <span className="text-[10px] text-slate-400 font-medium">Calculation Standard</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
          <p className="text-[11px] text-slate-600 leading-relaxed">
            The calculation uses the standard methodology implemented by the IndiaWise deterministic calculation engine. Inputs are validated before calculation and the displayed results are generated from the same calculation engine used by the calculator interface.
          </p>

          <div className="flex items-center justify-between pt-1">
            <span className="font-bold text-slate-900">{formulaInfo.formulaTitle}</span>
          </div>

          <div className="p-2.5 bg-white border border-slate-200 rounded-lg font-mono font-bold text-brand text-xs">
            {formulaInfo.formulaMath}
          </div>

          {formulaInfo.variables.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-600 pt-1">
              {formulaInfo.variables.map(v => (
                <div key={v.sym}>
                  <strong className="text-slate-900 font-mono">{v.sym}:</strong> {v.desc}
                </div>
              ))}
            </div>
          )}

          <p className="text-[11px] text-slate-600 leading-relaxed pt-1 border-t border-slate-200/80">
            {formulaInfo.methodologyText}
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 9. SECTION: LEGAL & CALCULATION DISCLAIMERS                               */}
      {/* ========================================================================= */}
      <div className="mb-3 print-avoid-break">
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Important Disclaimers & Legal Notices
          </h2>
          <span className="text-[10px] text-slate-400 font-medium">Terms of Use</span>
        </div>

        <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 text-[10px] text-slate-600 leading-relaxed space-y-1.5">
          <p>
            <strong className="text-slate-800">No Professional Advice:</strong> {disclaimerText}
          </p>
          <p>
            <strong className="text-slate-800">Accuracy & Approximations:</strong> While IndiaWise makes every effort to ensure computational accuracy, results are estimates based on standard mathematical models, user inputs, and statutory guidelines. Outcomes may vary due to banking policies, compounding conventions, lender fees, individual tax deductions, or evolving regulations.
          </p>
          <p>
            <strong className="text-slate-800">No Financial Guarantee:</strong> IndiaWise does not guarantee any financial outcome, loan sanction, investment return, or tax savings. Historical performance indicators do not guarantee future results. All financial investments carry market risks.
          </p>
          <p>
            <strong className="text-slate-800">Support & Feedback:</strong> For inquiries regarding calculations, reporting errors, or assistance, contact our official support team at <strong className="text-slate-800 font-mono">indiawiseofficial@outlook.com</strong>.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 10. SECTION: PRIVACY NOTICE                                               */}
      {/* ========================================================================= */}
      <div className="mb-4 print-avoid-break">
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Privacy & Data Handling Notice
          </h2>
          <span className="text-[10px] text-slate-400 font-medium">Data Protection</span>
        </div>

        <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 text-[10px] text-slate-600 leading-relaxed">
          <p>
            This calculation is performed client-side where supported. IndiaWise does not require an account or database to generate this report. Any name displayed in this report is optional and is used only for the generated report/share experience. It does not affect the calculation. Your inputs remain private on your device.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 11. DOCUMENT FOOTER                                                       */}
      {/* ========================================================================= */}
      <div className="border-t border-slate-300 pt-2.5 flex items-center justify-between text-[10px] text-slate-500 print-avoid-break">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">IndiaWise</span>
          <span>•</span>
          <span>Calculate Smarter. Understand Better.</span>
          <span>•</span>
          <span className="font-medium text-brand">indiawise.vercel.app</span>
          <span>•</span>
          <span>Support: <strong className="text-slate-700 font-mono">indiawiseofficial@outlook.com</strong></span>
        </div>
        <div>
          Calculation Report • Generated {todayFormatted}
        </div>
      </div>

    </div>
  );
}
