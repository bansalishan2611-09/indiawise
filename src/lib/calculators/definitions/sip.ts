import { CalculatorDefinition } from '../types';

export const sipDefinition: CalculatorDefinition = {
  slug: 'sip-calculator',
  name: 'SIP Calculator',
  category: 'Finance',
  categorySlug: 'finance',
  shortDescription: 'Calculate returns on your Systematic Investment Plan in mutual funds.',
  longDescription: 'Our SIP Calculator helps you estimate the wealth you can create through monthly SIP investments. Plan your financial goals with accurate projections.',
  keywords: ['sip calculator', 'mutual fund sip', 'systematic investment plan', 'sip returns india'],
  relatedCalculators: ['home-loan-emi', 'gst-calculator'],
  faqs: [
    { question: 'What is SIP?', answer: 'SIP (Systematic Investment Plan) is a method of investing a fixed amount in mutual funds at regular intervals, typically monthly.' },
    { question: 'What return to expect from SIP?', answer: 'Equity mutual funds in India have historically delivered 12–15% annual returns over the long term.' },
    { question: 'Can I start SIP with ₹500?', answer: 'Yes. Many mutual funds allow SIP investments starting from ₹500 per month.' },
  ],
  inputs: [
    { id: 'monthlyInvestment', label: 'Monthly Investment', type: 'number', unit: '₹', min: 500, max: 1000000, step: 500, defaultValue: 10000, placeholder: 'Monthly SIP amount' },
    { id: 'expectedReturn', label: 'Expected Annual Return', type: 'number', unit: '%', min: 1, max: 30, step: 0.5, defaultValue: 12, placeholder: 'Expected return %' },
    { id: 'duration', label: 'Investment Duration', type: 'number', unit: 'Yrs', min: 1, max: 40, step: 1, defaultValue: 10, placeholder: 'Duration in years' },
  ],
};
