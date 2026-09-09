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
};
