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

  const results: CalculatorResult[] = [
    { id: 'total_amount', label: 'Total Amount', value: Math.round(totalAmount * 100) / 100, isCurrency: true, isHighlighted: true, description: type === 'exclusive' ? 'Amount after adding GST' : 'Amount before GST removal' },
    { id: 'base_amount', label: 'Base Amount', value: Math.round(baseAmount * 100) / 100, isCurrency: true, description: 'Amount before GST' },
    { id: 'gst_amount', label: `GST (${rate}%)`, value: Math.round(gstAmount * 100) / 100, isCurrency: true, description: 'Total GST component' },
    { id: 'cgst', label: 'CGST', value: Math.round(cgst * 100) / 100, isCurrency: true, description: `${rate / 2}% Central GST` },
    { id: 'sgst', label: 'SGST', value: Math.round(sgst * 100) / 100, isCurrency: true, description: `${rate / 2}% State GST` },
  ];

  const extraAmount = parseInputValue(inputs.extraAmount || 0);
  let revisedResults: CalculatorResult[] = [];
  
  if (extraAmount !== 0 && amount > 0) {
    const newAmount = amount + extraAmount;
    let newBaseAmount: number, newGstAmount: number, newTotalAmount: number;
    
    if (type === 'inclusive') {
      newTotalAmount = newAmount;
      newBaseAmount = (newAmount * 100) / (100 + rate);
      newGstAmount = newTotalAmount - newBaseAmount;
    } else {
      newBaseAmount = newAmount;
      newGstAmount = (newAmount * rate) / 100;
      newTotalAmount = newBaseAmount + newGstAmount;
    }
    
    const diffTotal = newTotalAmount - totalAmount;
    const diffGst = newGstAmount - gstAmount;
    
    revisedResults = [
      { id: 'new_input_amount', label: 'New Input Amount', value: Math.round(newAmount * 100) / 100, isCurrency: true },
      { id: 'new_total', label: 'New Total Amount', value: Math.round(newTotalAmount * 100) / 100, isCurrency: true },
      { id: 'new_gst', label: 'New GST Component', value: Math.round(newGstAmount * 100) / 100, isCurrency: true },
      { id: 'diff_total', label: 'Total Change', value: diffTotal > 0 ? `+₹${Math.round(diffTotal*100)/100}` : `-₹${Math.round(Math.abs(diffTotal)*100)/100}`, isHighlighted: true },
      { id: 'diff_gst', label: 'GST Change', value: diffGst > 0 ? `+₹${Math.round(diffGst*100)/100}` : `-₹${Math.round(Math.abs(diffGst)*100)/100}` },
    ];
  }

  return { 
    results,
    whatIfResults: revisedResults.length > 0 ? revisedResults : undefined
  };
}
