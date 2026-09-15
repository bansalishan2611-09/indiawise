/**
 * IndiaWise Financial Health Score Deterministic Engine
 * Single source of truth for all score computations, dimensions, reality checks,
 * recommendations, and What-If simulations.
 *
 * ZERO AI hallucination. 100% deterministic, transparent, and explainable math.
 */

import { formatIndianCurrency } from '../formatters';

export type CityTier = 'tier1' | 'tier2' | 'tier3';

export interface FinancialHealthInputs {
  age: number;
  cityTier: CityTier;
  income: number; // Monthly In-Hand (₹)
  emi: number; // Monthly Total EMIs (₹)
  investment: number; // Monthly Investments (₹)
  savings: number; // Current Liquid Emergency Savings (₹)
  expenses?: number; // Optional Monthly Essential Expenses (₹)
}

export interface DimensionScore {
  id: 'debt' | 'investment' | 'emergency' | 'savings';
  name: string;
  weight: number; // Percentage (e.g. 30 for 30%)
  score: number; // 0 - 100
  metricLabel: string;
  metricValue: string;
  status: 'optimal' | 'good' | 'fair' | 'critical';
  impact: 'helping' | 'neutral' | 'hurting';
  summary: string;
}

export type HealthCategory = 
  | 'Financially Strong'
  | 'Wealth Builder'
  | 'On Track'
  | 'Needs Attention'
  | 'Financially Stretched';

export interface RealityCheckItem {
  id: string;
  headline: string;
  detail: string;
  type: 'positive' | 'warning' | 'neutral';
}

export interface ActionRecommendation {
  id: string;
  title: string;
  description: string;
  actionUrl?: string;
  actionText?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface FinancialHealthResult {
  score: number; // 0 - 100
  category: HealthCategory;
  categoryHeadline: string;
  summarySentence: string;
  dimensions: DimensionScore[];
  realityChecks: RealityCheckItem[];
  actionPlan: ActionRecommendation[];
  inputs: FinancialHealthInputs;
  normalizedInputs: {
    emiRatio: number; // percentage e.g. 20%
    investmentRatio: number; // percentage e.g. 15%
    emergencyMonths: number | null;
    monthlySurplus: number;
    surplusRatio: number;
  };
}

export interface WhatIfDelta {
  extraInvestment?: number;
  emiReduction?: number;
  extraSavings?: number;
  expenseReduction?: number;
}

export interface WhatIfSimulationResult {
  originalScore: number;
  newScore: number;
  scoreDelta: number;
  originalCategory: HealthCategory;
  newCategory: HealthCategory;
  improvedDimensionNames: string[];
  explanation: string;
  newResult: FinancialHealthResult;
}

/**
 * Weights configuration for transparency:
 * Total = 100%
 */
export const SCORING_WEIGHTS = {
  debt: 0.30, // 30%
  investment: 0.25, // 25%
  emergency: 0.25, // 25%
  savings: 0.20, // 20%
} as const;

/**
 * Bounds checking and sanitization of raw inputs.
 */
export function sanitizeHealthInputs(raw: Partial<FinancialHealthInputs>): FinancialHealthInputs {
  const age = Math.min(100, Math.max(18, Number(raw.age) || 28));
  const validTier: CityTier = (raw.cityTier === 'tier2' || raw.cityTier === 'tier3') ? raw.cityTier : 'tier1';
  const income = Math.min(100000000, Math.max(5000, Number(raw.income) || 100000));
  const emi = Math.min(100000000, Math.max(0, Number(raw.emi) ?? 20000));
  const investment = Math.min(100000000, Math.max(0, Number(raw.investment) ?? 15000));
  const savings = Math.min(100000000, Math.max(0, Number(raw.savings) ?? 300000));
  
  let expenses: number | undefined = undefined;
  if (raw.expenses !== undefined && raw.expenses !== null) {
    const parsedExp = Number(raw.expenses);
    if (!isNaN(parsedExp) && parsedExp >= 0) {
      expenses = Math.min(100000000, parsedExp);
    }
  }

  return {
    age,
    cityTier: validTier,
    income,
    emi,
    investment,
    savings,
    expenses
  };
}

/**
 * Evaluates the Debt Burden dimension (Weight: 30%)
 * Ratio = EMI / Monthly Income
 */
function scoreDebtBurden(emi: number, income: number): { score: number; status: DimensionScore['status']; impact: DimensionScore['impact']; summary: string } {
  if (income <= 0) return { score: 0, status: 'critical', impact: 'hurting', summary: 'Zero monthly income recorded.' };
  
  const ratio = emi / income;
  let score = 100;
  let status: DimensionScore['status'] = 'optimal';
  let impact: DimensionScore['impact'] = 'helping';

  if (ratio <= 0.15) {
    score = 100;
    status = 'optimal';
    impact = 'helping';
  } else if (ratio <= 0.30) {
    score = Math.round(100 - ((ratio - 0.15) / 0.15) * 20);
    status = 'good';
    impact = 'helping';
  } else if (ratio <= 0.45) {
    score = Math.round(80 - ((ratio - 0.30) / 0.15) * 20);
    status = 'fair';
    impact = 'neutral';
  } else if (ratio <= 0.60) {
    score = Math.round(60 - ((ratio - 0.45) / 0.15) * 30);
    status = 'critical';
    impact = 'hurting';
  } else {
    score = Math.max(0, Math.round(30 - ((ratio - 0.60) / 0.40) * 30));
    status = 'critical';
    impact = 'hurting';
  }

  const pct = (ratio * 100).toFixed(1);
  let summary = `EMIs take ${pct}% of in-hand salary.`;
  if (ratio <= 0.25) summary += ' Excellent debt control.';
  else if (ratio <= 0.40) summary += ' Moderate debt level.';
  else summary += ' High debt burden; leaves little cushion.';

  return { score, status, impact, summary };
}

/**
 * Evaluates the Investment Rate dimension (Weight: 25%)
 * Ratio = Monthly Investment / Monthly Income
 */
function scoreInvestmentRate(investment: number, income: number): { score: number; status: DimensionScore['status']; impact: DimensionScore['impact']; summary: string } {
  if (income <= 0) return { score: 0, status: 'critical', impact: 'hurting', summary: 'Zero monthly income.' };

  const ratio = investment / income;
  let score = 0;
  let status: DimensionScore['status'] = 'critical';
  let impact: DimensionScore['impact'] = 'hurting';

  if (ratio >= 0.35) {
    score = 100;
    status = 'optimal';
    impact = 'helping';
  } else if (ratio >= 0.20) {
    score = Math.round(80 + ((ratio - 0.20) / 0.15) * 20);
    status = 'good';
    impact = 'helping';
  } else if (ratio >= 0.10) {
    score = Math.round(55 + ((ratio - 0.10) / 0.10) * 25);
    status = 'fair';
    impact = 'neutral';
  } else if (ratio >= 0.05) {
    score = Math.round(30 + ((ratio - 0.05) / 0.05) * 25);
    status = 'fair';
    impact = 'hurting';
  } else {
    score = Math.round((ratio / 0.05) * 30);
    status = 'critical';
    impact = 'hurting';
  }

  const pct = (ratio * 100).toFixed(1);
  let summary = `Investing ${pct}% of monthly income.`;
  if (ratio >= 0.25) summary += ' Strong compounding foundation.';
  else if (ratio >= 0.15) summary += ' Healthy start; consider stepping up.';
  else summary += ' Below recommended 20% wealth-building rate.';

  return { score, status, impact, summary };
}

/**
 * Evaluates the Emergency Buffer dimension (Weight: 25%)
 */
function scoreEmergencyBuffer(
  savings: number, 
  expenses: number | undefined, 
  income: number,
  cityTier: CityTier
): { score: number; status: DimensionScore['status']; impact: DimensionScore['impact']; months: number | null; summary: string } {
  const targetMonths = cityTier === 'tier1' ? 6 : cityTier === 'tier2' ? 5 : 4;
  
  const effectiveExpense = expenses !== undefined && expenses > 0 
    ? expenses 
    : Math.max(1000, income * 0.5);

  const months = savings / effectiveExpense;
  let score = 0;
  let status: DimensionScore['status'] = 'critical';
  let impact: DimensionScore['impact'] = 'hurting';

  if (months >= targetMonths) {
    score = 100;
    status = 'optimal';
    impact = 'helping';
  } else if (months >= targetMonths * 0.75) {
    score = Math.round(80 + ((months - (targetMonths * 0.75)) / (targetMonths * 0.25)) * 20);
    status = 'good';
    impact = 'helping';
  } else if (months >= targetMonths * 0.5) {
    score = Math.round(60 + ((months - (targetMonths * 0.5)) / (targetMonths * 0.25)) * 20);
    status = 'fair';
    impact = 'neutral';
  } else if (months >= 1) {
    score = Math.round(30 + ((months - 1) / ((targetMonths * 0.5) - 1)) * 30);
    status = 'fair';
    impact = 'hurting';
  } else {
    score = Math.round(Math.max(0, months * 30));
    status = 'critical';
    impact = 'hurting';
  }

  const roundedMonths = Math.round(months * 10) / 10;
  let summary = expenses !== undefined
    ? `Covers approx ${roundedMonths} months of essential expenses.`
    : `Covers approx ${roundedMonths} months of estimated living expenses.`;

  if (months >= targetMonths) summary += ' Excellent emergency cushion.';
  else if (months >= 3) summary += ' Adequate, but aim for 6 months.';
  else summary += ' Vulnerable to sudden medical or job shocks.';

  return { score, status, impact, months: roundedMonths, summary };
}

/**
 * Evaluates Savings Capacity / Monthly Cashflow Surplus (Weight: 20%)
 */
function scoreSavingsCapacity(
  income: number,
  emi: number,
  investment: number,
  expenses: number | undefined
): { score: number; status: DimensionScore['status']; impact: DimensionScore['impact']; surplus: number; surplusRatio: number; summary: string } {
  const effectiveExpense = expenses !== undefined ? expenses : (income - emi - investment) * 0.6;
  const surplus = income - emi - investment - effectiveExpense;
  const surplusRatio = income > 0 ? (surplus / income) : 0;

  let score = 50;
  let status: DimensionScore['status'] = 'fair';
  let impact: DimensionScore['impact'] = 'neutral';

  if (surplusRatio >= 0.25) {
    score = 100;
    status = 'optimal';
    impact = 'helping';
  } else if (surplusRatio >= 0.15) {
    score = Math.round(80 + ((surplusRatio - 0.15) / 0.10) * 20);
    status = 'good';
    impact = 'helping';
  } else if (surplusRatio >= 0.05) {
    score = Math.round(60 + ((surplusRatio - 0.05) / 0.10) * 20);
    status = 'fair';
    impact = 'neutral';
  } else if (surplusRatio >= 0) {
    score = Math.round(45 + (surplusRatio / 0.05) * 15);
    status = 'fair';
    impact = 'hurting';
  } else {
    score = Math.max(0, Math.round(45 + (surplusRatio * 100)));
    status = 'critical';
    impact = 'hurting';
  }

  const surplusFormatted = formatIndianCurrency(Math.abs(Math.round(surplus)));
  let summary = '';
  if (surplus >= 0) {
    summary = `Retaining ~${surplusFormatted}/mo in unallocated buffer (${(surplusRatio * 100).toFixed(0)}% of income).`;
  } else {
    summary = `Monthly cashflow deficit of approx ${surplusFormatted}. Outflows exceed salary.`;
  }

  return { score, status, impact, surplus: Math.round(surplus), surplusRatio, summary };
}

/**
 * Categorizes a final 0-100 score into transparent, non-judgmental brackets.
 */
export function getHealthCategory(score: number): { category: HealthCategory; headline: string; summary: string } {
  if (score >= 90) {
    return {
      category: 'Financially Strong',
      headline: 'Exceptional Financial Balance',
      summary: 'You have mastered debt control, disciplined investing, and liquidity protection.'
    };
  } else if (score >= 75) {
    return {
      category: 'Wealth Builder',
      headline: 'Strong Foundation & Steady Compounding',
      summary: 'Your savings and investment habits are compounding efficiently with well-managed obligations.'
    };
  } else if (score >= 60) {
    return {
      category: 'On Track',
      headline: 'Stable Basics with Room for Optimization',
      summary: 'Your core finances are stable. Targeted improvements in debt or emergency cushion will yield high impact.'
    };
  } else if (score >= 40) {
    return {
      category: 'Needs Attention',
      headline: 'Imbalance in Debt or Liquidity Buffers',
      summary: 'Fixed EMI obligations or insufficient emergency reserves are restricting your financial agility.'
    };
  } else {
    return {
      category: 'Financially Stretched',
      headline: 'Heavy Cashflow Pressure',
      summary: 'High monthly commitments leave minimal margin for unexpected expenses. Immediate debt restructuring is advised.'
    };
  }
}

/**
 * Main Deterministic Scoring Function
 */
export function calculateFinancialHealthScore(rawInputs: Partial<FinancialHealthInputs>): FinancialHealthResult {
  const inputs = sanitizeHealthInputs(rawInputs);
  const { age, cityTier, income, emi, investment, savings, expenses } = inputs;

  const debtRes = scoreDebtBurden(emi, income);
  const invRes = scoreInvestmentRate(investment, income);
  const emergRes = scoreEmergencyBuffer(savings, expenses, income, cityTier);
  const capRes = scoreSavingsCapacity(income, emi, investment, expenses);

  const rawWeightedScore = 
    (debtRes.score * SCORING_WEIGHTS.debt) +
    (invRes.score * SCORING_WEIGHTS.investment) +
    (emergRes.score * SCORING_WEIGHTS.emergency) +
    (capRes.score * SCORING_WEIGHTS.savings);

  const finalScore = Math.min(100, Math.max(0, Math.round(rawWeightedScore)));
  const { category, headline, summary: catSummary } = getHealthCategory(finalScore);

  const emiPct = Math.round((emi / income) * 100);
  const invPct = Math.round((investment / income) * 100);

  const dimensions: DimensionScore[] = [
    {
      id: 'debt',
      name: 'Debt Burden',
      weight: SCORING_WEIGHTS.debt * 100,
      score: debtRes.score,
      metricLabel: 'EMI Ratio',
      metricValue: `${emiPct}% of income`,
      status: debtRes.status,
      impact: debtRes.impact,
      summary: debtRes.summary
    },
    {
      id: 'investment',
      name: 'Investment Rate',
      weight: SCORING_WEIGHTS.investment * 100,
      score: invRes.score,
      metricLabel: 'Monthly Investing',
      metricValue: `${invPct}% of income`,
      status: invRes.status,
      impact: invRes.impact,
      summary: invRes.summary
    },
    {
      id: 'emergency',
      name: 'Emergency Buffer',
      weight: SCORING_WEIGHTS.emergency * 100,
      score: emergRes.score,
      metricLabel: 'Coverage',
      metricValue: emergRes.months !== null ? `${emergRes.months} Months` : 'Estimated',
      status: emergRes.status,
      impact: emergRes.impact,
      summary: emergRes.summary
    },
    {
      id: 'savings',
      name: 'Savings Capacity',
      weight: SCORING_WEIGHTS.savings * 100,
      score: capRes.score,
      metricLabel: 'Monthly Cashflow',
      metricValue: capRes.surplus >= 0 ? `+${formatIndianCurrency(capRes.surplus)}` : `-${formatIndianCurrency(Math.abs(capRes.surplus))}`,
      status: capRes.status,
      impact: capRes.impact,
      summary: capRes.summary
    }
  ];

  const realityChecks: RealityCheckItem[] = [
    {
      id: 'rc-emi',
      headline: `${emiPct}% of your monthly income is committed to EMIs.`,
      detail: emiPct <= 25 
        ? `Keeping EMIs under 25% ensures your take-home pay isn't trapped in debt payments.`
        : emiPct <= 45
        ? `Over one-third of your earnings goes directly to financiers before living expenses.`
        : `Over half of your monthly cash flow is consumed by debt, creating critical vulnerability to income disruption.`,
      type: emiPct <= 25 ? 'positive' : emiPct <= 40 ? 'neutral' : 'warning'
    },
    {
      id: 'rc-inv',
      headline: `You invest ${invPct}% (${formatIndianCurrency(investment)}) of your take-home pay every month.`,
      detail: invPct >= 20
        ? `Sustaining a 20%+ investment rate accelerates compounding towards financial independence.`
        : `Increasing your investment rate by even 5% can dramatically reduce the working years needed to build a retirement corpus.`,
      type: invPct >= 20 ? 'positive' : 'warning'
    },
    {
      id: 'rc-emerg',
      headline: emergRes.months !== null 
        ? `Your liquid reserves (${formatIndianCurrency(savings)}) cover approximately ${emergRes.months} months of essential needs.`
        : `Your liquid buffer stands at ${formatIndianCurrency(savings)}.`,
      detail: (emergRes.months ?? 0) >= 6 
        ? `You have the gold standard of 6+ months in liquid cushion, insulating you from career breaks or medical emergencies.`
        : `If your income stopped tomorrow, liquid reserves would sustain your basic household needs for roughly ${emergRes.months ?? 1} months.`,
      type: (emergRes.months ?? 0) >= 4.5 ? 'positive' : 'warning'
    }
  ];

  const actionPlan: ActionRecommendation[] = [];

  if (emiPct > 35) {
    actionPlan.push({
      id: 'act-prepay',
      title: 'Prioritize High-Cost Loan Prepayments',
      description: `With EMIs at ${emiPct}% of income, making small extra monthly payments can cut years off your tenure and save lakhs in interest.`,
      actionUrl: '/calculators/finance/home-loan-emi',
      actionText: 'Explore Prepayment Savings',
      priority: 'high'
    });
  }

  if ((emergRes.months ?? 0) < 5) {
    const targetBuffer = (income * (cityTier === 'tier1' ? 6 : 4)) * 0.5;
    actionPlan.push({
      id: 'act-buffer',
      title: 'Build a 6-Month Liquid Emergency Reserve',
      description: `Target accumulating ${formatIndianCurrency(targetBuffer)} in low-risk FDs or liquid funds before committing to aggressive equity investments.`,
      actionUrl: '/calculators/finance/fd-calculator',
      actionText: 'Calculate Safe FD Returns',
      priority: 'high'
    });
  }

  if (invPct < 25) {
    const boostAmt = Math.round(income * 0.05);
    actionPlan.push({
      id: 'act-stepup',
      title: `Adopt an Annual SIP Step-Up Strategy`,
      description: `Increasing your monthly investment by just ${formatIndianCurrency(boostAmt)} (5% of income) can boost your 15-year wealth by over 40%.`,
      actionUrl: '/calculators/finance/sip-calculator',
      actionText: 'Simulate Step-Up SIP',
      priority: 'medium'
    });
  }

  if (capRes.surplusRatio < 0.10) {
    actionPlan.push({
      id: 'act-budget',
      title: 'Optimize Non-Essential Monthly Cashflows',
      description: `Your unallocated cashflow buffer is tight. Reviewing discretionary spends will free up margin for unexpected obligations.`,
      actionUrl: '/calculators/salary/in-hand-salary-calculator',
      actionText: 'Inspect In-Hand Salary',
      priority: 'medium'
    });
  }

  if (actionPlan.length < 3) {
    actionPlan.push({
      id: 'act-tax',
      title: 'Verify Tax Regime Optimization',
      description: 'Ensure you are maximizing deductions or taking full advantage of the New Tax Regime rebate to retain more in-hand salary.',
      actionUrl: '/calculators/tax/income-tax-calculator',
      actionText: 'Compare Tax Regimes',
      priority: 'low'
    });
  }

  return {
    score: finalScore,
    category,
    categoryHeadline: headline,
    summarySentence: catSummary,
    dimensions,
    realityChecks,
    actionPlan: actionPlan.slice(0, 4),
    inputs,
    normalizedInputs: {
      emiRatio: emiPct,
      investmentRatio: invPct,
      emergencyMonths: emergRes.months,
      monthlySurplus: capRes.surplus,
      surplusRatio: capRes.surplusRatio
    }
  };
}

/**
 * Deterministic What-If Simulator
 */
export function simulateFinancialHealthWhatIf(
  currentInputs: FinancialHealthInputs,
  delta: WhatIfDelta
): WhatIfSimulationResult {
  const originalResult = calculateFinancialHealthScore(currentInputs);

  const modifiedInputs: FinancialHealthInputs = {
    ...currentInputs,
    investment: currentInputs.investment + (delta.extraInvestment || 0),
    emi: Math.max(0, currentInputs.emi - (delta.emiReduction || 0)),
    savings: currentInputs.savings + (delta.extraSavings || 0),
    expenses: currentInputs.expenses !== undefined 
      ? Math.max(0, currentInputs.expenses - (delta.expenseReduction || 0))
      : undefined
  };

  const newResult = calculateFinancialHealthScore(modifiedInputs);
  const scoreDelta = newResult.score - originalResult.score;

  const improved: string[] = [];
  newResult.dimensions.forEach((newDim, i) => {
    const origDim = originalResult.dimensions[i];
    if (newDim.score > origDim.score) {
      improved.push(newDim.name);
    }
  });

  let explanation = '';
  if (scoreDelta > 0) {
    explanation = `Your score improves by +${scoreDelta} points (to ${newResult.score}/100) primarily through stronger ${improved.join(' and ')}.`;
  } else if (scoreDelta < 0) {
    explanation = `Your score decreases by ${scoreDelta} points due to higher obligations.`;
  } else {
    explanation = `Your overall score remains at ${newResult.score}/100 with this adjustment.`;
  }

  return {
    originalScore: originalResult.score,
    newScore: newResult.score,
    scoreDelta,
    originalCategory: originalResult.category,
    newCategory: newResult.category,
    improvedDimensionNames: improved,
    explanation,
    newResult
  };
}
