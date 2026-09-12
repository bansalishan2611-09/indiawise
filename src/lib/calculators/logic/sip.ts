import { CalculatorResult, CalculatorResultPayload } from '../types';
import { parseInputValue } from '../formatters';

export function calculateSIP(inputs: Record<string, number | string>): CalculatorResultPayload {
  const monthly = parseInputValue(inputs.monthlyInvestment);
  const annualReturn = parseInputValue(inputs.expectedReturn);
  const years = parseInputValue(inputs.duration);
  const monthlyRate = annualReturn / 12 / 100;
  const n = years * 12;

  let maturityAmount = 0;
  if (monthlyRate === 0) {
    maturityAmount = monthly * n;
  } else {
    maturityAmount = monthly * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate);
  }

  const totalInvested = monthly * n;
  const wealthGained = maturityAmount - totalInvested;

  const growthData = [];
  for (let y = 1; y <= years; y++) {
    const months = y * 12;
    const currentInvested = monthly * months;
    const currentTotal = monthlyRate === 0 
      ? currentInvested 
      : monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    growthData.push({
      period: y,
      invested: Math.round(currentInvested),
      returns: Math.round(currentTotal - currentInvested),
      total: Math.round(currentTotal)
    });
  }

  const results: CalculatorResult[] = [
    { id: 'maturity_amount', label: 'Maturity Amount', value: Math.round(maturityAmount), isCurrency: true, isHighlighted: true, description: 'Total corpus at end of term' },
    { id: 'total_invested', label: 'Total Invested', value: Math.round(totalInvested), isCurrency: true, description: 'Sum of all SIP instalments' },
    { id: 'wealth_gained', label: 'Wealth Gained', value: Math.round(wealthGained), isCurrency: true, description: 'Returns earned on investment' },
  ];

  const extraInvestment = parseInputValue(inputs.extraInvestment || 0);
  let revisedResults: CalculatorResult[] = [];

  if (extraInvestment > 0 && monthly > 0) {
    const newMonthly = monthly + extraInvestment;
    let newMaturityAmount = 0;
    if (monthlyRate === 0) {
      newMaturityAmount = newMonthly * n;
    } else {
      newMaturityAmount = newMonthly * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate);
    }
    const newTotalInvested = newMonthly * n;
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
