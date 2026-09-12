import { CalculatorResult, CalculatorResultPayload } from '../types';
import { parseInputValue } from '../formatters';
import { calculateIncomeTax } from './income-tax';

export function calculateSalary(inputs: Record<string, number | string>): CalculatorResultPayload {
  const ctc = parseInputValue(inputs.ctc);
  const basicPercentage = parseInputValue(inputs.basicPercentage) / 100;
  
  const basicSalary = ctc * basicPercentage;
  
  // Employee PF is 12% of Basic (Usually capped at 12% of 15000 = 1800/month or 21600/year, but for premium calculators, let's just do 12% of basic as standard corporate structure)
  const employeePF = basicSalary * 0.12;
  
  // Employer PF is also 12% of Basic, usually part of CTC
  const employerPF = basicSalary * 0.12;
  
  // Gratuity is 4.81% of Basic
  const gratuity = basicSalary * 0.0481;
  
  // Gross Salary = CTC - Employer PF - Gratuity
  const grossSalary = ctc - employerPF - gratuity;
  
  // Tax calculation using New Regime
  const taxResultsPayload = calculateIncomeTax({ annualIncome: grossSalary, totalDeductions: 0 });
  const taxResults = taxResultsPayload.results;
  const taxNewRegimeRaw = taxResults.find(r => r.id === 'tax_new')?.value ?? 0;
  const taxNewRegime = typeof taxNewRegimeRaw === 'string' ? parseFloat(taxNewRegimeRaw) || 0 : taxNewRegimeRaw;
  
  // In-hand Salary (Annual) = Gross - Employee PF - Tax
  const netAnnualSalary = grossSalary - employeePF - taxNewRegime;
  const netMonthlySalary = netAnnualSalary / 12;

  const results: CalculatorResult[] = [
    { id: 'monthly_in_hand', label: 'Monthly In-Hand', value: Math.round(netMonthlySalary), isCurrency: true, isHighlighted: true, description: 'Approx. take-home pay' },
    { id: 'annual_in_hand', label: 'Annual In-Hand', value: Math.round(netAnnualSalary), isCurrency: true, description: 'Net yearly salary' },
    { id: 'total_tax', label: 'Income Tax', value: Math.round(taxNewRegime), isCurrency: true, description: 'Estimated tax (New Regime)' },
    { id: 'total_pf', label: 'Total PF Contribution', value: Math.round(employeePF + employerPF), isCurrency: true, description: 'Employee + Employer PF' },
  ];

  const hikePercentage = parseInputValue(inputs.hikePercentage || 0);
  let revisedResults: CalculatorResult[] = [];
  
  if (hikePercentage > 0 && ctc > 0) {
    const newCtc = ctc * (1 + hikePercentage / 100);
    const newBasicSalary = newCtc * basicPercentage;
    const newEmployeePF = newBasicSalary * 0.12;
    const newEmployerPF = newBasicSalary * 0.12;
    const newGratuity = newBasicSalary * 0.0481;
    const newGrossSalary = newCtc - newEmployerPF - newGratuity;
    
    const newTaxResultsPayload = calculateIncomeTax({ annualIncome: newGrossSalary, totalDeductions: 0 });
    const newTaxNewRegimeRaw = newTaxResultsPayload.results.find(r => r.id === 'tax_new')?.value ?? 0;
    const newTaxNewRegime = typeof newTaxNewRegimeRaw === 'string' ? parseFloat(newTaxNewRegimeRaw) || 0 : newTaxNewRegimeRaw;
    
    const newNetAnnualSalary = newGrossSalary - newEmployeePF - newTaxNewRegime;
    const newNetMonthlySalary = newNetAnnualSalary / 12;

    const monthlyIncrease = newNetMonthlySalary - netMonthlySalary;
    
    revisedResults = [
      { id: 'new_ctc', label: 'New CTC', value: Math.round(newCtc), isCurrency: true },
      { id: 'new_monthly', label: 'New Monthly In-Hand', value: Math.round(newNetMonthlySalary), isCurrency: true },
      { id: 'new_tax', label: 'New Income Tax', value: Math.round(newTaxNewRegime), isCurrency: true },
      { id: 'monthly_increase', label: 'Monthly Increase', value: Math.round(monthlyIncrease), isCurrency: true, isHighlighted: true },
    ];
  }

  return { 
    results,
    whatIfResults: revisedResults.length > 0 ? revisedResults : undefined
  };
}
