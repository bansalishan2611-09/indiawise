import { CalculatorResult, CalculatorResultPayload } from '../types';
import { parseInputValue } from '../formatters';

export function calculateBMI(inputs: Record<string, number | string>): CalculatorResultPayload {
  let weightKg = parseInputValue(inputs.weight);
  if (inputs.weight_unit === 'lbs') {
    weightKg = weightKg * 0.453592;
  }

  let heightCm = parseInputValue(inputs.height);
  if (inputs.height_unit === 'm') {
    heightCm = heightCm * 100;
  } else if (inputs.height_unit === 'inches') {
    heightCm = heightCm * 2.54;
  }

  if (heightCm <= 0 || weightKg <= 0) {
    return { results: [
      { id: 'bmi', label: 'BMI', value: '0', isHighlighted: true, description: 'Enter positive values' },
    ] };
  }

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const roundedBmi = Math.round(bmi * 10) / 10;

  let category: string;
  if (bmi < 18.5) {
    category = 'Underweight';
  } else if (bmi < 25) {
    category = 'Normal weight';
  } else if (bmi < 30) {
    category = 'Overweight';
  } else {
    category = 'Obese';
  }

  // Healthy weight range for this height (BMI 18.5 – 24.9)
  const healthyMin = Math.round(18.5 * heightM * heightM * 10) / 10;
  const healthyMax = Math.round(24.9 * heightM * heightM * 10) / 10;

  return { results: [
    { id: 'bmi', label: 'Your BMI', value: roundedBmi, isHighlighted: true, description: category },
    { id: 'category', label: 'Category', value: category, description: 'WHO BMI Classification' },
    { id: 'healthy_min', label: 'Healthy Weight (Min)', value: `${healthyMin} kg`, description: 'BMI 18.5' },
    { id: 'healthy_max', label: 'Healthy Weight (Max)', value: `${healthyMax} kg`, description: 'BMI 24.9' },
  ] };
}
