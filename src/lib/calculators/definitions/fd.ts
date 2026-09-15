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
  seoTitle: 'Fixed Deposit (FD) Calculator India (2025) — Quarterly Compounding & Returns | IndiaWise',
  seoDescription: 'Calculate maturity value and interest earned on bank fixed deposits in India. Uses official quarterly compounding formulas with Senior Citizen comparison.',
  formulaExplanation: {
    title: 'Bank Fixed Deposit Quarterly Compounding Formula',
    formula: 'A = P × [1 + (r / 400)]^(4 × t)',
    explanation: 'Where A is the total maturity payout, P is the principal deposited, r is the annual nominal interest rate in percent, and t is the investment tenure in years. Major scheduled commercial banks in India (such as SBI, HDFC, ICICI, and Axis) calculate interest using quarterly rests.'
  },
  benchmarks: {
    title: 'Representative Bank FD Returns Across Tenures (at 7.00% p.a.)',
    subtitle: 'Illustrative maturity values for varying principal amounts with quarterly compounding',
    headers: ['Deposit Amount', '1 Year', '3 Years', '5 Years', '10 Years'],
    rows: [
      ['₹50,00,00', '₹53,593', '₹61,572', '₹70,739', '₹1,00,080'],
      ['₹1,00,000', '₹1,07,186', '₹1,23,144', '₹1,41,478', '₹2,00,160'],
      ['₹5,00,000', '₹5,35,929', '₹6,15,719', '₹7,07,389', '₹10,00,799'],
      ['₹10,00,000', '₹10,71,859', '₹12,31,439', '₹14,14,778', '₹20,01,597']
    ]
  },
  relatedGuides: [
    {
      title: 'SIP vs FD: Which Investment is Right for You?',
      slug: 'sip-vs-fd-investment-comparison',
      description: 'Explore the risk-return spectrum, real inflation drag, and taxation differences between fixed income and equity.'
    },
    {
      title: 'How Much Emergency Fund Should You Have in India?',
      slug: 'how-much-emergency-fund-should-you-have',
      description: 'Find out why high-liquidity bank FDs remain an ideal vehicle for capital preservation.'
    }
  ]
};
