import { CalculatorDefinition } from '../types';

export const incomeTaxDefinition: CalculatorDefinition = {
  slug: 'income-tax-calculator',
  name: 'Income Tax Calculator (FY 2024-25)',
  category: 'Tax',
  categorySlug: 'tax',
  shortDescription: 'Compare Old vs New Tax Regime and find out your exact tax liability for FY 2024-25.',
  longDescription: `The Income Tax Calculator helps Indian taxpayers estimate their tax liability for the financial year. With the introduction of the revised tax slabs, deciding between the Old and New Tax Regimes has become a critical step for salaried individuals and professionals.

Old vs New Tax Regime (FY 2024-25 / AY 2025-26):
• The New Tax Regime is the default option and offers lower tax rates. It includes a Standard Deduction of ₹75,000 for salaried employees but removes most other exemptions (like HRA, 80C, 80D). Under this regime, income up to ₹7,00,000 is entirely tax-free due to the Section 87A rebate.
• The Old Tax Regime has higher slab rates but allows you to claim over 70 deductions and exemptions. If you have significant investments in PPF, ELSS, life insurance (80C), pay health insurance premiums (80D), or pay home loan interest (Section 24b), the Old Regime might still result in lower overall tax.

How to use this tool:
Simply input your Gross Annual Income. If you have active investments or claim HRA, open the "Advanced Settings" to enter your deductions. The calculator will automatically apply the respective rules for both regimes, factor in the 4% Health and Education Cess, and provide a clear side-by-side comparison to help you choose the best tax-saving strategy.`,
  keywords: ['income tax calculator', 'old vs new regime', 'tax calculator india', 'fy 24-25 tax calculator', 'income tax india'],
  relatedCalculators: ['in-hand-salary-calculator', 'gst-calculator'],
  faqs: [
    {
      question: 'Which tax regime is better?',
      answer: 'It depends on your deductions. If you claim significant deductions (HRA, 80C, home loan interest), the Old Regime might save you money. Otherwise, the New Regime is generally better and is now the default.'
    },
    {
      question: 'Are standard deductions allowed in the New Regime?',
      answer: 'Yes, Budget 2024 increased the standard deduction in the New Regime to ₹75,000 for salaried employees.'
    },
    {
      question: 'What is the rebate under Section 87A?',
      answer: 'Under the New Regime, if your taxable income is up to ₹7,00,000, you get a full rebate — meaning zero tax. Under the Old Regime, the rebate applies up to ₹5,00,000.'
    }
  ],
  inputs: [
    { id: 'annualIncome', label: 'Gross Annual Income', type: 'number', unit: '₹', min: 200000, max: 50000000, step: 50000, defaultValue: 1200000, helpText: 'Total income before any deductions' },
    { id: 'section80C', label: '80C Investments', type: 'number', unit: '₹', min: 0, max: 150000, step: 10000, defaultValue: 150000, isAdvanced: true, helpText: 'EPF, PPF, LIC, ELSS, etc. (Max ₹1.5L)' },
    { id: 'section80D', label: '80D Health Insurance', type: 'number', unit: '₹', min: 0, max: 100000, step: 5000, defaultValue: 0, isAdvanced: true, helpText: 'Medical insurance premiums' },
    { id: 'hraExemption', label: 'HRA Exemption', type: 'number', unit: '₹', min: 0, max: 2000000, step: 10000, defaultValue: 0, isAdvanced: true, helpText: 'Exempted portion of House Rent Allowance' },
    { id: 'homeLoanInterest', label: 'Home Loan Interest', type: 'number', unit: '₹', min: 0, max: 200000, step: 10000, defaultValue: 0, isAdvanced: true, helpText: 'Interest paid on home loan (Sec 24b, Max ₹2L)' },
    { id: 'otherDeductions', label: 'Other Deductions', type: 'number', unit: '₹', min: 0, max: 1000000, step: 10000, defaultValue: 0, isAdvanced: true, helpText: 'Any other exemptions for Old Regime' },
  ],
};
