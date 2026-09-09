import { CalculatorResult, CalculatorResultPayload } from '../types';
import { parseInputValue } from '../formatters';

export function calculateGST(inputs: Record<string, number | string>): CalculatorResultPayload {
  const amount = parseInputValue(inputs.amount);
  const rate = parseInputValue(inputs.gstRate);
  const type = inputs.calculationType as string;

  let baseAmount: number, gstAmount: number, totalAmount: number;
  if (type === 'inclusive') {
    totalAmount = amount;
    baseAmount = (amount * 100) / (100 + rate);
    gstAmount = totalAmount - baseAmount;
  } else {
    baseAmount = amount;
    gstAmount = (amount * rate) / 100;
    totalAmount = baseAmount + gstAmount;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  return { results: [
    { id: 'total_amount', label: 'Total Amount', value: Math.round(totalAmount * 100) / 100, isCurrency: true, isHighlighted: true, description: type === 'exclusive' ? 'Amount after adding GST' : 'Amount before GST removal' },
    { id: 'base_amount', label: 'Base Amount', value: Math.round(baseAmount * 100) / 100, isCurrency: true, description: 'Amount before GST' },
    { id: 'gst_amount', label: `GST (${rate}%)`, value: Math.round(gstAmount * 100) / 100, isCurrency: true, description: 'Total GST component' },
    { id: 'cgst', label: 'CGST', value: Math.round(cgst * 100) / 100, isCurrency: true, description: `${rate / 2}% Central GST` },
    { id: 'sgst', label: 'SGST', value: Math.round(sgst * 100) / 100, isCurrency: true, description: `${rate / 2}% State GST` },
  ] };
}
