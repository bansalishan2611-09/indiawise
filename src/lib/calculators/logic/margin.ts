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

  return { results: [
    { id: 'gross_profit', label: 'Gross Profit', value: Math.round(grossProfit), isCurrency: true, isHighlighted: true, description: 'Revenue minus Cost' },
    { id: 'margin', label: 'Gross Margin', value: `${marginPercentage.toFixed(2)}%`, description: 'Profit as % of Revenue' },
    { id: 'markup', label: 'Markup', value: `${markupPercentage.toFixed(2)}%`, description: 'Profit as % of Cost' },
    { id: 'cost_amount', label: 'Total Cost', value: Math.round(cost), isCurrency: true, description: 'Cost of goods/services' },
  ] };
}
