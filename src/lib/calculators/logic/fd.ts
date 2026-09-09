import { CalculatorResult, CalculatorResultPayload } from '../types';
import { parseInputValue } from '../formatters';

export function calculateFD(inputs: Record<string, number | string>): CalculatorResultPayload {
  const principal = parseInputValue(inputs.principalAmount);
  const annualRate = parseInputValue(inputs.interestRate);
  const tenureYears = parseInputValue(inputs.tenure);
  
  // FD in India is typically compounded quarterly (4 times a year)
  const compoundingFrequency = 4;
  const r = annualRate / 100;
  
  const maturityAmount = principal * Math.pow((1 + r / compoundingFrequency), compoundingFrequency * tenureYears);
  const wealthGained = maturityAmount - principal;

  const growthData = [];
  for (let y = 1; y <= tenureYears; y++) {
    const currentTotal = principal * Math.pow((1 + r / compoundingFrequency), compoundingFrequency * y);
    growthData.push({
      period: y,
      invested: Math.round(principal),
      returns: Math.round(currentTotal - principal),
      total: Math.round(currentTotal)
    });
  }

  return { 
    results: [
      { id: 'maturity_amount', label: 'Total Value', value: Math.round(maturityAmount), isCurrency: true, isHighlighted: true, description: 'Maturity Amount' },
      { id: 'wealth_gained', label: 'Total Returns', value: Math.round(wealthGained), isCurrency: true, description: 'Interest Earned' },
      { id: 'principal', label: 'Total Investment', value: Math.round(principal), isCurrency: true, description: 'Amount Invested' },
    ],
    growthData
  };
}
