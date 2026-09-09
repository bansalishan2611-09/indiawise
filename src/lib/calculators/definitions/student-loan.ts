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
};
