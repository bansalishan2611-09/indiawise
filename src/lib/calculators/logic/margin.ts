import { CalculatorResult, CalculatorResultPayload } from '../types';
import { parseInputValue } from '../formatters';

export function calculateMargin(inputs: Record<string, number | string>): CalculatorResultPayload {
  const cost = parseInputValue(inputs.cost);
  const revenue = parseInputValue(inputs.revenue);

  if (cost <= 0 || revenue <= 0) {
    return { results: [
      { id: 'margin', label: 'Gross Margin', value: '0%', isHighlighted: true, description: 'Enter valid cost and revenue' },
    ] };
  }

  const grossProfit = revenue - cost;
  const marginPercentage = (grossProfit / revenue) * 100;
  const markupPercentage = (grossProfit / cost) * 100;

  const results: CalculatorResult[] = [
    { id: 'gross_profit', label: 'Gross Profit', value: Math.round(grossProfit), isCurrency: true, isHighlighted: true, description: 'Revenue minus Cost' },
    { id: 'margin', label: 'Gross Margin', value: `${marginPercentage.toFixed(2)}%`, description: 'Profit as % of Revenue' },
    { id: 'markup', label: 'Markup', value: `${markupPercentage.toFixed(2)}%`, description: 'Profit as % of Cost' },
    { id: 'cost_amount', label: 'Total Cost', value: Math.round(cost), isCurrency: true, description: 'Cost of goods/services' },
  ];

  const extraRevenue = parseInputValue(inputs.extraRevenue || 0);
  let revisedResults: CalculatorResult[] = [];

  if (extraRevenue !== 0 && revenue > 0 && cost > 0) {
    const newRevenue = revenue + extraRevenue;
    const newGrossProfit = newRevenue - cost;
    const newMarginPercentage = (newGrossProfit / newRevenue) * 100;
    const newMarkupPercentage = (newGrossProfit / cost) * 100;
    
    const profitDiff = newGrossProfit - grossProfit;

    revisedResults = [
      { id: 'new_revenue', label: 'New Selling Price', value: Math.round(newRevenue), isCurrency: true },
      { id: 'new_margin', label: 'New Gross Margin', value: `${newMarginPercentage.toFixed(2)}%` },
      { id: 'new_markup', label: 'New Markup', value: `${newMarkupPercentage.toFixed(2)}%` },
      { id: 'new_profit', label: 'New Gross Profit', value: Math.round(newGrossProfit), isCurrency: true },
      { id: 'profit_diff', label: 'Profit Difference', value: profitDiff > 0 ? `+₹${Math.round(profitDiff)}` : `-₹${Math.round(Math.abs(profitDiff))}`, isHighlighted: true },
    ];
  }

  return { 
    results,
    whatIfResults: revisedResults.length > 0 ? revisedResults : undefined
  };
}
