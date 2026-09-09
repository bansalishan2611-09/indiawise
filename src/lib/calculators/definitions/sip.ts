import { CalculatorDefinition } from '../types';

export const sipDefinition: CalculatorDefinition = {
  slug: 'sip-calculator',
  name: 'SIP Calculator',
  category: 'Finance',
  categorySlug: 'finance',
  shortDescription: 'Calculate returns on your Systematic Investment Plan in mutual funds.',
  longDescription: `A Systematic Investment Plan (SIP) Calculator helps you estimate the future value of your mutual fund investments. SIPs are one of the most popular ways for retail investors in India to build long-term wealth, allowing you to invest a fixed amount regularly (e.g., monthly) into equity or debt mutual funds.

How it works:
The SIP calculator uses the compound interest formula to project your returns: M = P × ({[1 + i]^n – 1} / i) × (1 + i)
• M = Expected maturity amount
• P = Regular SIP instalment amount
• i = Periodic rate of interest (Annual return / 12 / 100)
• n = Total number of payments (Years × 12)

Why start a SIP?
SIPs bring financial discipline and allow you to benefit from "Rupee Cost Averaging". When the markets are down, your fixed instalment buys more mutual fund units; when markets are up, it buys fewer. Over a long tenure (10+ years), this significantly reduces market volatility risks and harnesses the power of compounding.`,
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
