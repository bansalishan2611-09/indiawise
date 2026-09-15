'use client';
import { AmortizationRow } from '@/lib/calculators/types';
import { formatIndianCurrency } from '@/lib/calculators/formatters';

export default function AmortizationSchedule({ data }: { data: AmortizationRow[] }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="mt-8 print:mt-4">
      <h3 className="text-xl font-bold text-navy mb-4">Amortization Schedule</h3>
      <div className="overflow-x-auto border border-border rounded-2xl bg-white shadow-sm max-h-[500px] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:overflow-visible">
        <table className="w-full text-sm text-left print:text-[11px]">
          <thead className="bg-alt sticky top-0 z-10 text-navy font-semibold print:bg-slate-100 print:text-slate-900 print:font-bold print:border-b-2 print:border-slate-800">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap print:px-2 print:py-2">Month</th>
              <th className="px-4 py-3 whitespace-nowrap text-right print:px-2 print:py-2">Opening Balance</th>
              <th className="px-4 py-3 whitespace-nowrap text-right print:px-2 print:py-2">EMI</th>
              <th className="px-4 py-3 whitespace-nowrap text-right print:px-2 print:py-2">Principal Paid</th>
              <th className="px-4 py-3 whitespace-nowrap text-right print:px-2 print:py-2">Interest Paid</th>
              <th className="px-4 py-3 whitespace-nowrap text-right print:px-2 print:py-2">Closing Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border print:divide-slate-200">
            {data.map((row) => (
              <tr key={row.period} className="hover:bg-alt/50 transition-colors print:break-inside-avoid print:even:bg-slate-50/50">
                <td className="px-4 py-3 font-medium text-navy print:px-2 print:py-1.5">{row.period}</td>
                <td className="px-4 py-3 text-right text-muted print:px-2 print:py-1.5 font-mono">{formatIndianCurrency(row.openingBalance)}</td>
                <td className="px-4 py-3 text-right text-navy font-medium print:px-2 print:py-1.5 font-mono">{formatIndianCurrency(row.emi)}</td>
                <td className="px-4 py-3 text-right text-green-600 print:px-2 print:py-1.5 font-mono">{formatIndianCurrency(row.principalPaid)}</td>
                <td className="px-4 py-3 text-right text-red-500 print:px-2 print:py-1.5 font-mono">{formatIndianCurrency(row.interestPaid)}</td>
                <td className="px-4 py-3 text-right text-navy font-medium print:px-2 print:py-1.5 font-mono font-bold">{formatIndianCurrency(row.closingBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
