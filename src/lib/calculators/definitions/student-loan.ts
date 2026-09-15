import { CalculatorDefinition } from '../types';

export const studentLoanDefinition: CalculatorDefinition = {
  slug: 'student-loan-calculator',
  name: 'Student Loan Calculator',
  category: 'Education',
  categorySlug: 'education',
  shortDescription: 'Calculate your education loan EMI, total interest, and repayment schedule.',
  longDescription: 'Plan your higher education funding with our Student Loan Calculator. Estimate your monthly repayments and total interest based on your loan amount, interest rate, and tenure.',
  keywords: ['student loan calculator', 'education loan emi', 'education loan calculator india'],
  relatedCalculators: ['personal-loan-emi-calculator'],
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
      question: 'When does education loan repayment start?',
      answer: 'Typically, repayment starts after a moratorium period, which is usually the course duration plus 6 months or 1 year after getting a job, whichever is earlier.'
    },
    {
      question: 'Can I claim tax benefits on an education loan?',
      answer: 'Yes, under Section 80E of the Income Tax Act (Old Regime), the interest paid on an education loan is fully deductible for up to 8 years.'
    }
  ],
  inputs: [
    { id: 'loanAmount', label: 'Loan Amount', type: 'number', unit: '₹', min: 50000, max: 20000000, step: 10000, defaultValue: 1000000, helpText: 'Total education loan amount' },
    { id: 'interestRate', label: 'Interest Rate', type: 'number', unitOptions: ['% p.a.', '% p.m.'], min: 5, max: 18, step: 0.1, defaultValue: 9.5, helpText: 'Annual or monthly interest rate' },
    { id: 'tenure', label: 'Repayment Tenure', type: 'number', unitOptions: ['Years', 'Months'], min: 1, max: 180, step: 1, defaultValue: 7, helpText: 'How long to repay' },
  ],
  seoTitle: 'Student Education Loan Calculator India (2025) — Moratorium & EMI | IndiaWise',
  seoDescription: 'Calculate education loan EMIs, moratorium interest, and Section 80E tax deductions in India. Plan repayment for study in India and abroad.',
  formulaExplanation: {
    title: 'Education Loan Repayment & Moratorium Mechanics',
    formula: 'EMI = [P × R × (1 + R)^N] / [(1 + R)^N - 1]',
    explanation: 'Education loans feature a moratorium period (course duration + 6 to 12 months). Simple interest accrued during study is capitalized into principal before EMI amortization commences, unless serviced monthly during the degree program.'
  },
  benchmarks: {
    title: 'Indicative Education Loan Repayment (at 9.50% p.a. for 7 Years)',
    subtitle: 'Estimated monthly instalments across common Indian and overseas degree loan sizes',
    headers: ['Loan Amount', 'Monthly EMI', 'Total Interest', 'Total Repayment'],
    rows: [
      ['₹10,00,000', '₹16,351', '₹3,73,484', '₹13,73,484'],
      ['₹20,00,000', '₹32,702', '₹7,46,968', '₹27,46,968'],
      ['₹40,00,000', '₹65,404', '₹14,93,936', '₹54,93,936'],
      ['₹75,00,000', '₹1,22,633', '₹28,01,130', '₹1,03,01,130']
    ]
  },
  relatedGuides: [
    {
      title: 'Debt-to-Income (DTI) Ratio Explained',
      slug: 'debt-to-income-ratio-explained',
      description: 'Ensure starting graduate salary comfortably covers monthly student loan debt.'
    },
    {
      title: 'Understanding Income Tax Slabs & Deductions in India',
      slug: 'understanding-income-tax',
      description: 'Explore Section 80E interest deductions available under the Old Tax Regime.'
    }
  ]
};
