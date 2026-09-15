'use client';
import { WhatIfConfig, CalculatorResult } from '@/lib/calculators/types';
import { formatIndianCurrency, formatIndianNumber } from '@/lib/calculators/formatters';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Lock } from 'lucide-react';

interface Props {
  config: WhatIfConfig;
  value: number;
  onChange: (id: string, value: number) => void;
  originalResults: CalculatorResult[];
  whatIfResults?: CalculatorResult[];
  readOnly?: boolean;
}

function formatMonthsToYears(months: number) {
  if (months < 12) return `${months} months`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m > 0 ? `${y} years ${m} months` : `${y} years`;
}

function renderValue(val: string | number, isCurrency?: boolean, isMonths?: boolean) {
  if (isMonths && typeof val === 'number') return formatMonthsToYears(val);
  if (typeof val === 'string') return val;
  return isCurrency ? formatIndianCurrency(val) : formatIndianNumber(val);
}

export default function WhatIfPanel({ config, value, onChange, originalResults, whatIfResults, readOnly }: Props) {
  const isCurrency = config.unit === '₹' || config.unit === 'Rs.';

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    onChange(config.id, parseFloat(e.target.value));
  };

  const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) onChange(config.id, val);
    else onChange(config.id, 0);
  };

  const hasWhatIf = value !== config.defaultValue && whatIfResults && whatIfResults.length > 0;
  
  // Find "You could save" or "Additional Wealth" highlighted metric
  let highlighted = whatIfResults?.find(r => r.isHighlighted);
  if (!highlighted && whatIfResults) {
    highlighted = whatIfResults.find(r => r.id === 'additional_wealth' || r.id === 'interest_saved');
  }

  // Generate comparison chart data based on calculator type
  let chartData: any = null;
  
  if (hasWhatIf) {
    const checkPairs = [
      { newId: 'new_wealth', origId: 'wealth_gained', title: 'Wealth Generated' }, // SIP, RD
      { newId: 'revised_interest', origId: 'total_interest', title: 'Total Interest Paid' }, // Loans
      { newId: 'new_monthly', origId: 'monthly_in_hand', title: 'Monthly Take-Home' }, // Salary
      { newId: 'new_bmi_val', origId: 'bmi', title: 'BMI Comparison' }, // BMI
      { newId: 'new_profit', origId: 'gross_profit', title: 'Gross Profit' }, // Margin
      { newId: 'new_total', origId: 'total_amount', title: 'Total Amount' }, // GST
    ];

    for (const pair of checkPairs) {
      const newVal = whatIfResults?.find(r => r.id === pair.newId);
      const origVal = originalResults.find(r => r.id === pair.origId);
      
      if (newVal && origVal) {
        chartData = {
          title: pair.title,
          isCurrency: !!newVal.isCurrency,
          data: [
            { name: 'Original', value: Number(origVal.value) },
            { name: 'With Extra', value: Number(newVal.value) }
          ]
        };
        break;
      }
    }
  }

  return (
    <div className="bg-white border-2 border-brand/20 rounded-3xl p-6 md:p-8 mt-8 shadow-sm">
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <h3 className="text-xl font-bold text-navy">Explore What-If</h3>
        </div>
        
        {readOnly ? (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
            <Lock className="w-2.5 h-2.5 text-slate-500" /> Locked Snapshot
          </span>
        ) : (
          value !== config.defaultValue && (
            <button 
              onClick={() => onChange(config.id, config.defaultValue || 0)}
              className="text-xs font-bold text-gray-500 hover:text-brand bg-gray-100 hover:bg-brand/10 px-3 py-1 rounded-full transition-colors cursor-pointer"
            >
              Reset
            </button>
          )
        )}
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">{config.label}</label>
          <div className={`flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-brand/50 transition-shadow ${readOnly ? 'bg-slate-100/80 cursor-not-allowed opacity-90' : ''}`}>
            {isCurrency && <div className="pl-4 pr-2 py-2 flex items-center text-gray-500 font-bold bg-transparent">₹</div>}
            <input 
              type="number" 
              value={value === 0 && config.defaultValue === 0 ? '' : value} 
              onChange={handleNumberInput}
              min={config.min}
              max={config.max}
              step={config.step}
              disabled={readOnly}
              readOnly={readOnly}
              className={`w-28 py-2 pr-4 bg-transparent font-mono font-bold text-navy focus:outline-none text-right ${readOnly ? 'cursor-not-allowed text-slate-600' : ''}`}
            />
          </div>
        </div>
        
        <input 
          type="range"
          min={config.min}
          max={config.max}
          step={config.step}
          value={value || 0}
          onChange={handleSlider}
          disabled={readOnly}
          className={`w-full h-2 bg-gray-200 rounded-lg appearance-none accent-brand ${readOnly ? 'opacity-40 pointer-events-none cursor-not-allowed' : 'cursor-pointer'}`}
        />
        <div className="flex justify-between mt-2 text-xs font-bold text-gray-400">
          <span>{isCurrency ? '₹' : ''}{formatIndianNumber(config.min)}{config.unit && !isCurrency ? ` ${config.unit}` : ''}</span>
          <span>{isCurrency ? '₹' : ''}{formatIndianNumber(config.max)}{config.unit && !isCurrency ? ` ${config.unit}` : ''}</span>
        </div>
      </div>

      {hasWhatIf ? (
        <div className="space-y-8">
          {highlighted && (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
              <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">
                Scenario Impact
              </p>
              <p className="text-3xl font-bold font-mono text-green-700">{renderValue(highlighted.value, highlighted.isCurrency, highlighted.unit === 'Months')}</p>
              <p className="text-sm text-green-600/80 font-medium">{highlighted.label}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">Metric</th>
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">Original</th>
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-brand border-b border-gray-100 bg-brand/5 rounded-t-lg">With Extra</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {whatIfResults.filter(r => !r.isHighlighted).map(r => {
                    const orig = originalResults.find(or => 
                      or.label.replace('Total ', '') === r.label.replace('New ', '').replace('Total ', '') ||
                      or.label === r.label
                    );
                    
                    return (
                      <tr key={r.id}>
                        <td className="py-3 px-4 text-sm font-semibold text-gray-600">{r.label}</td>
                        <td className="py-3 px-4 text-sm font-mono text-gray-500 line-through decoration-gray-300">
                          {orig ? renderValue(orig.value, orig.isCurrency, orig.unit === 'Months') : '-'}
                        </td>
                        <td className="py-3 px-4 text-sm font-mono font-bold text-navy bg-brand/5">
                          {renderValue(r.value, r.isCurrency, r.unit === 'Months')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {chartData && (
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center h-full">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{chartData.title}</p>
                <div className="w-full h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }} />
                      <Tooltip 
                        formatter={(val: any) => chartData.isCurrency ? formatIndianCurrency(Number(val)) : formatIndianNumber(Number(val))}
                        cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                        {chartData.data.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#9CA3AF' : '#2563EB'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-sm font-medium text-gray-400 py-4">
          Adjust the slider to explore what-if scenarios.
        </div>
      )}
    </div>
  );
}
