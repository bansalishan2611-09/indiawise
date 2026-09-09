import { CalculatorDefinition } from '../types';

export const rdDefinition: CalculatorDefinition = {
  slug: 'rd-calculator',
  name: 'Recurring Deposit (RD) Calculator',
  category: 'Finance',
  categorySlug: 'finance',
  shortDescription: 'Calculate maturity amount and interest earned on your Recurring Deposit (RD).',
  longDescription: 'Use our RD Calculator to estimate the maturity value of your Recurring Deposit based on monthly deposit amount, interest rate, and tenure.',
  keywords: ['rd calculator', 'recurring deposit calculator', 'rd returns', 'india rd calculator', 'rd maturity value'],
  relatedCalculators: ['fd-calculator', 'sip-calculator'],
  faqs: [
    {
      question: 'What is a Recurring Deposit (RD)?',
      answer: 'An RD allows you to deposit a fixed amount every month for a pre-defined period and earn a fixed interest rate, similar to an FD.'
    },
    {
      question: 'Is RD better than SIP?',
      answer: 'RD provides guaranteed fixed returns and is risk-free, making it good for short-term goals. SIPs in mutual funds are subject to market risks but historically offer higher returns over the long term (5+ years).'
    },
    {
      question: 'What is the minimum amount for RD?',
      answer: 'Most banks in India allow you to start an RD with as little as ₹100 per month, though ₹500 or ₹1,000 is more common.'
    }
  ],
  inputs: [
    { id: 'monthlyInvestment', label: 'Monthly Deposit', type: 'number', unit: '₹', min: 500, max: 1000000, step: 500, defaultValue: 5000, helpText: 'Amount you deposit every month' },
    { id: 'expectedReturn', label: 'Interest Rate (p.a.)', type: 'number', unit: '%', min: 3, max: 15, step: 0.1, defaultValue: 7.0, helpText: 'Annual interest rate' },
    { id: 'timePeriod', label: 'Time Period', type: 'number', unit: 'Yrs', min: 1, max: 20, step: 1, defaultValue: 5, helpText: 'Duration of the RD' },
  ],
  schemaType: 'FinancialProduct',
};
