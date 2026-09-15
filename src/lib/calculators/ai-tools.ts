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
import { calculateFinancialHealthScore, simulateFinancialHealthWhatIf } from './logic/financial-health-score';

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
    description: 'Calculate Fixed Deposit (FD) maturity value and interest earned, with optional comparison scenario.',
    parameters: {
      type: 'OBJECT',
      properties: {
        principalAmount: { type: 'NUMBER', description: 'The one-time FD investment amount in ₹. Must be positive.' },
        interestRate: { type: 'NUMBER', description: 'The annual interest rate percentage. Must be positive.' },
        tenure: { type: 'NUMBER', description: 'The tenure in years. Must be positive.' },
        compareAmount: { type: 'NUMBER', description: 'Optional comparison FD deposit amount in ₹ for what-if comparison.' },
        compareRate: { type: 'NUMBER', description: 'Optional comparison interest rate percentage for what-if comparison.' },
        compareTenure: { type: 'NUMBER', description: 'Optional comparison tenure in years for what-if comparison.' }
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
  },
  {
    name: 'calculateFinancialHealthScore',
    description: 'Calculate the IndiaWise Financial Health Score (0-100), health category, and 4 dimension scores (Debt Burden, Investment Rate, Emergency Buffer, Savings Capacity) using deterministic math.',
    parameters: {
      type: 'OBJECT',
      properties: {
        income: { type: 'NUMBER', description: 'Monthly in-hand salary in Indian Rupees (₹). Must be positive.' },
        emi: { type: 'NUMBER', description: 'Total monthly EMIs (home, car, personal, education) in ₹. Must be non-negative.' },
        investment: { type: 'NUMBER', description: 'Monthly investments (SIP, mutual funds, EPF/PPF, NPS) in ₹. Must be non-negative.' },
        savings: { type: 'NUMBER', description: 'Current liquid emergency savings (savings account, liquid mutual funds, short FDs) in ₹. Must be non-negative.' },
        expenses: { type: 'NUMBER', description: 'Optional essential monthly household/living expenses in ₹.' },
        age: { type: 'NUMBER', description: 'Optional age of the user (18-100).' },
        cityTier: { type: 'STRING', description: 'Optional location tier: "tier1" (metros), "tier2", or "tier3".' }
      },
      required: ['income', 'emi', 'investment']
    }
  },
  {
    name: 'simulateFinancialHealthWhatIf',
    description: 'Simulate how changes like increasing monthly investments, reducing EMIs, or boosting savings impact the IndiaWise Financial Health Score.',
    parameters: {
      type: 'OBJECT',
      properties: {
        income: { type: 'NUMBER', description: 'Current monthly in-hand salary in ₹.' },
        emi: { type: 'NUMBER', description: 'Current monthly EMIs in ₹.' },
        investment: { type: 'NUMBER', description: 'Current monthly investments in ₹.' },
        savings: { type: 'NUMBER', description: 'Current liquid emergency savings in ₹.' },
        extraInvestment: { type: 'NUMBER', description: 'Proposed additional monthly investment in ₹ (e.g. 5000).' },
        emiReduction: { type: 'NUMBER', description: 'Proposed monthly EMI reduction in ₹ (e.g. 5000).' },
        extraSavings: { type: 'NUMBER', description: 'Proposed additional liquid savings buffer in ₹ (e.g. 50000).' }
      },
      required: ['income', 'emi', 'investment']
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

      if (args.extraEmi || args.extraPayment) inputs.extraPayment = Number(args.extraEmi || args.extraPayment);
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

      if (args.extraEmi || args.extraPayment) inputs.extraPayment = Number(args.extraEmi || args.extraPayment);
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

      if (args.extraPayment) inputs.extraPayment = Number(args.extraPayment);
      return extractMainResults(calculateStudentLoan(inputs));
    }
      
    case 'calculateSIP': {
      const monthlyInvestment = Number(args.monthlyInvestment);
      const expectedReturnRate = Number(args.expectedReturnRate ?? args.expectedReturn);
      const tenure = Number(args.tenure ?? args.duration);

      if (isNaN(monthlyInvestment) || monthlyInvestment <= 0) {
        return { error: 'Monthly SIP investment must be greater than 0.' };
      }
      if (isNaN(expectedReturnRate) || expectedReturnRate <= 0) {
        return { error: 'Expected annual return rate must be greater than 0%.' };
      }
      if (isNaN(tenure) || tenure <= 0) {
        return { error: 'Investment tenure must be greater than 0 years.' };
      }

      inputs.monthlyInvestment = monthlyInvestment;
      inputs.expectedReturn = expectedReturnRate;
      inputs.duration = tenure;

      if (args.extraInvestment || args.extraSip) {
        inputs.extraInvestment = Number(args.extraInvestment || args.extraSip);
      }
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

      inputs.principalAmount = principalAmount;
      inputs.interestRate = interestRate;
      inputs.tenure = tenure;

      if (args.compareAmount || args.compareRate || args.compareTenure || args.fdCompareActive === 1 || args.fdCompareActive === '1') {
        inputs.fdCompareActive = 1;
        if (args.compareAmount) inputs.compareAmount = Number(args.compareAmount);
        if (args.compareRate) inputs.compareRate = Number(args.compareRate);
        if (args.compareTenure) inputs.compareTenure = Number(args.compareTenure);
      }

      return extractMainResults(calculateFD(inputs));
    }
      
    case 'calculateRD': {
      const monthlyInvestment = Number(args.monthlyInvestment);
      const interestRate = Number(args.interestRate ?? args.expectedReturn);
      const tenure = Number(args.tenure ?? args.timePeriod);

      if (isNaN(monthlyInvestment) || monthlyInvestment <= 0) {
        return { error: 'Monthly RD investment must be greater than 0.' };
      }
      if (isNaN(interestRate) || interestRate <= 0) {
        return { error: 'RD interest rate must be greater than 0%.' };
      }
      if (isNaN(tenure) || tenure <= 0) {
        return { error: 'RD tenure must be greater than 0 years.' };
      }

      inputs.monthlyInvestment = monthlyInvestment;
      inputs.expectedReturn = interestRate;
      inputs.timePeriod = tenure;

      if (args.extraInvestment || args.extraRd) {
        inputs.extraInvestment = Number(args.extraInvestment || args.extraRd);
      }
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

      inputs.ctc = ctc;
      inputs.basicPercentage = basicPercentage;

      if (args.hikePercentage || args.salaryHike) {
        inputs.hikePercentage = Number(args.hikePercentage || args.salaryHike);
      }
      return extractMainResults(calculateSalary(inputs));
    }
      
    case 'calculateGST': {
      const baseAmount = Number(args.baseAmount ?? args.amount);
      const gstRate = Number(args.gstRate);
      const rawMode = String(args.gstMode || args.calculationType || '').toLowerCase();
      const gstMode = (rawMode === 'remove' || rawMode === 'inclusive') ? 'inclusive' : 'exclusive';

      if (isNaN(baseAmount) || baseAmount <= 0) {
        return { error: 'GST base amount must be a positive number greater than 0.' };
      }
      if (isNaN(gstRate) || gstRate < 0) {
        return { error: 'GST rate cannot be negative.' };
      }

      inputs.amount = baseAmount;
      inputs.gstRate = gstRate;
      inputs.calculationType = gstMode;

      if (args.extraAmount) {
        inputs.extraAmount = Number(args.extraAmount);
      }
      return extractMainResults(calculateGST(inputs));
    }

    case 'calculateIncomeTax': {
      const annualIncome = Number(args.annualIncome);
      if (isNaN(annualIncome) || annualIncome < 0) {
        return { error: 'Annual income cannot be negative.' };
      }
      inputs.annualIncome = annualIncome;
      return extractMainResults(calculateIncomeTax(inputs));
    }
      
    case 'calculateMargin': {
      const costOfGoods = Number(args.costOfGoods ?? args.cost);
      const revenue = Number(args.revenue);

      if (isNaN(costOfGoods) || costOfGoods < 0) {
        return { error: 'Cost of goods cannot be negative.' };
      }
      if (isNaN(revenue) || revenue < 0) {
        return { error: 'Revenue cannot be negative.' };
      }

      inputs.cost = costOfGoods;
      inputs.revenue = revenue;

      if (args.extraRevenue) {
        inputs.extraRevenue = Number(args.extraRevenue);
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

      inputs.height = height;
      inputs.weight = weight;
      if (args.heightUnit) inputs.height_unit = String(args.heightUnit);
      if (args.weightUnit) inputs.weight_unit = String(args.weightUnit);

      if (args.weightChange || args.extraWeight) {
        inputs.extraWeight = Number(args.weightChange || args.extraWeight);
      }
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

    case 'calculateFinancialHealthScore': {
      const income = Number(args.income);
      const emi = Number(args.emi);
      const investment = Number(args.investment);
      const savings = Number(args.savings ?? 0);
      const expenses = args.expenses ? Number(args.expenses) : undefined;
      const age = args.age ? Number(args.age) : 28;
      const cityTier = (args.cityTier === 'tier2' || args.cityTier === 'tier3') ? args.cityTier : 'tier1';

      if (isNaN(income) || income <= 0) {
        return { error: 'Monthly income must be a positive number greater than 0.' };
      }
      if (isNaN(emi) || emi < 0) {
        return { error: 'Monthly EMI cannot be negative.' };
      }
      if (isNaN(investment) || investment < 0) {
        return { error: 'Monthly investment cannot be negative.' };
      }

      const res = calculateFinancialHealthScore({
        income,
        emi,
        investment,
        savings,
        expenses,
        age,
        cityTier
      });

      return {
        score: res.score,
        category: res.category,
        categoryHeadline: res.categoryHeadline,
        summarySentence: res.summarySentence,
        dimensions: res.dimensions.map(d => ({
          name: d.name,
          score: d.score,
          metric: d.metricValue,
          impact: d.impact,
          summary: d.summary
        })),
        realityChecks: res.realityChecks.map(rc => rc.headline),
        actionPlan: res.actionPlan.map(ap => ap.title)
      };
    }

    case 'simulateFinancialHealthWhatIf': {
      const income = Number(args.income);
      const emi = Number(args.emi);
      const investment = Number(args.investment);
      const savings = Number(args.savings ?? 0);

      if (isNaN(income) || income <= 0) {
        return { error: 'Monthly income must be a positive number greater than 0.' };
      }

      const sim = simulateFinancialHealthWhatIf(
        {
          income,
          emi: isNaN(emi) ? 0 : emi,
          investment: isNaN(investment) ? 0 : investment,
          savings: isNaN(savings) ? 0 : savings,
          age: 28,
          cityTier: 'tier1'
        },
        {
          extraInvestment: args.extraInvestment ? Number(args.extraInvestment) : 0,
          emiReduction: args.emiReduction ? Number(args.emiReduction) : 0,
          extraSavings: args.extraSavings ? Number(args.extraSavings) : 0
        }
      );

      return {
        originalScore: sim.originalScore,
        newScore: sim.newScore,
        scoreDelta: sim.scoreDelta,
        originalCategory: sim.originalCategory,
        newCategory: sim.newCategory,
        explanation: sim.explanation
      };
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

