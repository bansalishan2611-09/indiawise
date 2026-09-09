import { CalculatorDefinition } from '../types';

export const emiDefinition: CalculatorDefinition = {
  slug: 'home-loan-emi',
  name: 'Home Loan EMI Calculator',
  category: 'Finance',
  categorySlug: 'finance',
  shortDescription: 'Calculate your monthly home loan EMI, total interest, and repayment breakdown instantly.',
  longDescription: `A Home Loan EMI Calculator is an essential financial tool that helps you estimate your Equated Monthly Instalments (EMI) before you commit to a home loan. When you borrow money from a bank or housing finance company (HFC) in India, you are required to repay the principal amount along with the applicable interest over a specified tenure.

How it works:
Our calculator uses the standard EMI formula: EMI = [P x R x (1+R)^N] / [(1+R)^N-1]
• P = Principal loan amount
• R = Monthly interest rate (Annual rate / 12 / 100)
• N = Loan tenure in months

Why use this calculator?
Knowing your exact monthly commitment allows you to plan your household budget efficiently. Additionally, you can adjust the "Loan Tenure" to see how it impacts your EMI and the total interest outflow. A shorter tenure increases your EMI but significantly reduces the total interest paid to the bank. 

Note: While this calculator gives highly accurate estimates, your final bank EMI may vary slightly depending on processing fees, GST, and specific bank compounding rules.`,
  keywords: ['home loan emi', 'emi calculator', 'loan calculator', 'housing loan', 'mortgage calculator india'],
  relatedCalculators: ['sip-calculator', 'gst-calculator'],
  faqs: [
    { question: 'What is EMI?', answer: 'EMI (Equated Monthly Instalment) is a fixed monthly payment made by a borrower to a lender. It includes both the principal and interest components.' },
    { question: 'How is EMI calculated?', answer: 'EMI = P × r × (1+r)^n / ((1+r)^n - 1), where P is principal, r is monthly rate, and n is number of months.' },
    { question: 'Does changing tenure affect EMI?', answer: 'Yes. A longer tenure reduces monthly EMI but increases the total interest paid over the loan period.' },
    { question: 'What is the maximum home loan tenure in India?', answer: 'Most banks offer tenures up to 30 years. 20 years is the most common choice.' },
    { question: 'Can I prepay my home loan?', answer: 'Yes. Most Indian banks allow prepayment, reducing outstanding principal and saving significant interest.' },
  ],
  inputs: [
    { id: 'loanAmount', label: 'Loan Amount', type: 'number', unit: '₹', min: 100000, max: 100000000, step: 50000, defaultValue: 5000000, helpText: 'The total amount you plan to borrow' },
    { id: 'interestRate', label: 'Interest Rate', type: 'number', unitOptions: ['% p.a.', '% p.m.'], min: 0.1, max: 30, step: 0.1, defaultValue: 8.5, helpText: 'Annual or monthly interest rate' },
    { id: 'tenure', label: 'Loan Tenure', type: 'number', unitOptions: ['Years', 'Months'], min: 1, max: 360, step: 1, defaultValue: 20, helpText: 'How long you will take to repay' },
    { id: 'annualSalary', label: 'Annual Salary', type: 'number', unit: '₹', min: 0, max: 50000000, step: 100000, defaultValue: 0, isAdvanced: true, helpText: 'To calculate affordability & EMI-to-Income ratio' },
    { id: 'otherEMIs', label: 'Other Monthly EMIs', type: 'number', unit: '₹', min: 0, max: 5000000, step: 5000, defaultValue: 0, isAdvanced: true, helpText: 'Any existing car, personal, or other loan EMIs' }
  ],
  schemaType: 'FinancialProduct',
};
