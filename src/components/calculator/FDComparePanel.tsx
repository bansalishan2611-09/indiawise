import React from 'react';
import { WhatIfConfig, CalculatorResult } from '../../lib/calculators/types';
import { formatIndianCurrency, formatIndianNumber } from '../../lib/calculators/formatters';

interface Props {
  config: WhatIfConfig;
  values: Record<string, string | number>;
  onChange: (id: string, value: number) => void;
  originalResults: CalculatorResult[];
  whatIfResults?: CalculatorResult[];
}

export function FDComparePanel({ config, values, onChange, originalResults, whatIfResults }: Props) {
  const isActive = values[config.id] === 1;

  const handleToggle = () => {
    onChange(config.id, isActive ? 0 : 1);
  };

  const handleInput = (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) onChange(id, val);
    else onChange(id, 0);
  };

  const renderValue = (val: number | string | undefined, isCurrency?: boolean) => {
    if (val === undefined || val === null) return '-';
    if (typeof val === 'string') return val;
    return isCurrency ? formatIndianCurrency(val) : formatIndianNumber(val);
  };

  const highlighted = whatIfResults?.find(r => r.isHighlighted);

  return (
    <div className="bg-white border-2 border-brand/20 rounded-3xl p-6 md:p-8 mt-8 shadow-sm">
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <h3 className="text-xl font-bold text-navy">Compare FD Options</h3>
        </div>
        
        <button 
          onClick={handleToggle}
          className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${isActive ? 'text-gray-500 bg-gray-100 hover:text-red-500 hover:bg-red-50' : 'text-brand bg-brand/10 hover:bg-brand/20'}`}
        >
          {isActive ? 'Close Comparison' : 'Compare Another FD'}
        </button>
      </div>

      {!isActive ? (
        <div className="text-center text-sm font-medium text-gray-400 py-4">
          Click "Compare Another FD" to evaluate different deposit amounts, rates, or tenures.
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Deposit Amount (₹)</label>
              <input 
                type="number" 
                value={values['compareAmount'] || ''} 
                onChange={handleInput('compareAmount')}
                placeholder="e.g. 100000"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono font-bold text-navy focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Interest Rate (%)</label>
              <input 
                type="number" 
                value={values['compareRate'] || ''} 
                onChange={handleInput('compareRate')}
                placeholder="e.g. 7.5"
                step="0.1"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono font-bold text-navy focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tenure (Years)</label>
              <input 
                type="number" 
                value={values['compareTenure'] || ''} 
                onChange={handleInput('compareTenure')}
                placeholder="e.g. 5"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-mono font-bold text-navy focus:outline-none focus:ring-2 focus:ring-brand/50"
              />
            </div>
          </div>

          {(values['compareAmount'] && values['compareRate'] && values['compareTenure'] && whatIfResults) ? (
            <>
              {highlighted && (
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center mt-6">
                  <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">
                    Scenario Impact
                  </p>
                  <p className="text-3xl font-bold font-mono text-green-700">{renderValue(highlighted.value, highlighted.isCurrency)}</p>
                  <p className="text-sm text-green-600/80 font-medium">{highlighted.label}</p>
                </div>
              )}

              <div className="overflow-x-auto mt-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">Metric</th>
                      <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">Current FD</th>
                      <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-brand border-b border-gray-100 bg-brand/5 rounded-t-lg">Compared FD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {whatIfResults.filter(r => !r.isHighlighted).map(r => {
                      const orig = originalResults.find(or => 
                        or.label.replace('Total ', '') === r.label.replace('Comparison ', '').replace('Total ', '') ||
                        or.label === r.label
                      );
                      
                      return (
                        <tr key={r.id}>
                          <td className="py-3 px-4 text-sm font-semibold text-gray-600">{r.label}</td>
                          <td className="py-3 px-4 text-sm font-mono text-gray-500">
                            {orig ? renderValue(orig.value, orig.isCurrency) : '-'}
                          </td>
                          <td className="py-3 px-4 text-sm font-mono font-bold text-navy bg-brand/5">
                            {renderValue(r.value, r.isCurrency)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center text-sm font-medium text-brand/70 bg-brand/5 py-4 rounded-xl border border-brand/10">
              Enter Deposit Amount, Interest Rate, and Tenure to see the comparison.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
