import { CalculatorDefinition } from '../types';

export const fdDefinition: CalculatorDefinition = {
  slug: 'fd-calculator',
  name: 'Fixed Deposit (FD) Calculator',
  category: 'Finance',
  categorySlug: 'finance',
  shortDescription: 'Calculate maturity amount and interest earned on your Fixed Deposit (FD) investments.',
  longDescription: 'Use our FD Calculator to find out how much your Fixed Deposit will grow over time with quarterly compounding. Plan your investments with accurate projections.',
  keywords: ['fd calculator', 'fixed deposit calculator', 'fd returns', 'india fd calculator', 'fd maturity value'],
  relatedCalculators: ['rd-calculator', 'sip-calculator'],
  whatIf: {
    id: 'fdCompareActive',
    label: 'Compare FD Options',
    type: 'fd-compare',
    min: 0,
    max: 1,
    step: 1,
    defaultValue: 0
  },
  faqs: [
    {
      question: 'How is FD interest calculated in India?',
      answer: 'Most banks in India calculate FD interest using quarterly compounding. The formula is A = P(1+r/4)^(4*t).'
    },
    {
      question: 'Is FD interest taxable?',
      answer: 'Yes, the interest earned on Fixed Deposits is fully taxable as per your income tax slab. Banks also deduct TDS at 10% if the interest exceeds ₹40,000 in a year (₹50,000 for senior citizens).'
    },
    {
      question: 'Can I withdraw my FD before maturity?',
      answer: 'Yes, most banks allow premature withdrawal of FDs, but they typically charge a penalty of 0.5% to 1% on the interest rate.'
    }
  ],
  inputs: [
    { id: 'principalAmount', label: 'Total Investment', type: 'number', unit: '₹', min: 5000, max: 10000000, step: 5000, defaultValue: 100000, helpText: 'Initial FD amount' },
    { id: 'interestRate', label: 'Interest Rate (p.a.)', type: 'number', unit: '%', min: 3, max: 15, step: 0.1, defaultValue: 7.5, helpText: 'Annual interest rate' },
    { id: 'tenure', label: 'Time Period', type: 'number', unit: 'Yrs', min: 1, max: 20, step: 1, defaultValue: 5, helpText: 'FD locking period' },
  ],
  schemaType: 'FinancialProduct',
};
