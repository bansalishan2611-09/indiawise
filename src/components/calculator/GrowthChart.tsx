'use client';
import { GrowthRow } from '@/lib/calculators/types';
import { formatIndianCurrency } from '@/lib/calculators/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GrowthChart({ data }: { data: GrowthRow[] }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="mt-8 print:mt-4 print:break-inside-avoid">
      <h3 className="text-xl font-bold text-navy mb-4">Investment Growth Over Time</h3>
      <div className="bg-white border border-border rounded-2xl p-6 shadow-sm h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="period" 
              tickFormatter={(val) => `Yr ${val}`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={(val) => {
                if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
                if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
                if (val >= 1000) return `₹${(val / 1000).toFixed(1)}k`;
                return `₹${val}`;
              }}
            />
            <Tooltip
              formatter={(value: any) => formatIndianCurrency(Number(value))}
              labelFormatter={(label) => `Year ${label}`}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              cursor={{ fill: '#F3F4F6' }}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="invested" name="Invested Amount" stackId="a" fill="#2563EB" radius={[0, 0, 4, 4]} />
            <Bar dataKey="returns" name="Wealth Gained" stackId="a" fill="#60A5FA" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
