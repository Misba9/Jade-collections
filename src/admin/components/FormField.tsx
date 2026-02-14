import React from 'react';
import { cn } from '../../lib/utils';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'number' | 'date' | 'checkbox' | 'textarea' | 'select';
  value?: string | number | boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  className?: string;
  rows?: number;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required,
  disabled,
  min,
  max,
  step,
  options,
  className,
  rows = 3,
}) => {
  const inputClasses = cn(
    'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jade-500 focus:border-transparent transition-colors',
    error ? 'border-red-500' : 'border-stone-300',
    disabled && 'bg-stone-100 cursor-not-allowed'
  );

  return (
    <div className={cn('space-y-1', className)}>
      <label htmlFor={name} className="block text-sm font-medium text-stone-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value as string}
          onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
          onBlur={onBlur as React.FocusEventHandler<HTMLTextAreaElement>}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={inputClasses}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value as string}
          onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
          onBlur={onBlur as React.FocusEventHandler<HTMLSelectElement>}
          required={required}
          disabled={disabled}
          className={inputClasses}
        >
          <option value="">Select...</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'checkbox' ? (
        <div className="flex items-center gap-2">
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={value as boolean}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
            disabled={disabled}
            className="h-4 w-4 rounded border-stone-300 text-jade-600 focus:ring-jade-500"
          />
          <span className="text-sm text-stone-600">{placeholder}</span>
        </div>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value as string | number}
          onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
          onBlur={onBlur as React.FocusEventHandler<HTMLInputElement>}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={inputClasses}
        />
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
