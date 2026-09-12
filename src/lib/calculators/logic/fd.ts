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

  const results: CalculatorResult[] = [
    { id: 'maturity_amount', label: 'Total Value', value: Math.round(maturityAmount), isCurrency: true, isHighlighted: true, description: 'Maturity Amount' },
    { id: 'wealth_gained', label: 'Total Returns', value: Math.round(wealthGained), isCurrency: true, description: 'Interest Earned' },
    { id: 'principal', label: 'Total Investment', value: Math.round(principal), isCurrency: true, description: 'Amount Invested' },
  ];

  const fdCompareActive = parseInputValue(inputs.fdCompareActive || 0);
  let revisedResults: CalculatorResult[] = [];
  
  if (fdCompareActive === 1) {
    const compAmount = inputs.compareAmount ? parseInputValue(inputs.compareAmount) : principal;
    const compRate = inputs.compareRate ? parseInputValue(inputs.compareRate) : annualRate;
    const compTenure = inputs.compareTenure ? parseInputValue(inputs.compareTenure) : tenureYears;
    
    if (compAmount > 0 && compRate > 0 && compTenure > 0) {
      const compQuarters = compTenure * 4;
      const compQuarterlyRate = compRate / 400;
      const compMaturity = compAmount * Math.pow(1 + compQuarterlyRate, compQuarters);
      const compWealth = compMaturity - compAmount;
      
      const diffMaturity = compMaturity - maturityAmount;
      const diffWealth = compWealth - wealthGained;
      
      revisedResults = [
        { id: 'comp_maturity', label: 'Comparison Maturity', value: Math.round(compMaturity), isCurrency: true },
        { id: 'comp_interest', label: 'Comparison Interest', value: Math.round(compWealth), isCurrency: true },
        { id: 'diff_maturity', label: 'Maturity Difference', value: diffMaturity > 0 ? `+₹${Math.round(diffMaturity)}` : `-₹${Math.round(Math.abs(diffMaturity))}`, isHighlighted: true },
        { id: 'diff_interest', label: 'Interest Difference', value: diffWealth > 0 ? `+₹${Math.round(diffWealth)}` : `-₹${Math.round(Math.abs(diffWealth))}` },
      ];
    }
  }

  return { 
    results,
    whatIfResults: revisedResults.length > 0 ? revisedResults : undefined,
    growthData
  };
}
