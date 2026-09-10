'use client';
import { CalculatorResult } from '@/lib/calculators/types';
import { formatIndianCurrency, formatIndianNumber } from '@/lib/calculators/formatters';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ResultDisplayProps {
  results: CalculatorResult[];
  isLoading?: boolean;
}

function formatValue(result: CalculatorResult): string {
  if (typeof result.value === 'string') return result.value;
  if (result.isCurrency) return formatIndianCurrency(result.value as number);
  return formatIndianNumber(result.value as number);
}

// Colors for the charts
const COLORS = ['#2563EB', '#60A5FA', '#93C5FD', '#1E40AF'];

export default function ResultDisplay({ results, isLoading }: ResultDisplayProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-40 bg-navy/10 rounded-3xl" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-border rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const highlighted = results.find(r => r.isHighlighted);
  const others = results.filter(r => !r.isHighlighted);

  // Extract data for charts if available
  let chartData: { name: string; value: number; color: string }[] = [];
  
  // EMI / Loans Chart logic
  const loanAmount = results.find(r => r.id === 'principal');
  const totalInterest = results.find(r => r.id === 'total_interest');
  
  // Investments Chart logic (SIP, RD, FD)
  const investedAmount = results.find(r => r.id === 'total_invested' || r.id === 'principal_amount' || (r.id === 'principal' && !totalInterest));
  const wealthGained = results.find(r => r.id === 'wealth_gained');

  // GST Chart logic
  const baseAmount = results.find(r => r.id === 'base_amount');
  const gstAmount = results.find(r => r.id === 'gst_amount');

  // Margin Chart logic
  const costAmount = results.find(r => r.id === 'cost_amount');
  const profitAmount = results.find(r => r.id === 'gross_profit');

  if (loanAmount && totalInterest) {
    chartData = [
      { name: 'Principal', value: Number(loanAmount.value), color: COLORS[1] },
      { name: 'Interest', value: Number(totalInterest.value), color: COLORS[0] }
    ];
  } else if (investedAmount && wealthGained) {
    chartData = [
      { name: 'Invested', value: Number(investedAmount.value), color: COLORS[1] },
      { name: 'Gained', value: Number(wealthGained.value), color: COLORS[0] }
    ];
  } else if (baseAmount && gstAmount) {
    chartData = [
      { name: 'Base Amount', value: Number(baseAmount.value), color: COLORS[1] },
      { name: 'GST', value: Number(gstAmount.value), color: COLORS[0] }
    ];
  } else if (costAmount && profitAmount) {
    chartData = [
      { name: 'Cost', value: Number(costAmount.value), color: COLORS[1] },
      { name: 'Profit', value: Number(profitAmount.value), color: COLORS[0] }
    ];
  }

  return (
    <div className="space-y-6 print:space-y-6">
      {highlighted && (
        <div className="bg-navy text-white rounded-3xl p-8 text-center shadow-lg relative overflow-hidden print:p-6 print:bg-gray-50 print:border print:border-gray-200 print:text-navy print:shadow-none print:rounded-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 print:hidden"></div>
          <div className="relative z-10">
            <p className="text-blue-200 text-sm font-medium mb-2 uppercase tracking-wider print:text-gray-500">{highlighted.label}</p>
            <p className="text-5xl font-extrabold font-mono tracking-tighter print:text-4xl">{formatValue(highlighted)}</p>
            {highlighted.description && <p className="text-blue-200/80 text-sm mt-3 print:text-gray-400">{highlighted.description}</p>}
          </div>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="bg-white border border-border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 print:flex-row print:p-6 print:shadow-none print:border-gray-200 print:bg-white print:rounded-2xl">
          <div className="w-48 h-48 shrink-0 print:w-40 print:h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  isAnimationActive={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number | string | readonly (string | number)[] | undefined) => {
                    let numVal = value;
                    if (Array.isArray(value)) numVal = value[0];
                    const num = typeof numVal === 'string' ? parseFloat(numVal) : numVal as number;
                    return formatIndianCurrency(typeof num === 'number' && !isNaN(num) ? num : 0);
                  }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-4 w-full">
            {chartData.map((data, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
                  <span className="text-sm font-semibold text-gray-600">{data.name}</span>
                </div>
                <span className="font-mono font-bold text-navy text-lg">{formatIndianCurrency(data.value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <div className="grid grid-cols-2 gap-4 print:gap-4">
          {others.map(result => (
            <div key={result.id} className="bg-white border border-border rounded-2xl p-5 hover:border-brand/30 hover:shadow-md transition-all print:p-4 print:bg-gray-50 print:border-gray-200 print:rounded-2xl">
              <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wider">{result.label}</p>
              <p className="text-xl font-bold text-navy font-mono tracking-tight print:text-xl">{formatValue(result)}</p>
              {result.description && <p className="text-xs text-gray-400 mt-2">{result.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
