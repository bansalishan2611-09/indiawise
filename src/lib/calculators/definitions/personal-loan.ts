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
};
