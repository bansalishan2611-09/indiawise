import { CalculatorResult, CalculatorResultPayload } from '../types';
import { parseInputValue } from '../formatters';

export function calculateRD(inputs: Record<string, number | string>): CalculatorResultPayload {
  const monthlyDeposit = parseInputValue(inputs.monthlyInvestment);
  const annualRate = parseInputValue(inputs.expectedReturn);
  const tenureYears = parseInputValue(inputs.timePeriod);

  const months = tenureYears * 12;
  const quarterlyRate = annualRate / 400; // quarterly compounding

  // RD maturity: each monthly deposit compounds quarterly for the remaining months
  let maturityAmount = 0;
  for (let i = 1; i <= months; i++) {
    const remainingMonths = months - i;
    const remainingQuarters = remainingMonths / 3;
    maturityAmount += monthlyDeposit * Math.pow(1 + quarterlyRate, remainingQuarters);
  }
  // Add the last deposit (no compounding)
  // The loop already accounts for all months including the last (where remainingMonths=0)

  const totalInvested = monthlyDeposit * months;
  const wealthGained = maturityAmount - totalInvested;

  const growthData = [];
  let cumulativeMaturity = 0;
  for (let y = 1; y <= tenureYears; y++) {
    cumulativeMaturity = 0;
    const currentMonths = y * 12;
    for (let i = 1; i <= currentMonths; i++) {
      const remainingMonths = currentMonths - i;
      const remainingQuarters = remainingMonths / 3;
      cumulativeMaturity += monthlyDeposit * Math.pow(1 + quarterlyRate, remainingQuarters);
    }
    const currentInvested = monthlyDeposit * currentMonths;
    growthData.push({
      period: y,
      invested: Math.round(currentInvested),
      returns: Math.round(cumulativeMaturity - currentInvested),
      total: Math.round(cumulativeMaturity)
    });
  }

  const results: CalculatorResult[] = [
    { id: 'maturity_amount', label: 'Total Value', value: Math.round(maturityAmount), isCurrency: true, isHighlighted: true, description: 'Maturity Amount' },
    { id: 'wealth_gained', label: 'Total Returns', value: Math.round(wealthGained), isCurrency: true, description: 'Interest Earned' },
    { id: 'total_invested', label: 'Total Invested', value: Math.round(totalInvested), isCurrency: true, description: 'Amount deposited' },
  ];

  const extraInvestment = parseInputValue(inputs.extraInvestment || 0);
  let revisedResults: CalculatorResult[] = [];

  if (extraInvestment > 0 && monthlyDeposit > 0) {
    const newMonthly = monthlyDeposit + extraInvestment;
    let newMaturityAmount = 0;
    for (let i = 1; i <= months; i++) {
      const remainingMonths = months - i;
      const remainingQuarters = remainingMonths / 3;
      newMaturityAmount += newMonthly * Math.pow(1 + quarterlyRate, remainingQuarters);
    }
    const newTotalInvested = newMonthly * months;
    const newWealthGained = newMaturityAmount - newTotalInvested;
    const additionalWealth = newMaturityAmount - maturityAmount;

    revisedResults = [
      { id: 'new_monthly', label: 'New Monthly Investment', value: Math.round(newMonthly), isCurrency: true },
      { id: 'new_invested', label: 'New Total Invested', value: Math.round(newTotalInvested), isCurrency: true },
      { id: 'new_wealth', label: 'New Wealth Gained', value: Math.round(newWealthGained), isCurrency: true },
      { id: 'additional_wealth', label: 'Additional Wealth Generated', value: Math.round(additionalWealth), isCurrency: true, isHighlighted: true },
      { id: 'new_maturity', label: 'New Maturity Amount', value: Math.round(newMaturityAmount), isCurrency: true }
    ];
  }

  return { 
    results,
    whatIfResults: revisedResults.length > 0 ? revisedResults : undefined,
    growthData
  };
}
