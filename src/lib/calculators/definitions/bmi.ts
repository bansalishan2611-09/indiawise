import { CalculatorDefinition } from '../types';

export const bmiDefinition: CalculatorDefinition = {
  slug: 'bmi-calculator',
  name: 'BMI Calculator',
  category: 'Everyday',
  categorySlug: 'everyday',
  shortDescription: 'Calculate your Body Mass Index (BMI) and check if your weight is healthy for your height.',
  longDescription: 'Use our BMI Calculator to determine your Body Mass Index based on your weight and height. See where you fall on the WHO classification scale and find out your healthy weight range.',
  keywords: ['bmi calculator', 'body mass index', 'bmi calculator india', 'healthy weight calculator', 'weight check'],
  relatedCalculators: ['age-calculator'],
  whatIf: {
    id: 'extraWeight',
    label: 'Change Weight by',
    min: -50,
    max: 50,
    step: 1,
    defaultValue: 0,
    unit: 'kg'
  },
  faqs: [
    {
      question: 'What is BMI?',
      answer: 'Body Mass Index (BMI) is a simple screening tool that uses your weight and height to estimate body fat. It is calculated as weight (kg) divided by height (m) squared.'
    },
    {
      question: 'What is a healthy BMI?',
      answer: 'A BMI between 18.5 and 24.9 is generally considered healthy. Below 18.5 is underweight, 25–29.9 is overweight, and 30+ is obese according to the WHO classification.'
    },
    {
      question: 'Is BMI accurate for everyone?',
      answer: 'BMI is a useful screening tool but does not directly measure body fat. It may overestimate fat in muscular individuals and underestimate fat in older adults.'
    }
  ],
  inputs: [
    { id: 'weight', label: 'Weight', type: 'number', unitOptions: ['kg', 'lbs'], min: 20, max: 500, step: 0.5, defaultValue: 70, helpText: 'Your body weight' },
    { id: 'height', label: 'Height', type: 'number', unitOptions: ['cm', 'm', 'inches'], min: 50, max: 300, step: 0.5, defaultValue: 170, helpText: 'Your height' },
  ],
};
