export interface CalculatorInputOption {
  label: string;
  value: string | number;
}

export interface CalculatorInput {
  id: string;
  label: string;
  type: 'number' | 'select' | 'radio';
  placeholder?: string;
  unit?: string;
  unitOptions?: string[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | string;
  required?: boolean;
  isAdvanced?: boolean;
  options?: CalculatorInputOption[];
  helpText?: string;
}

export interface CalculatorResult {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  isHighlighted?: boolean;
  isCurrency?: boolean;
  description?: string;
}

export interface CalculatorFAQ {
  question: string;
  answer: string;
}

export interface CalculatorDefinition {
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  shortDescription: string;
  longDescription: string;
  inputs: CalculatorInput[];
  keywords: string[];
  relatedCalculators?: string[];
  faqs?: CalculatorFAQ[];
  schemaType?: string;
}

export interface AmortizationRow {
  period: number;
  openingBalance: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
}

export interface GrowthRow {
  period: number; // year
  invested: number;
  returns: number;
  total: number;
}

export interface CalculatorResultPayload {
  results: CalculatorResult[];
  amortization?: AmortizationRow[];
  growthData?: GrowthRow[];
}

export type CalculatorFn = (inputs: Record<string, number | string>) => CalculatorResultPayload;

export interface CalculatorEntry {
  definition: CalculatorDefinition;
  calculate: CalculatorFn;
}
