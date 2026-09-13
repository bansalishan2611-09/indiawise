import { calculateEMI } from './logic/emi';
import { calculatePersonalLoanEMI } from './logic/personal-loan';
import { calculateStudentLoan } from './logic/student-loan';
import { calculateSIP } from './logic/sip';
import { calculateFD } from './logic/fd';
import { calculateRD } from './logic/rd';
import { calculateSalary } from './logic/salary';
import { calculateGST } from './logic/gst';
import { calculateMargin } from './logic/margin';
import { calculateBMI } from './logic/bmi';
import { calculateIncomeTax } from './logic/income-tax';
import { calculateAge } from './logic/age';

// Define JSON Schemas for each tool. We will pass these directly to @google/genai

export const aiTools = [
  {
    name: 'calculateHomeLoanEMI',
    description: 'Calculate the monthly EMI, total interest, and total payment for a home loan.',
    parameters: {
      type: 'OBJECT',
      properties: {
        loanAmount: { type: 'NUMBER', description: 'The principal loan amount in Indian Rupees (₹). Must be positive.' },
        interestRate: { type: 'NUMBER', description: 'The annual interest rate percentage. Must be positive.' },
        tenure: { type: 'NUMBER', description: 'The loan tenure in years. Must be positive.' },
        extraEmi: { type: 'NUMBER', description: 'Optional extra monthly payment for what-if scenarios.' }
      },
      required: ['loanAmount', 'interestRate', 'tenure']
    }
  },
  {
    name: 'calculatePersonalLoan',
    description: 'Calculate personal loan EMI and interest.',
    parameters: {
      type: 'OBJECT',
      properties: {
        loanAmount: { type: 'NUMBER', description: 'The principal personal loan amount in ₹. Must be positive.' },
        interestRate: { type: 'NUMBER', description: 'The annual interest rate percentage. Must be positive.' },
        tenure: { type: 'NUMBER', description: 'The loan tenure in years. Must be positive.' },
        extraEmi: { type: 'NUMBER', description: 'Optional extra monthly payment.' }
      },
      required: ['loanAmount', 'interestRate', 'tenure']
    }
  },
  {
    name: 'calculateStudentLoan',
    description: 'Calculate education/student loan EMI, total interest, and total repayment.',
    parameters: {
      type: 'OBJECT',
      properties: {
        loanAmount: { type: 'NUMBER', description: 'The principal student loan amount in ₹. Must be positive.' },
        interestRate: { type: 'NUMBER', description: 'The annual interest rate percentage. Must be positive.' },
        tenure: { type: 'NUMBER', description: 'The loan tenure in years. Must be positive.' }
      },
      required: ['loanAmount', 'interestRate', 'tenure']
    }
  },
  {
    name: 'calculateSIP',
    description: 'Calculate Systematic Investment Plan (SIP) returns.',
    parameters: {
      type: 'OBJECT',
      properties: {
        monthlyInvestment: { type: 'NUMBER', description: 'The monthly investment amount in ₹. Must be positive.' },
        expectedReturnRate: { type: 'NUMBER', description: 'The expected annual return rate percentage. Must be positive.' },
        tenure: { type: 'NUMBER', description: 'The investment tenure in years. Must be positive.' },
        extraInvestment: { type: 'NUMBER', description: 'Optional extra monthly investment for what-if scenarios.' }
      },
      required: ['monthlyInvestment', 'expectedReturnRate', 'tenure']
    }
  },
  {
    name: 'calculateFD',
    description: 'Calculate Fixed Deposit (FD) maturity value and interest earned.',
    parameters: {
      type: 'OBJECT',
      properties: {
        principalAmount: { type: 'NUMBER', description: 'The one-time FD investment amount in ₹. Must be positive.' },
        interestRate: { type: 'NUMBER', description: 'The annual interest rate percentage. Must be positive.' },
        tenure: { type: 'NUMBER', description: 'The tenure in years. Must be positive.' }
      },
      required: ['principalAmount', 'interestRate', 'tenure']
    }
  },
  {
    name: 'calculateRD',
    description: 'Calculate Recurring Deposit (RD) maturity value.',
    parameters: {
      type: 'OBJECT',
      properties: {
        monthlyInvestment: { type: 'NUMBER', description: 'The monthly RD investment amount in ₹. Must be positive.' },
        interestRate: { type: 'NUMBER', description: 'The annual interest rate percentage. Must be positive.' },
        tenure: { type: 'NUMBER', description: 'The tenure in years. Must be positive.' },
        extraInvestment: { type: 'NUMBER', description: 'Optional extra monthly investment for what-if scenarios.' }
      },
      required: ['monthlyInvestment', 'interestRate', 'tenure']
    }
  },
  {
    name: 'calculateSalary',
    description: 'Calculate In-Hand Salary (Take-Home) after deductions in India.',
    parameters: {
      type: 'OBJECT',
      properties: {
        ctc: { type: 'NUMBER', description: 'The annual Cost to Company (CTC) in ₹. Must be positive.' },
        basicPercentage: { type: 'NUMBER', description: 'The percentage of CTC that is Basic Salary (typically 40 or 50).' },
        employeePf: { type: 'BOOLEAN', description: 'Whether the employee contributes to PF.' },
        employerPf: { type: 'BOOLEAN', description: 'Whether the employer contributes to PF.' },
        hikePercentage: { type: 'NUMBER', description: 'Optional hike percentage for what-if scenarios.' }
      },
      required: ['ctc', 'basicPercentage', 'employeePf', 'employerPf']
    }
  },
  {
    name: 'calculateGST',
    description: 'Calculate the total amount after adding or removing GST.',
    parameters: {
      type: 'OBJECT',
      properties: {
        baseAmount: { type: 'NUMBER', description: 'The base amount in ₹. Must be positive.' },
        gstRate: { type: 'NUMBER', description: 'The GST percentage rate (e.g. 5, 12, 18, 28).' },
        gstMode: { type: 'STRING', description: 'Either "add" (exclusive) or "remove" (inclusive).' }
      },
      required: ['baseAmount', 'gstRate', 'gstMode']
    }
  },
  {
    name: 'calculateIncomeTax',
    description: 'Calculate and compare Old vs New Regime income tax in India.',
    parameters: {
      type: 'OBJECT',
      properties: {
        annualIncome: { type: 'NUMBER', description: 'Gross annual income in ₹. Must be non-negative.' },
        section80C: { type: 'NUMBER', description: 'Deductions under 80C in ₹ (max ₹1,50,000).' },
        section80D: { type: 'NUMBER', description: 'Health insurance deduction under 80D in ₹.' },
        hraExemption: { type: 'NUMBER', description: 'HRA exemption amount in ₹.' },
        homeLoanInterest: { type: 'NUMBER', description: 'Home loan interest deduction under Section 24 in ₹ (max ₹2,00,000).' },
        otherDeductions: { type: 'NUMBER', description: 'Other eligible deductions in ₹.' }
      },
      required: ['annualIncome']
    }
  },
  {
    name: 'calculateMargin',
    description: 'Calculate Gross Margin, Markup, and Profit from cost and revenue.',
    parameters: {
      type: 'OBJECT',
      properties: {
        costOfGoods: { type: 'NUMBER', description: 'The cost of the goods/services in ₹. Must be non-negative.' },
        revenue: { type: 'NUMBER', description: 'The selling price/revenue in ₹. Must be non-negative.' }
      },
      required: ['costOfGoods', 'revenue']
    }
  },
  {
    name: 'calculateBMI',
    description: 'Calculate Body Mass Index (BMI).',
    parameters: {
      type: 'OBJECT',
      properties: {
        height: { type: 'NUMBER', description: 'The height (e.g. 175 in cm, or 5.9 in feet). Must be positive.' },
        heightUnit: { type: 'STRING', description: 'The unit for height: "cm" or "ft".' },
        weight: { type: 'NUMBER', description: 'The weight in kilograms (kg). Must be positive.' },
        weightChange: { type: 'NUMBER', description: 'Optional weight change (in kg) for what-if scenario (e.g. -5).' }
      },
      required: ['height', 'heightUnit', 'weight']
    }
  },
  {
    name: 'calculateAge',
    description: 'Calculate precise age in years, months, days, and total weeks.',
    parameters: {
      type: 'OBJECT',
      properties: {
        birthYear: { type: 'NUMBER', description: 'Birth year (e.g. 1995).' },
        birthMonth: { type: 'NUMBER', description: 'Birth month (1-12).' },
        birthDay: { type: 'NUMBER', description: 'Birth day (1-31).' }
      },
      required: ['birthYear', 'birthMonth', 'birthDay']
    }
  }
];

// Helper to execute the deterministic calculation engine based on the tool call
export function executeAITool(name: string, args: Record<string, unknown>): Record<string, unknown> {
  const inputs: Record<string, string | number> = {};
  
  for (const [key, value] of Object.entries(args)) {
    if (value !== null && value !== undefined) {
      inputs[key] = value as string | number;
    }
  }

  switch (name) {
    case 'calculateHomeLoanEMI': {
      const loanAmount = Number(args.loanAmount);
      const interestRate = Number(args.interestRate);
      const tenure = Number(args.tenure);

      if (isNaN(loanAmount) || loanAmount <= 0) {
        return { error: 'Loan amount must be a positive number greater than 0.' };
      }
      if (isNaN(interestRate) || interestRate <= 0) {
        return { error: 'Interest rate must be a positive percentage greater than 0.' };
      }
      if (isNaN(tenure) || tenure <= 0) {
        return { error: 'Loan tenure must be a positive number of years greater than 0.' };
      }

      if (args.extraEmi) inputs.extraEmi = Number(args.extraEmi);
      return extractMainResults(calculateEMI(inputs));
    }

    case 'calculatePersonalLoan': {
      const loanAmount = Number(args.loanAmount);
      const interestRate = Number(args.interestRate);
      const tenure = Number(args.tenure);

      if (isNaN(loanAmount) || loanAmount <= 0) {
        return { error: 'Loan amount must be a positive number greater than 0.' };
      }
      if (isNaN(interestRate) || interestRate <= 0) {
        return { error: 'Interest rate must be a positive percentage greater than 0.' };
      }
      if (isNaN(tenure) || tenure <= 0) {
        return { error: 'Loan tenure must be a positive number of years greater than 0.' };
      }

      if (args.extraEmi) inputs.extraEmi = Number(args.extraEmi);
      return extractMainResults(calculatePersonalLoanEMI(inputs));
    }
      
    case 'calculateStudentLoan': {
      const loanAmount = Number(args.loanAmount);
      const interestRate = Number(args.interestRate);
      const tenure = Number(args.tenure);

      if (isNaN(loanAmount) || loanAmount <= 0) {
        return { error: 'Student loan amount must be a positive number greater than 0.' };
      }
      if (isNaN(interestRate) || interestRate <= 0) {
        return { error: 'Interest rate must be a positive percentage greater than 0.' };
      }
      if (isNaN(tenure) || tenure <= 0) {
        return { error: 'Tenure must be a positive number of years greater than 0.' };
      }

      return extractMainResults(calculateStudentLoan(inputs));
    }
      
    case 'calculateSIP': {
      const monthlyInvestment = Number(args.monthlyInvestment);
      const expectedReturnRate = Number(args.expectedReturnRate);
      const tenure = Number(args.tenure);

      if (isNaN(monthlyInvestment) || monthlyInvestment <= 0) {
        return { error: 'Monthly SIP investment must be greater than 0.' };
      }
      if (isNaN(expectedReturnRate) || expectedReturnRate <= 0) {
        return { error: 'Expected annual return rate must be greater than 0%.' };
      }
      if (isNaN(tenure) || tenure <= 0) {
        return { error: 'Investment tenure must be greater than 0 years.' };
      }

      if (args.extraInvestment) inputs.extraSip = Number(args.extraInvestment);
      return extractMainResults(calculateSIP(inputs));
    }
      
    case 'calculateFD': {
      const principalAmount = Number(args.principalAmount);
      const interestRate = Number(args.interestRate);
      const tenure = Number(args.tenure);

      if (isNaN(principalAmount) || principalAmount <= 0) {
        return { error: 'FD principal amount must be greater than 0.' };
      }
      if (isNaN(interestRate) || interestRate <= 0) {
        return { error: 'FD interest rate must be greater than 0%.' };
      }
      if (isNaN(tenure) || tenure <= 0) {
        return { error: 'FD tenure must be greater than 0 years.' };
      }

      return extractMainResults(calculateFD(inputs));
    }
      
    case 'calculateRD': {
      const monthlyInvestment = Number(args.monthlyInvestment);
      const interestRate = Number(args.interestRate);
      const tenure = Number(args.tenure);

      if (isNaN(monthlyInvestment) || monthlyInvestment <= 0) {
        return { error: 'Monthly RD investment must be greater than 0.' };
      }
      if (isNaN(interestRate) || interestRate <= 0) {
        return { error: 'RD interest rate must be greater than 0%.' };
      }
      if (isNaN(tenure) || tenure <= 0) {
        return { error: 'RD tenure must be greater than 0 years.' };
      }

      if (args.extraInvestment) inputs.extraRd = Number(args.extraInvestment);
      return extractMainResults(calculateRD(inputs));
    }
      
    case 'calculateSalary': {
      const ctc = Number(args.ctc);
      const basicPercentage = Number(args.basicPercentage);

      if (isNaN(ctc) || ctc <= 0) {
        return { error: 'Annual CTC must be a positive number greater than 0.' };
      }
      if (isNaN(basicPercentage) || basicPercentage <= 0 || basicPercentage > 100) {
        return { error: 'Basic salary percentage must be between 1 and 100.' };
      }

      if (args.hikePercentage) inputs.salaryHike = Number(args.hikePercentage);
      return extractMainResults(calculateSalary(inputs));
    }
      
    case 'calculateGST': {
      const baseAmount = Number(args.baseAmount);
      const gstRate = Number(args.gstRate);
      const gstMode = String(args.gstMode || '').toLowerCase();

      if (isNaN(baseAmount) || baseAmount <= 0) {
        return { error: 'GST base amount must be a positive number greater than 0.' };
      }
      if (isNaN(gstRate) || gstRate < 0) {
        return { error: 'GST rate cannot be negative.' };
      }
      if (gstMode !== 'add' && gstMode !== 'remove') {
        return { error: 'GST mode must be either "add" (exclusive) or "remove" (inclusive).' };
      }

      inputs.gstMode = gstMode;
      return extractMainResults(calculateGST(inputs));
    }

    case 'calculateIncomeTax': {
      const annualIncome = Number(args.annualIncome);
      if (isNaN(annualIncome) || annualIncome < 0) {
        return { error: 'Annual income cannot be negative.' };
      }
      return extractMainResults(calculateIncomeTax(inputs));
    }
      
    case 'calculateMargin': {
      const costOfGoods = Number(args.costOfGoods);
      const revenue = Number(args.revenue);

      if (isNaN(costOfGoods) || costOfGoods < 0) {
        return { error: 'Cost of goods cannot be negative.' };
      }
      if (isNaN(revenue) || revenue < 0) {
        return { error: 'Revenue cannot be negative.' };
      }

      return extractMainResults(calculateMargin(inputs));
    }
      
    case 'calculateBMI': {
      const height = Number(args.height);
      const weight = Number(args.weight);

      if (isNaN(height) || height <= 0) {
        return { error: 'Height must be a positive number greater than 0.' };
      }
      if (isNaN(weight) || weight <= 0) {
        return { error: 'Weight must be a positive number greater than 0.' };
      }

      if (args.weightChange) inputs.weightChange = Number(args.weightChange);
      return extractMainResults(calculateBMI(inputs));
    }

    case 'calculateAge': {
      const birthYear = Number(args.birthYear);
      const birthMonth = Number(args.birthMonth);
      const birthDay = Number(args.birthDay);
      const currentYear = new Date().getFullYear();

      if (isNaN(birthYear) || birthYear < 1900 || birthYear > currentYear) {
        return { error: `Birth year must be between 1900 and ${currentYear}.` };
      }
      if (isNaN(birthMonth) || birthMonth < 1 || birthMonth > 12) {
        return { error: 'Birth month must be between 1 and 12.' };
      }
      if (isNaN(birthDay) || birthDay < 1 || birthDay > 31) {
        return { error: 'Birth day must be between 1 and 31.' };
      }

      return extractMainResults(calculateAge(inputs));
    }

    default:
      return { error: `Unknown calculator: ${name}` };
  }
}

// Strip out massive datasets like Amortization/Growth schedules before returning to Gemini
function extractMainResults(payload: { results?: Array<{ label: string; value: unknown }>; whatIfResults?: Array<{ label: string; value: unknown }> }) {
  const resultData: Record<string, unknown> = {};
  
  if (payload.results) {
    payload.results.forEach((r) => {
      resultData[r.label] = r.value;
    });
  }
  
  if (payload.whatIfResults && payload.whatIfResults.length > 0) {
    const whatIfObj: Record<string, unknown> = {};
    payload.whatIfResults.forEach((r) => {
      whatIfObj[r.label] = r.value;
    });
    resultData.whatIfScenario = whatIfObj;
  }
  
  return resultData;
}

