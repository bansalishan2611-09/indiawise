import { CalculatorDefinition } from '../types';

export const salaryDefinition: CalculatorDefinition = {
  slug: 'in-hand-salary-calculator',
  name: 'In-Hand Salary Calculator',
  category: 'Salary',
  categorySlug: 'salary',
  shortDescription: 'Calculate your actual take-home (in-hand) salary from your CTC after PF and Tax deductions.',
  longDescription: 'Use our In-Hand Salary Calculator to find out your monthly take-home salary from your CTC. Factors in EPF, Gratuity, and New Regime Income Tax automatically.',
  keywords: ['in hand salary calculator', 'ctc calculator', 'take home pay calculator', 'india salary calculator', 'ctc to in hand'],
  relatedCalculators: ['income-tax-calculator'],
  faqs: [
    {
      question: 'Why is my in-hand salary lower than my CTC / 12?',
      answer: 'Your CTC includes Employer PF contributions, Gratuity, and sometimes insurance premiums. These are deducted to arrive at Gross Salary. Then, Employee PF and Income Tax are deducted to get your final in-hand salary.'
    },
    {
      question: 'How much PF is deducted from my salary?',
      answer: 'Typically, 12% of your Basic Salary is deducted as your contribution, and another 12% is contributed by your employer (which is part of your CTC).'
    },
    {
      question: 'What percentage of CTC is Basic Salary?',
      answer: 'Most companies set Basic Salary between 40% to 50% of CTC. A higher basic means higher PF contributions and gratuity.'
    }
  ],
  inputs: [
    { id: 'ctc', label: 'Cost to Company (CTC)', type: 'number', unit: '₹', min: 200000, max: 50000000, step: 50000, defaultValue: 1200000, helpText: 'Your total annual package' },
    { id: 'basicPercentage', label: 'Basic Salary (% of CTC)', type: 'number', unit: '%', min: 30, max: 60, step: 1, defaultValue: 50, helpText: 'Usually 40% to 50% of CTC' },
  ],
};
