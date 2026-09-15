import { CalculatorDefinition } from '../types';

export const gstDefinition: CalculatorDefinition = {
  slug: 'gst-calculator',
  name: 'GST Calculator',
  category: 'Tax',
  categorySlug: 'tax',
  shortDescription: 'Calculate GST on any amount. Supports all slabs: 5%, 12%, 18%, and 28%.',
  longDescription: 'Our GST Calculator helps businesses and individuals quickly calculate Goods and Services Tax for any amount. Supports both exclusive and inclusive calculations with CGST/SGST breakdowns.',
  keywords: ['gst calculator', 'gst calculation india', 'goods services tax', 'cgst sgst calculator'],
  relatedCalculators: ['home-loan-emi', 'sip-calculator'],
  whatIf: {
    id: 'extraAmount',
    label: 'Change Amount by',
    min: -5000,
    max: 5000,
    step: 100,
    defaultValue: 0,
    unit: '₹'
  },
  faqs: [
    { question: 'What is GST?', answer: 'GST (Goods and Services Tax) is a comprehensive indirect tax levied on supply of goods and services in India.' },
    { question: 'What are GST slabs in India?', answer: 'GST has four main slabs: 5%, 12%, 18%, and 28%. Basic necessities are at 0%.' },
    { question: 'What is CGST and SGST?', answer: 'For intra-state transactions, GST is split equally: CGST (Central) and SGST (State). For inter-state, IGST applies.' },
  ],
  inputs: [
    { id: 'amount', label: 'Amount', type: 'number', unit: '₹', min: 1, step: 1, defaultValue: 1000, placeholder: 'Enter amount' },
    { id: 'gstRate', label: 'GST Rate', type: 'select', defaultValue: 18, options: [{ label: '5%', value: 5 }, { label: '12%', value: 12 }, { label: '18%', value: 18 }, { label: '28%', value: 28 }] },
    { id: 'calculationType', label: 'Calculation Type', type: 'radio', defaultValue: 'exclusive', options: [{ label: 'GST Exclusive (Add GST)', value: 'exclusive' }, { label: 'GST Inclusive (Remove GST)', value: 'inclusive' }] },
  ],
  seoTitle: 'GST Calculator India (2025) — Inclusive & Exclusive CGST/SGST Slabs | IndiaWise',
  seoDescription: 'Calculate GST amounts instantly for 5%, 12%, 18%, and 28% slabs. Includes separate CGST/SGST/IGST breakdown and reverse inclusive calculation.',
  formulaExplanation: {
    title: 'GST Calculation Formulas (Inclusive vs Exclusive)',
    formula: 'Exclusive: GST = (Base Amount × Rate) / 100 | Inclusive: GST = Net Amount - [Net Amount × (100 / (100 + Rate))]',
    explanation: 'For GST-exclusive items, tax is computed directly on the base supply price. For GST-inclusive pricing (such as retail MRPs), the embedded tax is extracted via reverse percentage mathematics. For intra-state supplies, tax is split equally between CGST and SGST.'
  },
  benchmarks: {
    title: 'Standard Indian GST Rate Slabs & Representative Goods/Services',
    subtitle: 'Official tax brackets enacted under the Goods and Services Tax Act in India',
    headers: ['GST Slab', 'CGST + SGST', 'Representative Categories', 'Tax on ₹10,000 Base'],
    rows: [
      ['5%', '2.5% + 2.5%', 'Packaged food staples, economy air travel, footwear under ₹1,000', '₹500'],
      ['12%', '6% + 6%', 'Processed food items, business air travel, select electronics', '₹1,200'],
      ['18%', '9% + 9%', 'IT services, financial services, telecom, hotel dining, appliances', '₹1,800'],
      ['28%', '14% + 14%', 'Automobiles, luxury goods, cement, aerated drinks, high-end consumer goods', '₹2,800']
    ]
  },
  relatedGuides: [
    {
      title: 'Understanding Income Tax Slabs & Deductions in India',
      slug: 'understanding-income-tax',
      description: 'Explore direct tax mechanics, New vs Old Tax Regime, and Section 87A rebate rules.'
    },
    {
      title: 'CTC vs In-Hand Salary Explained',
      slug: 'ctc-vs-in-hand-salary-explained',
      description: 'Learn how statutory deductions, EPF, and TDS impact your net monthly earnings.'
    }
  ]
};
