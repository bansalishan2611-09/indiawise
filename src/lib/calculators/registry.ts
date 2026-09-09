import { CalculatorEntry, CalculatorDefinition } from './types';
import { emiDefinition } from './definitions/emi';
import { sipDefinition } from './definitions/sip';
import { gstDefinition } from './definitions/gst';
import { personalLoanDefinition } from './definitions/personal-loan';
import { fdDefinition } from './definitions/fd';
import { rdDefinition } from './definitions/rd';
import { incomeTaxDefinition } from './definitions/income-tax';
import { salaryDefinition } from './definitions/salary';
import { ageDefinition } from './definitions/age';
import { bmiDefinition } from './definitions/bmi';
import { studentLoanDefinition } from './definitions/student-loan';
import { marginDefinition } from './definitions/margin';
import { calculateEMI } from './logic/emi';
import { calculateSIP } from './logic/sip';
import { calculateGST } from './logic/gst';
import { calculatePersonalLoanEMI } from './logic/personal-loan';
import { calculateFD } from './logic/fd';
import { calculateRD } from './logic/rd';
import { calculateIncomeTax } from './logic/income-tax';
import { calculateSalary } from './logic/salary';
import { calculateAge } from './logic/age';
import { calculateBMI } from './logic/bmi';
import { calculateStudentLoan } from './logic/student-loan';
import { calculateMargin } from './logic/margin';

const registry = new Map<string, CalculatorEntry>([
  [emiDefinition.slug, { definition: emiDefinition, calculate: calculateEMI }],
  [sipDefinition.slug, { definition: sipDefinition, calculate: calculateSIP }],
  [gstDefinition.slug, { definition: gstDefinition, calculate: calculateGST }],
  [personalLoanDefinition.slug, { definition: personalLoanDefinition, calculate: calculatePersonalLoanEMI }],
  [fdDefinition.slug, { definition: fdDefinition, calculate: calculateFD }],
  [rdDefinition.slug, { definition: rdDefinition, calculate: calculateRD }],
  [incomeTaxDefinition.slug, { definition: incomeTaxDefinition, calculate: calculateIncomeTax }],
  [salaryDefinition.slug, { definition: salaryDefinition, calculate: calculateSalary }],
  [ageDefinition.slug, { definition: ageDefinition, calculate: calculateAge }],
  [bmiDefinition.slug, { definition: bmiDefinition, calculate: calculateBMI }],
  [studentLoanDefinition.slug, { definition: studentLoanDefinition, calculate: calculateStudentLoan }],
  [marginDefinition.slug, { definition: marginDefinition, calculate: calculateMargin }],
]);

export function getCalculator(slug: string): CalculatorEntry | undefined {
  return registry.get(slug);
}

export function getAllCalculators(): CalculatorDefinition[] {
  return Array.from(registry.values()).map(e => e.definition);
}

export function getCalculatorsByCategory(categorySlug: string): CalculatorDefinition[] {
  return getAllCalculators().filter(d => d.categorySlug === categorySlug);
}

export function searchCalculators(query: string): CalculatorDefinition[] {
  const q = query.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!q) return getAllCalculators();
  return getAllCalculators().filter(d => {
    const normName = d.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normDesc = d.shortDescription.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normKeywords = d.keywords.map(k => k.toLowerCase().replace(/[^a-z0-9]/g, ''));
    
    return normName.includes(q) || normDesc.includes(q) || normKeywords.some(k => k.includes(q));
  });
}
