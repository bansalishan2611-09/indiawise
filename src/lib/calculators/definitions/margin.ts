import { CalculatorDefinition } from '../types';

export const marginDefinition: CalculatorDefinition = {
  slug: 'margin-calculator',
  name: 'Margin & Markup Calculator',
  category: 'Business',
  categorySlug: 'business',
  shortDescription: 'Calculate your gross profit margin and markup based on cost and revenue.',
  longDescription: 'Use our Margin & Markup Calculator to instantly find your gross profit, margin percentage, and markup percentage. Essential for retail businesses and pricing strategies.',
  keywords: ['margin calculator', 'markup calculator', 'gross profit calculator', 'business calculator'],
  relatedCalculators: ['gst-calculator'],
  whatIf: {
    id: 'extraRevenue',
    label: 'Change Selling Price by',
    min: -5000,
    max: 5000,
    step: 50,
    defaultValue: 0,
    unit: '₹'
  },
  faqs: [
    {
      question: 'What is the difference between Margin and Markup?',
      answer: 'Margin is profit expressed as a percentage of Revenue. Markup is profit expressed as a percentage of Cost. For example, if a product costs ₹100 and sells for ₹150, the gross profit is ₹50. The margin is 33.3% (50/150), but the markup is 50% (50/100).'
    }
  ],
  inputs: [
    { id: 'cost', label: 'Cost of Goods', type: 'number', unit: '₹', min: 1, max: 10000000, step: 100, defaultValue: 1000, helpText: 'How much it costs to produce or buy' },
    { id: 'revenue', label: 'Selling Price', type: 'number', unit: '₹', min: 1, max: 10000000, step: 100, defaultValue: 1500, helpText: 'How much you sell it for' },
  ],
  seoTitle: 'Profit Margin & Markup Calculator — Gross Margin & Pricing | IndiaWise',
  seoDescription: 'Calculate gross profit margin and markup percentages from cost and selling price. Understand pricing math, gross revenue, and profit ratios.',
  formulaExplanation: {
    title: 'Profit Margin vs Markup Equations',
    formula: 'Gross Margin % = [(Revenue - Cost) / Revenue] × 100 | Markup % = [(Revenue - Cost) / Cost] × 100',
    explanation: 'Gross Margin represents the proportion of each rupee in sales retained as earnings. Markup represents the percentage added above production or procurement cost to determine sales price. While markup can rise above 100%, margin is always capped under 100%.'
  },
  benchmarks: {
    title: 'Margin vs Markup Equivalence Reference Table',
    subtitle: 'Mathematical pricing conversions between target gross margin and required markup percentage',
    headers: ['Target Margin %', 'Required Markup %', 'Cost of Goods', 'Selling Price'],
    rows: [
      ['10.0%', '11.1%', '₹1,000', '₹1,111'],
      ['20.0%', '25.0%', '₹1,000', '₹1,250'],
      ['33.3%', '50.0%', '₹1,000', '₹1,500'],
      ['50.0%', '100.0%', '₹1,000', '₹2,000']
    ]
  },
  relatedGuides: [
    {
      title: 'Understanding Income Tax Slabs & Deductions in India',
      slug: 'understanding-income-tax',
      description: 'Understand business vs personal tax implications on net income.'
    },
    {
      title: 'CTC vs In-Hand Salary Explained',
      slug: 'ctc-vs-in-hand-salary-explained',
      description: 'See how revenue translates into salary costs and employee payroll.'
    }
  ]
};
