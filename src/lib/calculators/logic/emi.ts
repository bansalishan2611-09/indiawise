import { CalculatorResult, CalculatorResultPayload, AmortizationRow } from '../types';
import { parseInputValue } from '../formatters';

export function calculateEMI(inputs: Record<string, number | string>): CalculatorResultPayload {
  const principal = parseInputValue(inputs.loanAmount);
  
  // Handle toggles
  const rawRate = parseInputValue(inputs.interestRate);
  const isMonthlyRate = inputs.interestRate_unit === '% p.m.';
  const monthlyRate = isMonthlyRate ? (rawRate / 100) : (rawRate / 12 / 100);

  const rawTenure = parseInputValue(inputs.tenure);
  const isMonths = inputs.tenure_unit === 'Months';
  const n = isMonths ? rawTenure : (rawTenure * 12);

  let emi = 0;
  if (monthlyRate === 0) {
    emi = principal / n;
  } else {
    emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  }

  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;

  const amortization: AmortizationRow[] = [];
  if (emi > 0) {
    let balance = principal;
    for (let period = 1; period <= n; period++) {
      const interestForMonth = balance * monthlyRate;
      const principalForMonth = emi - interestForMonth;
      const closing = balance - principalForMonth;
      
      amortization.push({
        period,
        openingBalance: balance,
        emi,
        principalPaid: principalForMonth,
        interestPaid: interestForMonth,
        closingBalance: closing > 0 ? closing : 0,
      });
      balance = closing;
    }
  }

  const results: CalculatorResult[] = [
    { id: 'monthly_emi', label: 'Monthly EMI', value: Math.round(emi), isCurrency: true, isHighlighted: true, description: 'Amount to pay every month' },
    { id: 'total_payment', label: 'Total Payment', value: Math.round(totalPayment), isCurrency: true, description: 'Principal + Total Interest' },
    { id: 'total_interest', label: 'Total Interest', value: Math.round(totalInterest), isCurrency: true, description: 'Cost of borrowing' },
    { id: 'principal', label: 'Principal Amount', value: Math.round(principal), isCurrency: true, description: 'Original loan amount' },
  ];

  const annualSalary = parseInputValue(inputs.annualSalary || 0);
  const otherEMIs = parseInputValue(inputs.otherEMIs || 0);

  if (annualSalary > 0) {
    const monthlySalary = annualSalary / 12;
    const foir = ((emi + otherEMIs) / monthlySalary) * 100;
    
    let foirDesc = 'Healthy (Below 40%)';
    if (foir > 50) foirDesc = 'High Risk (Above 50%) - Loan rejection likely';
    else if (foir > 40) foirDesc = 'Moderate Risk (40-50%)';

    results.push({
      id: 'foir',
      label: 'EMI-to-Income Ratio (FOIR)',
      value: `${foir.toFixed(1)}%`,
      description: foirDesc,
      isHighlighted: false
    });
  }

  const extraPayment = parseInputValue(inputs.extraPayment || 0);

  let revisedResults: CalculatorResult[] = [];
  
  if (extraPayment > 0 && emi > 0) {
    let balance = principal;
    let actualMonths = 0;
    let newTotalInterest = 0;
    const effectiveEmi = emi + extraPayment;
    
    // Safety limit to prevent infinite loops (max 100 years)
    const MAX_MONTHS = 1200; 
    
    for (let period = 1; period <= MAX_MONTHS; period++) {
      if (balance <= 0) break;
      
      const interestForMonth = balance * monthlyRate;
      let payment = effectiveEmi;
      
      // Final month partial payment
      if (balance + interestForMonth < payment) {
         payment = balance + interestForMonth; 
      }
      
      const principalForMonth = payment - interestForMonth;
      
      newTotalInterest += interestForMonth;
      balance -= principalForMonth;
      actualMonths++;
    }
    
    const monthsSaved = n - actualMonths;
    const interestSaved = totalInterest - newTotalInterest;
    const newTotalPayment = principal + newTotalInterest;
    
    revisedResults = [
       { id: 'effective_emi', label: 'New Effective Payment', value: Math.round(effectiveEmi), isCurrency: true },
       { id: 'revised_tenure', label: 'New Tenure', value: actualMonths, unit: 'Months' },
       { id: 'time_saved', label: 'Time Saved', value: monthsSaved, unit: 'Months' },
       { id: 'interest_saved', label: 'Interest Saved', value: Math.round(interestSaved), isCurrency: true, isHighlighted: true },
       { id: 'revised_interest', label: 'New Total Interest', value: Math.round(newTotalInterest), isCurrency: true },
       { id: 'revised_payment', label: 'New Total Payment', value: Math.round(newTotalPayment), isCurrency: true }
    ];
  }

  return { 
    results,
    whatIfResults: revisedResults.length > 0 ? revisedResults : undefined,
    amortization
  };
}
