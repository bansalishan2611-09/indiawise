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
};
