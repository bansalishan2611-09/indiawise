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
  whatIf: {
    id: 'extraInvestment',
    label: 'Increase Monthly RD',
    min: 0,
    max: 25000,
    step: 500,
    defaultValue: 0,
    unit: '₹'
  },
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
  seoTitle: 'Recurring Deposit (RD) Calculator India (2025) — Monthly Interest & Maturity | IndiaWise',
  seoDescription: 'Calculate bank recurring deposit (RD) maturity amount and interest earned in India with quarterly compounding. Compare monthly deposit options.',
  formulaExplanation: {
    title: 'Recurring Deposit (RD) Compounding Formula',
    formula: 'M = P × [(1 + i)^n - 1] / [1 - (1 + i)^(-1/3)]',
    explanation: 'Where M is the maturity value, P is the monthly deposit instalment, i is the quarterly rate of interest (r / 400), and n is the total number of quarters. Because monthly instalments are deposited sequentially while interest compounds quarterly, each instalment earns interest proportional to its remaining duration.'
  },
  benchmarks: {
    title: 'Standard RD Maturity Accumulation (at 7.00% p.a.)',
    subtitle: 'Illustrative maturity values across popular monthly deposit amounts and tenures',
    headers: ['Monthly RD', '1 Year', '3 Years', '5 Years'],
    rows: [
      ['₹2,000', '₹24,930', '₹80,314', '₹1,43,594'],
      ['₹5,000', '₹62,325', '₹2,00,785', '₹3,58,985'],
      ['₹10,000', '₹1,24,650', '₹4,01,570', '₹7,17,970'],
      ['₹25,000', '₹3,11,625', '₹10,03,925', '₹17,94,925']
    ]
  },
  relatedGuides: [
    {
      title: 'SIP vs FD: Which Investment is Right for You?',
      slug: 'sip-vs-fd-investment-comparison',
      description: 'Evaluate how guaranteed bank deposits stack up against systematic mutual fund investing.'
    },
    {
      title: 'How Much Emergency Fund Should You Have in India?',
      slug: 'how-much-emergency-fund-should-you-have',
      description: 'Build short-term emergency liquidity systematically with recurring deposits.'
    }
  ]
};
