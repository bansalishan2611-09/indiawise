import { CalculatorDefinition } from '../types';

export const ageDefinition: CalculatorDefinition = {
  slug: 'age-calculator',
  name: 'Age Calculator',
  category: 'Everyday',
  categorySlug: 'everyday',
  shortDescription: 'Calculate your exact age in years, months, days, weeks, and total days from your date of birth.',
  longDescription: 'Use our Age Calculator to find your exact age broken down into years, months, and days. Also see your age in total months, weeks, and days.',
  keywords: ['age calculator', 'calculate age', 'age from date of birth', 'how old am i', 'dob calculator'],
  relatedCalculators: ['bmi-calculator'],
  faqs: [
    {
      question: 'How is age calculated?',
      answer: 'Age is calculated by computing the difference between your date of birth and the current date, broken down into years, months, and remaining days.'
    },
    {
      question: 'Is this calculator accurate?',
      answer: 'Yes, it accounts for varying month lengths and leap years. The age is calculated as of today\'s date on your device.'
    },
    {
      question: 'Why do I need to enter year, month, and day separately?',
      answer: 'This ensures maximum browser compatibility and avoids formatting issues with date pickers across different devices.'
    }
  ],
  inputs: [
    { id: 'birthYear', label: 'Birth Year', type: 'number', min: 1900, max: 2026, step: 1, defaultValue: 2000, helpText: 'e.g. 1995' },
    { id: 'birthMonth', label: 'Birth Month', type: 'number', min: 1, max: 12, step: 1, defaultValue: 1, helpText: '1 = January, 12 = December' },
    { id: 'birthDay', label: 'Birth Day', type: 'number', min: 1, max: 31, step: 1, defaultValue: 1, helpText: 'Day of the month' },
  ],
  seoTitle: 'Age Calculator — Exact Age in Years, Months, Weeks & Days | IndiaWise',
  seoDescription: 'Calculate exact age from date of birth in years, months, weeks, days, hours, and minutes. Includes leap year accounting and milestone tracking.',
  formulaExplanation: {
    title: 'Chronological Age Computation Methodology',
    formula: 'Chronological Age = Current Date (Y-M-D) - Date of Birth (Y-M-D) with Leap Day Adjustment',
    explanation: 'The calculation resolves calendar months dynamically (28/29, 30, or 31 days) and accounts for quadrennial Gregorian leap years, guaranteeing exact day-level precision.'
  },
  benchmarks: {
    title: 'Standard Life Milestones in India',
    subtitle: 'Statutory age thresholds and rights across personal, civil, and financial domains',
    headers: ['Age Milestone', 'Classification', 'Statutory / Financial Rights'],
    rows: [
      ['18 Years', 'Legal Adulthood', 'Right to vote, driving license eligibility, independent bank accounts'],
      ['21 Years', 'Civil Rights', 'Statutory eligibility thresholds under various civil acts'],
      ['60 Years', 'Senior Citizen', 'Higher bank FD interest rates (+0.50%), elevated tax rebate thresholds'],
      ['80 Years', 'Super Senior Citizen', 'Special healthcare priority and senior banking privileges']
    ]
  },
  relatedGuides: [
    {
      title: 'How to Improve Your Financial Health Score',
      slug: 'how-to-improve-your-financial-health-score',
      description: 'Align your savings, investments, and debt elimination strategies with your age bracket.'
    },
    {
      title: 'Understanding Income Tax Slabs & Deductions in India',
      slug: 'understanding-income-tax',
      description: 'Explore tax brackets and age-based deduction provisions.'
    }
  ]
};
