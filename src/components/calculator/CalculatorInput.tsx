'use client';
import { CalculatorInput as InputType } from '@/lib/calculators/types';
import { cn } from '@/lib/utils';
import { ChangeEvent, useState, useEffect } from 'react';

interface Props {
  input: InputType;
  value: string | number;
  unitValue?: string;
  onChange: (id: string, value: string | number) => void;
  error?: string;
}

export default function CalculatorInput({ input, value, unitValue, onChange, error }: Props) {
  const baseInput = 'w-full rounded-xl border bg-white px-4 py-3 text-navy font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all shadow-sm';
  const errorClass = error ? 'border-red-400' : 'border-border focus:border-brand';
  
  // Local state for the text input to allow intermediate typing (like deleting a digit)
  const [localValue, setLocalValue] = useState<string>(value.toString());
  
  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed)) {
      onChange(input.id, parsed);
    }
  };

  const handleBlur = () => {
    let parsed = parseFloat(localValue);
    if (isNaN(parsed)) parsed = typeof input.defaultValue === 'number' ? input.defaultValue : 0;
    
    // Clamp to min/max on blur if it's a number
    if (input.type === 'number') {
      if (input.min !== undefined && parsed < input.min) parsed = input.min;
      if (input.max !== undefined && parsed > input.max) parsed = input.max;
    }
    
    setLocalValue(parsed.toString());
    onChange(input.id, parsed);
  };

  const hasSlider = input.type === 'number' && input.min !== undefined && input.max !== undefined;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={input.id} className="block text-sm font-semibold text-navy">
          {input.label}
          {input.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {input.type === 'number' && input.unit && !input.unitOptions && (
          <span className="text-xs font-medium text-brand bg-brand/10 px-2 py-1 rounded-md">{input.unit}</span>
        )}
      </div>

      {input.type === 'number' && (
        <div className="space-y-3">
          <div className="relative flex items-center">
            {input.unit === '₹' && !input.unitOptions && (
              <span className="absolute left-4 text-muted font-semibold text-lg pointer-events-none">₹</span>
            )}
            <input
              id={input.id}
              type="number"
              min={input.min}
              max={input.max}
              step={input.step}
              value={localValue}
              onChange={handleTextChange}
              onBlur={handleBlur}
              placeholder={input.placeholder}
              suppressHydrationWarning
              aria-describedby={input.helpText ? `${input.id}-help` : undefined}
              className={cn(baseInput, errorClass, input.unit === '₹' && !input.unitOptions ? 'pl-9' : '', input.unit && input.unit !== '₹' ? 'pr-16' : '', input.unitOptions ? 'pr-24' : '')}
            />
            {input.unitOptions ? (
              <div className="absolute right-1 top-1 bottom-1 flex items-center bg-alt border-l border-border rounded-r-xl group hover:bg-gray-100 transition-colors">
                <select
                  value={unitValue}
                  onChange={(e) => onChange(`${input.id}_unit`, e.target.value)}
                  className="h-full w-full bg-transparent appearance-none pl-3 pr-8 text-sm font-semibold text-navy focus:outline-none focus:ring-2 focus:ring-brand/50 rounded-r-xl cursor-pointer"
                >
                  {input.unitOptions.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
                <div className="absolute right-2 pointer-events-none text-muted group-hover:text-navy transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            ) : input.unit && input.unit !== '₹' ? (
              <span className="absolute right-4 text-muted font-semibold text-sm pointer-events-none">{input.unit}</span>
            ) : null}
          </div>
          
          {hasSlider && (
            <div className="pt-2 pb-1 px-1">
              <input 
                type="range"
                min={input.min}
                max={input.max}
                step={input.step || 1}
                value={typeof value === 'number' ? value : parseFloat(value as string) || 0}
                onChange={(e) => onChange(input.id, parseFloat(e.target.value))}
                className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-brand"
              />
              <div className="flex justify-between text-[10px] font-medium text-muted mt-2">
                <span>{input.unit === '₹' ? `₹${input.min}` : `${input.min}${input.unit || ''}`}</span>
                <span>{input.unit === '₹' ? `₹${input.max}` : `${input.max}${input.unit || ''}`}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {input.type === 'select' && (
        <select
          id={input.id}
          value={value}
          onChange={e => onChange(input.id, e.target.value)}
          className={cn(baseInput, errorClass, 'cursor-pointer')}
        >
          {input.options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      )}

      {input.type === 'radio' && (
        <div className="grid grid-cols-2 gap-3">
          {input.options?.map(opt => (
            <label key={opt.value} className={cn('flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all text-sm font-semibold', String(value) === String(opt.value) ? 'border-brand bg-brand/5 text-brand shadow-sm' : 'border-border bg-white text-navy hover:bg-alt hover:border-brand/30')}>
              <input
                type="radio"
                name={input.id}
                value={opt.value}
                checked={String(value) === String(opt.value)}
                onChange={() => onChange(input.id, opt.value)}
                className="sr-only"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      )}

      {input.helpText && <p id={`${input.id}-help`} className="text-xs text-muted font-medium">{input.helpText}</p>}
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}
