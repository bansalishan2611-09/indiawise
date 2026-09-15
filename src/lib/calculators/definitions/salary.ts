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
  whatIf: {
    id: 'hikePercentage',
    label: 'What if I get a hike of?',
    min: 0,
    max: 100,
    step: 1,
    defaultValue: 0,
    unit: '%'
  },
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
  seoTitle: 'In-Hand Salary Calculator India (2025) — CTC to Take-Home Breakdown | IndiaWise',
  seoDescription: 'Calculate actual monthly in-hand take-home salary from annual CTC in India. Detailed itemized breakdown of EPF, Gratuity, Standard Deduction, and TDS.',
  formulaExplanation: {
    title: 'CTC to In-Hand Salary Equation',
    formula: 'Monthly In-Hand = [Gross Monthly Salary - Employee EPF (12% Basic) - Income Tax (TDS) - Professional Tax]',
    explanation: 'Cost to Company (CTC) comprises both your direct pay and employer-side provisions. Gross Salary equals CTC minus Employer PF (12% of Basic) and Gratuity (approx 4.81% of Basic). Your net take-home bank credit reflects gross salary less employee PF and monthly income tax TDS.'
  },
  benchmarks: {
    title: 'Indicative CTC vs Monthly In-Hand Salary (New Tax Regime)',
    subtitle: 'Estimated monthly bank credit assuming 50% Basic Salary structure with standard EPF and tax deductions',
    headers: ['Annual CTC', 'Gross Annual', 'Monthly In-Hand', 'Total Monthly Deductions'],
    rows: [
      ['₹6,00,000', '₹5,31,000', '₹41,250', '₹8,750 / mo'],
      ['₹12,00,000', '₹10,62,000', '₹76,450', '₹23,550 / mo'],
      ['₹18,00,000', '₹15,93,000', '₹1,09,100', '₹40,900 / mo'],
      ['₹25,00,000', '₹22,12,500', '₹1,44,700', '₹63,600 / mo']
    ]
  },
  relatedGuides: [
    {
      title: 'CTC vs In-Hand Salary Explained',
      slug: 'ctc-vs-in-hand-salary-explained',
      description: 'Breakdown of basic salary, HRA, special allowance, EPF, and gratuity provisions.'
    },
    {
      title: 'Understanding Income Tax Slabs & Deductions in India',
      slug: 'understanding-income-tax',
      description: 'Evaluate New vs Old Regime slabs to minimize TDS deductions on your pay slips.'
    }
  ]
};
