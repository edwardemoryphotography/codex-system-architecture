import { useState, useId } from 'react';
import { AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';
import { FieldValidation } from '../../lib/validation';

interface FormSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps {
  label: string;
  options: FormSelectOption[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: () => void;
  validation?: FieldValidation;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  isDarkMode?: boolean;
  placeholder?: string;
  name?: string;
}

export function FormSelect({
  label,
  options,
  value,
  onChange,
  onBlur,
  validation,
  hint,
  required,
  disabled,
  isDarkMode = false,
  placeholder = 'Select an option',
  name,
}: FormSelectProps) {
  const [isFocused, setIsFocused] = useState(false);
  const id = useId();
  const errorId = `${id}-error`;

  const hasError = validation?.touched && !validation?.isValid;
  const isValid = validation?.touched && validation?.isValid && value.length > 0;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className={`block text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          onFocus={() => setIsFocused(true)}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={`
            w-full px-4 py-3 pr-10 rounded-xl text-sm transition-all duration-200 outline-none appearance-none cursor-pointer
            ${isDarkMode
              ? 'bg-gray-800 text-white'
              : 'bg-white text-gray-900'
            }
            ${!value ? (isDarkMode ? 'text-gray-500' : 'text-gray-400') : ''}
            ${hasError
              ? isDarkMode
                ? 'border-2 border-red-500/50 focus:border-red-500'
                : 'border-2 border-red-300 focus:border-red-500'
              : isValid
                ? isDarkMode
                  ? 'border-2 border-green-500/50 focus:border-green-500'
                  : 'border-2 border-green-300 focus:border-green-500'
                : isDarkMode
                  ? 'border-2 border-gray-700 focus:border-blue-500'
                  : 'border-2 border-gray-200 focus:border-blue-500'
            }
            ${isFocused ? 'ring-4 ring-blue-500/10' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
          {hasError && <AlertCircle className="w-4 h-4 text-red-500" />}
          {isValid && <CheckCircle className="w-4 h-4 text-green-500" />}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isFocused ? 'rotate-180' : ''
            } ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
          />
        </div>
      </div>

      {hasError && validation?.error && (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-sm text-red-500 animate-slideDown"
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          {validation.error}
        </p>
      )}

      {hint && !hasError && (
        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {hint}
        </p>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown { animation: slideDown 0.2s ease-out; }
      `}</style>
    </div>
  );
}
