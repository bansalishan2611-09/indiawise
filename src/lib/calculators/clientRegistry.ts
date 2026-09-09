// Client-safe registry — maps slug to calculation function
// This is imported only by client components (CalculatorShell)
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
import { CalculatorFn } from './types';

const clientRegistry: Record<string, CalculatorFn> = {
  'home-loan-emi': calculateEMI,
  'sip-calculator': calculateSIP,
  'gst-calculator': calculateGST,
  'personal-loan-emi-calculator': calculatePersonalLoanEMI,
  'fd-calculator': calculateFD,
  'rd-calculator': calculateRD,
  'income-tax-calculator': calculateIncomeTax,
  'in-hand-salary-calculator': calculateSalary,
  'age-calculator': calculateAge,
  'bmi-calculator': calculateBMI,
  'student-loan-calculator': calculateStudentLoan,
  'margin-calculator': calculateMargin,
};

export function getCalculateFn(slug: string): CalculatorFn | undefined {
  return clientRegistry[slug];
}
