import { CalculatorDefinition } from '../types';

export const personalLoanDefinition: CalculatorDefinition = {
  slug: 'personal-loan-emi-calculator',
  name: 'Personal Loan EMI Calculator',
  category: 'Finance',
  categorySlug: 'finance',
  shortDescription: 'Calculate your monthly EMI, total interest, and repayment schedule for a personal loan.',
  longDescription: 'Use our Personal Loan EMI Calculator to find out your monthly installment, total interest payout, and full repayment schedule based on your loan amount, interest rate, and tenure.',
  keywords: ['personal loan emi calculator', 'emi calculator personal loan', 'loan emi calculator', 'india personal loan'],
  relatedCalculators: ['home-loan-emi', 'fd-calculator'],
  whatIf: {
    id: 'extraPayment',
    label: 'Pay Extra Every Month',
    min: 0,
    max: 25000,
    step: 500,
    defaultValue: 0,
    unit: '₹'
  },
  faqs: [
    {
      question: 'How is Personal Loan EMI calculated?',
      answer: 'The EMI is calculated using the formula: [P x R x (1+R)^N]/[(1+R)^N-1], where P is Principal, R is monthly interest rate, and N is tenure in months.'
    },
    {
      question: 'Is it better to choose a longer tenure for a personal loan?',
      answer: 'A longer tenure reduces your monthly EMI burden but significantly increases the total interest you will pay to the bank. A shorter tenure keeps the interest cost low.'
    },
    {
      question: 'What is the typical interest rate for personal loans in India?',
      answer: 'Personal loan interest rates in India typically range from 10% to 24% p.a. depending on your credit score, income, and the lender.'
    }
  ],
  inputs: [
    { id: 'loanAmount', label: 'Loan Amount', type: 'number', unit: '₹', min: 10000, max: 5000000, step: 10000, defaultValue: 500000, helpText: 'Amount you want to borrow' },
    { id: 'interestRate', label: 'Interest Rate', type: 'number', unitOptions: ['% p.a.', '% p.m.'], min: 8, max: 30, step: 0.1, defaultValue: 12.5, helpText: 'Annual or monthly interest rate' },
    { id: 'tenure', label: 'Loan Tenure', type: 'number', unitOptions: ['Years', 'Months'], min: 1, max: 84, step: 1, defaultValue: 3, helpText: 'Duration of the loan' },
  ],
  schemaType: 'FinancialProduct',
  seoTitle: 'Personal Loan EMI Calculator India (2025) — Interest & Amortization | IndiaWise',
  seoDescription: 'Calculate personal loan EMIs, total interest payout, and amortization schedule in India. Discover how prepayments reduce expensive interest charges.',
  formulaExplanation: {
    title: 'Personal Loan EMI Calculation Model',
    formula: 'EMI = [P × R × (1 + R)^N] / [(1 + R)^N - 1]',
    explanation: 'Because personal loans are unsecured, interest rates (10.5%–24% p.a.) are markedly higher than secured loans. Monthly interest is computed on reducing principal, meaning even small prepayments dramatically lower your overall interest burden.'
  },
  benchmarks: {
    title: 'Representative Personal Loan EMIs (at 12.50% p.a.)',
    subtitle: 'Monthly instalments and total interest across 1, 3, and 5-year tenures',
    headers: ['Loan Amount', '1 Year Tenure', '3 Years Tenure', '5 Years Tenure'],
    rows: [
      ['₹1,00,000', '₹8,908 (Int: ₹6,900)', '₹3,346 (Int: ₹20,446)', '₹2,250 (Int: ₹34,988)'],
      ['₹3,00,000', '₹26,725 (Int: ₹20,699)', '₹10,037 (Int: ₹61,338)', '₹6,749 (Int: ₹1,04,964)'],
      ['₹5,00,000', '₹44,541 (Int: ₹34,498)', '₹16,727 (Int: ₹1,02,164)', '₹11,249 (Int: ₹1,74,940)'],
      ['₹10,00,000', '₹89,082 (Int: ₹68,996)', '₹33,453 (Int: ₹2,04,328)', '₹22,498 (Int: ₹3,49,879)']
    ]
  },
  relatedGuides: [
    {
      title: 'Debt-to-Income (DTI) Ratio Explained',
      slug: 'debt-to-income-ratio-explained',
      description: 'Evaluate how high-interest personal loans push your DTI ratio into the dangerous zone.'
    },
    {
      title: 'EMI vs Income: The 40% Affordability Rule',
      slug: 'emi-vs-income-loan-affordability',
      description: 'Prevent debt overload by keeping aggregate monthly loan instalments within safe boundaries.'
    }
  ]
};
