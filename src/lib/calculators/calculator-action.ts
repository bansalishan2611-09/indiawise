import { getCalculator } from './registry';

export interface CalculatorAction {
  slug: string;
  categorySlug: string;
  name: string;
  url: string;
}

// Map AI tool names directly to their canonical calculator registry slugs
const TOOL_TO_CALCULATOR_SLUG: Record<string, string> = {
  calculateHomeLoanEMI: 'home-loan-emi',
  calculatePersonalLoan: 'personal-loan-emi-calculator',
  calculateStudentLoan: 'student-loan-calculator',
  calculateSIP: 'sip-calculator',
  calculateFD: 'fd-calculator',
  calculateRD: 'rd-calculator',
  calculateSalary: 'in-hand-salary-calculator',
  calculateGST: 'gst-calculator',
  calculateIncomeTax: 'income-tax-calculator',
  calculateMargin: 'margin-calculator',
  calculateBMI: 'bmi-calculator',
  calculateAge: 'age-calculator',
};

/**
 * Validates a numeric value: must be finite, not NaN, and within optional bounds.
 */
function isValidNumber(val: unknown, min?: number, max?: number): val is number {
  if (typeof val !== 'number' && typeof val !== 'string') return false;
  const n = Number(val);
  if (isNaN(n) || !isFinite(n)) return false;
  if (min !== undefined && n < min) return false;
  if (max !== undefined && n > max) return false;
  return true;
}

/**
 * Builds a validated, safe "Open in Calculator" action for a given tool call and its arguments.
 * Strictly uses the calculator registry as the source of truth for slugs, categories, and inputs.
 * Returns null if the tool is not a calculator, if required inputs are missing/invalid,
 * or if safe parameters cannot be constructed.
 */
export function buildCalculatorAction(
  toolName: string,
  args: Record<string, unknown>
): CalculatorAction | null {
  if (toolName === 'calculateFinancialHealthScore' || toolName === 'simulateFinancialHealthWhatIf') {
    const income = Number(args.income);
    const emi = Number(args.emi);
    const investment = Number(args.investment);

    if (!isValidNumber(income, 5000) || !isValidNumber(emi, 0) || !isValidNumber(investment, 0)) {
      return null;
    }

    const params = new URLSearchParams();
    params.set('income', income.toString());
    params.set('emi', emi.toString());
    params.set('investment', investment.toString());

    if (isValidNumber(args.savings, 0)) {
      params.set('savings', Number(args.savings).toString());
    }
    if (isValidNumber(args.expenses, 0)) {
      params.set('expenses', Number(args.expenses).toString());
    }
    if (isValidNumber(args.age, 18, 100)) {
      params.set('age', Number(args.age).toString());
    }
    if (args.cityTier === 'tier2' || args.cityTier === 'tier3') {
      params.set('cityTier', String(args.cityTier));
    }

    const queryString = params.toString();
    return {
      slug: 'financial-health-score',
      categorySlug: 'finance',
      name: 'Financial Health Score',
      url: `/financial-health-score${queryString ? `?${queryString}` : ''}`,
    };
  }

  const slug = TOOL_TO_CALCULATOR_SLUG[toolName];
  if (!slug) return null;

  const entry = getCalculator(slug);
  if (!entry) return null;

  const { definition } = entry;
  const params = new URLSearchParams();

  switch (toolName) {
    case 'calculateHomeLoanEMI': {
      const loanAmount = Number(args.loanAmount);
      const interestRate = Number(args.interestRate);
      const tenure = Number(args.tenure);

      if (!isValidNumber(loanAmount, 1000) || !isValidNumber(interestRate, 0.01, 50) || !isValidNumber(tenure, 0.1, 50)) {
        return null;
      }

      params.set('loanAmount', loanAmount.toString());
      params.set('interestRate', interestRate.toString());
      params.set('tenure', tenure.toString());

      // What-If: extra payment
      const extra = args.extraEmi ?? args.extraPayment;
      if (isValidNumber(extra, 0.01)) {
        params.set('extraPayment', Number(extra).toString());
      }
      break;
    }

    case 'calculatePersonalLoan': {
      const loanAmount = Number(args.loanAmount);
      const interestRate = Number(args.interestRate);
      const tenure = Number(args.tenure);

      if (!isValidNumber(loanAmount, 1000) || !isValidNumber(interestRate, 0.01, 50) || !isValidNumber(tenure, 0.1, 30)) {
        return null;
      }

      params.set('loanAmount', loanAmount.toString());
      params.set('interestRate', interestRate.toString());
      params.set('tenure', tenure.toString());

      const extra = args.extraEmi ?? args.extraPayment;
      if (isValidNumber(extra, 0.01)) {
        params.set('extraPayment', Number(extra).toString());
      }
      break;
    }

    case 'calculateStudentLoan': {
      const loanAmount = Number(args.loanAmount);
      const interestRate = Number(args.interestRate);
      const tenure = Number(args.tenure);

      if (!isValidNumber(loanAmount, 1000) || !isValidNumber(interestRate, 0.01, 50) || !isValidNumber(tenure, 0.1, 30)) {
        return null;
      }

      params.set('loanAmount', loanAmount.toString());
      params.set('interestRate', interestRate.toString());
      params.set('tenure', tenure.toString());

      const extra = args.extraPayment;
      if (isValidNumber(extra, 0.01)) {
        params.set('extraPayment', Number(extra).toString());
      }
      break;
    }

    case 'calculateSIP': {
      const monthlyInvestment = Number(args.monthlyInvestment);
      const expectedReturn = Number(args.expectedReturnRate ?? args.expectedReturn);
      const duration = Number(args.tenure ?? args.duration);

      if (!isValidNumber(monthlyInvestment, 100) || !isValidNumber(expectedReturn, 0.1, 50) || !isValidNumber(duration, 0.1, 50)) {
        return null;
      }

      params.set('monthlyInvestment', monthlyInvestment.toString());
      params.set('expectedReturn', expectedReturn.toString());
      params.set('duration', duration.toString());

      const extra = args.extraInvestment ?? args.extraSip;
      if (isValidNumber(extra, 0.01)) {
        params.set('extraInvestment', Number(extra).toString());
      }
      break;
    }

    case 'calculateFD': {
      const principalAmount = Number(args.principalAmount);
      const interestRate = Number(args.interestRate);
      const tenure = Number(args.tenure);

      if (!isValidNumber(principalAmount, 100) || !isValidNumber(interestRate, 0.1, 30) || !isValidNumber(tenure, 0.1, 30)) {
        return null;
      }

      params.set('principalAmount', principalAmount.toString());
      params.set('interestRate', interestRate.toString());
      params.set('tenure', tenure.toString());

      // FD What-If: comparison parameters
      const hasCompare = isValidNumber(args.compareAmount, 100) || isValidNumber(args.compareRate, 0.1) || isValidNumber(args.compareTenure, 0.1);
      if (hasCompare || args.fdCompareActive === 1 || args.fdCompareActive === '1') {
        params.set('fdCompareActive', '1');
        if (isValidNumber(args.compareAmount, 100)) {
          params.set('compareAmount', Number(args.compareAmount).toString());
        }
        if (isValidNumber(args.compareRate, 0.1)) {
          params.set('compareRate', Number(args.compareRate).toString());
        }
        if (isValidNumber(args.compareTenure, 0.1)) {
          params.set('compareTenure', Number(args.compareTenure).toString());
        }
      }
      break;
    }

    case 'calculateRD': {
      const monthlyInvestment = Number(args.monthlyInvestment);
      const expectedReturn = Number(args.interestRate ?? args.expectedReturn);
      const timePeriod = Number(args.tenure ?? args.timePeriod);

      if (!isValidNumber(monthlyInvestment, 100) || !isValidNumber(expectedReturn, 0.1, 30) || !isValidNumber(timePeriod, 0.1, 30)) {
        return null;
      }

      params.set('monthlyInvestment', monthlyInvestment.toString());
      params.set('expectedReturn', expectedReturn.toString());
      params.set('timePeriod', timePeriod.toString());

      const extra = args.extraInvestment ?? args.extraRd;
      if (isValidNumber(extra, 0.01)) {
        params.set('extraInvestment', Number(extra).toString());
      }
      break;
    }

    case 'calculateSalary': {
      const ctc = Number(args.ctc);
      const basicPercentage = Number(args.basicPercentage ?? 50);

      if (!isValidNumber(ctc, 10000) || !isValidNumber(basicPercentage, 1, 100)) {
        return null;
      }

      params.set('ctc', ctc.toString());
      params.set('basicPercentage', basicPercentage.toString());

      const hike = args.hikePercentage ?? args.salaryHike;
      if (isValidNumber(hike, 0.1, 200)) {
        params.set('hikePercentage', Number(hike).toString());
      }
      break;
    }

    case 'calculateGST': {
      const amount = Number(args.baseAmount ?? args.amount);
      const gstRate = Number(args.gstRate ?? 18);
      const rawMode = String(args.gstMode ?? args.calculationType ?? 'exclusive').toLowerCase();
      const calculationType = (rawMode === 'remove' || rawMode === 'inclusive') ? 'inclusive' : 'exclusive';

      if (!isValidNumber(amount, 0.01) || !isValidNumber(gstRate, 0, 100)) {
        return null;
      }

      params.set('amount', amount.toString());
      params.set('gstRate', gstRate.toString());
      params.set('calculationType', calculationType);

      if (isValidNumber(args.extraAmount)) {
        params.set('extraAmount', Number(args.extraAmount).toString());
      }
      break;
    }

    case 'calculateIncomeTax': {
      const annualIncome = Number(args.annualIncome);
      if (!isValidNumber(annualIncome, 0)) {
        return null;
      }

      params.set('annualIncome', annualIncome.toString());

      const numFields: Array<keyof typeof args> = [
        'section80C',
        'section80D',
        'hraExemption',
        'homeLoanInterest',
        'otherDeductions'
      ];

      for (const field of numFields) {
        if (isValidNumber(args[field], 0)) {
          params.set(field, Number(args[field]).toString());
        }
      }
      break;
    }

    case 'calculateMargin': {
      const cost = Number(args.costOfGoods ?? args.cost);
      const revenue = Number(args.revenue);

      if (!isValidNumber(cost, 0.01) || !isValidNumber(revenue, 0.01)) {
        return null;
      }

      params.set('cost', cost.toString());
      params.set('revenue', revenue.toString());

      if (isValidNumber(args.extraRevenue)) {
        params.set('extraRevenue', Number(args.extraRevenue).toString());
      }
      break;
    }

    case 'calculateBMI': {
      const weight = Number(args.weight);
      const height = Number(args.height);
      const rawHeightUnit = String(args.heightUnit ?? args.height_unit ?? 'cm').toLowerCase();
      const heightUnit = (rawHeightUnit === 'ft' || rawHeightUnit === 'inches') ? 'inches' : (rawHeightUnit === 'm' ? 'm' : 'cm');

      if (!isValidNumber(weight, 1, 600) || !isValidNumber(height, 1, 350)) {
        return null;
      }

      params.set('weight', weight.toString());
      params.set('height', height.toString());
      params.set('height_unit', heightUnit);

      if (args.weight_unit && (args.weight_unit === 'lbs' || args.weight_unit === 'kg')) {
        params.set('weight_unit', String(args.weight_unit));
      }

      const extraWeight = args.weightChange ?? args.extraWeight;
      if (isValidNumber(extraWeight)) {
        params.set('extraWeight', Number(extraWeight).toString());
      }
      break;
    }

    case 'calculateAge': {
      const birthYear = Number(args.birthYear);
      const birthMonth = Number(args.birthMonth);
      const birthDay = Number(args.birthDay);
      const currentYear = new Date().getFullYear();

      if (!isValidNumber(birthYear, 1900, currentYear) || !isValidNumber(birthMonth, 1, 12) || !isValidNumber(birthDay, 1, 31)) {
        return null;
      }

      params.set('birthYear', birthYear.toString());
      params.set('birthMonth', birthMonth.toString());
      params.set('birthDay', birthDay.toString());
      break;
    }

    default:
      return null;
  }

  // Construct safe relative path using the definition's categorySlug and slug
  const queryString = params.toString();
  const url = `/calculators/${definition.categorySlug}/${definition.slug}${queryString ? `?${queryString}` : ''}`;

  return {
    slug: definition.slug,
    categorySlug: definition.categorySlug,
    name: definition.name,
    url,
  };
}
