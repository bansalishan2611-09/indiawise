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

  return { results: [
    { id: 'monthly_in_hand', label: 'Monthly In-Hand', value: Math.round(netMonthlySalary), isCurrency: true, isHighlighted: true, description: 'Approx. take-home pay' },
    { id: 'annual_in_hand', label: 'Annual In-Hand', value: Math.round(netAnnualSalary), isCurrency: true, description: 'Net yearly salary' },
    { id: 'total_tax', label: 'Income Tax', value: Math.round(taxNewRegime), isCurrency: true, description: 'Estimated tax (New Regime)' },
    { id: 'total_pf', label: 'Total PF Contribution', value: Math.round(employeePF + employerPF), isCurrency: true, description: 'Employee + Employer PF' },
  ] };
}
