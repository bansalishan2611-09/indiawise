import { CalculatorResult, CalculatorResultPayload } from '../types';
import { parseInputValue } from '../formatters';

export function calculateIncomeTax(inputs: Record<string, number | string>): CalculatorResultPayload {
  const grossIncome = parseInputValue(inputs.annualIncome);
  
  const sec80C = Math.min(150000, parseInputValue(inputs.section80C || 0));
  const sec80D = parseInputValue(inputs.section80D || 0);
  const hra = parseInputValue(inputs.hraExemption || 0);
  const homeLoan = Math.min(200000, parseInputValue(inputs.homeLoanInterest || 0));
  const other = parseInputValue(inputs.otherDeductions || 0);
  const legacyDeductions = inputs.totalDeductions !== undefined ? parseInputValue(inputs.totalDeductions) : 0;
  
  const deductions = legacyDeductions > 0 ? legacyDeductions : (sec80C + sec80D + hra + homeLoan + other);

  // --- Old Regime ---
  const standardDeductionOld = 50000;
  const taxableIncomeOld = Math.max(0, grossIncome - deductions - standardDeductionOld);
  let taxOld = 0;
  
  if (taxableIncomeOld > 250000) {
    if (taxableIncomeOld <= 500000) {
      taxOld = (taxableIncomeOld - 250000) * 0.05;
      // Rebate under 87A
      if (taxableIncomeOld <= 500000) taxOld = 0;
    } else if (taxableIncomeOld <= 1000000) {
      taxOld = 12500 + (taxableIncomeOld - 500000) * 0.20;
    } else {
      taxOld = 112500 + (taxableIncomeOld - 1000000) * 0.30;
    }
  }
  
  // Add 4% Health & Education Cess
  if (taxOld > 0) taxOld *= 1.04;

  // --- New Regime (FY 2024-25) ---
  const standardDeductionNew = 75000; // Updated in Budget 2024
  // Deductions like 80C are NOT allowed in New Regime, so we ignore `deductions`
  const taxableIncomeNew = Math.max(0, grossIncome - standardDeductionNew);
  let taxNew = 0;

  if (taxableIncomeNew > 300000) {
    if (taxableIncomeNew <= 700000) {
      taxNew = (taxableIncomeNew - 300000) * 0.05;
    } else if (taxableIncomeNew <= 1000000) {
      taxNew = 20000 + (taxableIncomeNew - 700000) * 0.10;
    } else if (taxableIncomeNew <= 1200000) {
      taxNew = 50000 + (taxableIncomeNew - 1000000) * 0.15;
    } else if (taxableIncomeNew <= 1500000) {
      taxNew = 80000 + (taxableIncomeNew - 1200000) * 0.20;
    } else {
      taxNew = 140000 + (taxableIncomeNew - 1500000) * 0.30;
    }
  }
  
  // Rebate under 87A (New Regime allows up to 7,00,000)
  if (taxableIncomeNew <= 700000) {
    taxNew = 0;
  } else {
    // Marginal relief for income just above 7L
    const taxOn7L = 0; // It's rebated
    const excessIncome = taxableIncomeNew - 700000;
    if (taxNew > excessIncome) {
        taxNew = excessIncome;
    }
  }

  if (taxNew > 0) taxNew *= 1.04; // Cess

  const taxSaved = Math.max(0, taxOld - taxNew);
  const recommended = taxNew <= taxOld ? 'New Regime' : 'Old Regime';
  const recommendedTax = Math.min(taxOld, taxNew);

  return { results: [
    { id: 'tax_payable', label: 'Tax Payable', value: Math.round(recommendedTax), isCurrency: true, isHighlighted: true, description: `Under ${recommended}` },
    { id: 'tax_new', label: 'Tax (New Regime)', value: Math.round(taxNew), isCurrency: true, description: 'Default for FY 24-25' },
    { id: 'tax_old', label: 'Tax (Old Regime)', value: Math.round(taxOld), isCurrency: true, description: 'With exemptions' },
    { id: 'tax_saved', label: 'Tax Saved', value: Math.round(Math.abs(taxOld - taxNew)), isCurrency: true, description: `By choosing ${recommended}` },
  ] };
}
