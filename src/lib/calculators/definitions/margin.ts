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
};
