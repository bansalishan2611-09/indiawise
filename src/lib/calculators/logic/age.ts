import { CalculatorResult, CalculatorResultPayload } from '../types';
import { parseInputValue } from '../formatters';

export function calculateAge(inputs: Record<string, number | string>): CalculatorResultPayload {
  const birthYear = parseInputValue(inputs.birthYear);
  const birthMonth = parseInputValue(inputs.birthMonth);
  const birthDay = parseInputValue(inputs.birthDay);

  const today = new Date();
  const birth = new Date(birthYear, birthMonth - 1, birthDay);

  // Validate date
  if (birth > today || birthYear < 1900) {
    return { results: [
      { id: 'age_years', label: 'Age', value: 'Invalid date', isHighlighted: true, description: 'Please enter a valid date of birth' },
    ] };
  }

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalMonths = years * 12 + months;
  const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);

  return { results: [
    { id: 'age_years', label: 'Your Age', value: `${years} years, ${months} months, ${days} days`, isHighlighted: true, description: 'Exact age as of today' },
    { id: 'total_months', label: 'Total Months', value: totalMonths, description: 'Age in months' },
    { id: 'total_weeks', label: 'Total Weeks', value: totalWeeks, description: 'Age in weeks' },
    { id: 'total_days', label: 'Total Days', value: totalDays, description: 'Age in days' },
  ] };
}
