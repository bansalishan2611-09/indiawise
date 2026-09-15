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
  whatIf: {
    id: 'extraInvestment',
    label: 'Increase Monthly SIP',
    min: 0,
    max: 50000,
    step: 500,
    defaultValue: 0,
    unit: '₹'
  },
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
  seoTitle: 'SIP Calculator India (2025) — Mutual Fund Returns & Wealth Growth | IndiaWise',
  seoDescription: 'Calculate expected returns on mutual fund SIP investments in India. Simulate wealth accumulation over 5, 10, 15, and 20 years with compound growth.',
  formulaExplanation: {
    title: 'Systematic Investment Plan (SIP) Compounding Formula',
    formula: 'M = P × [((1 + i)^n - 1) / i] × (1 + i)',
    explanation: 'Where M is the expected maturity amount, P is your regular monthly instalment, i is the periodic monthly rate (Annual expected return ÷ 12 ÷ 100), and n is the total number of monthly payments. Over extended periods, rupee-cost averaging combined with exponential compounding produces non-linear wealth creation.'
  },
  benchmarks: {
    title: 'SIP Wealth Growth Projections (at 12% Expected Annual Return)',
    subtitle: 'Illustrative maturity values across standard monthly commitments and time horizons',
    headers: ['Monthly SIP', '5 Years', '10 Years', '15 Years', '20 Years'],
    rows: [
      ['₹5,000', '₹4.12 Lakh', '₹11.62 Lakh', '₹25.23 Lakh', '₹49.96 Lakh'],
      ['₹10,000', '₹8.25 Lakh', '₹23.23 Lakh', '₹50.46 Lakh', '₹99.91 Lakh'],
      ['₹25,000', '₹20.62 Lakh', '₹58.08 Lakh', '₹1.26 Crore', '₹2.50 Crore'],
      ['₹50,000', '₹41.24 Lakh', '₹1.16 Crore', '₹2.52 Crore', '₹5.00 Crore']
    ]
  },
  relatedGuides: [
    {
      title: 'SIP vs FD: Which Investment is Right for You?',
      slug: 'sip-vs-fd-investment-comparison',
      description: 'Compare real inflation-adjusted wealth generation between equity mutual fund SIPs and guaranteed bank FDs.'
    },
    {
      title: 'How to Improve Your Financial Health Score',
      slug: 'how-to-improve-your-financial-health-score',
      description: 'See how an active investment rate directly boosts your overall personal finance resilience.'
    }
  ]
};
