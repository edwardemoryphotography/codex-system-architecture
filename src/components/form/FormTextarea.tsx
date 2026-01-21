import { useState, useId } from 'react';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { FieldValidation } from '../../lib/validation';

interface FormTextareaProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: () => void;
  validation?: FieldValidation;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  isDarkMode?: boolean;
  rows?: number;
  maxLength?: number;
  showCount?: boolean;
  name?: string;
}

export function FormTextarea({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  validation,
  hint,
  required,
  disabled,
  isDarkMode = false,
  rows = 4,
  maxLength,
  showCount = false,
  name,
}: FormTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const id = useId();
  const errorId = `${id}-error`;

  const hasError = validation?.touched && !validation?.isValid;
  const isValid = validation?.touched && validation?.isValid && value.length > 0;
  const isValidating = validation?.validating;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className={`block text-sm font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {showCount && maxLength && (
          <span
            className={`text-xs ${
              value.length > maxLength * 0.9
                ? 'text-red-500'
                : isDarkMode
                  ? 'text-gray-500'
                  : 'text-gray-400'
            }`}
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <div className="relative">
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          maxLength={maxLength}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={`
            w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none resize-none
            ${isDarkMode
              ? 'bg-gray-800 text-white placeholder-gray-500'
              : 'bg-white text-gray-900 placeholder-gray-400'
            }
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
        />

        <div className="absolute right-3 top-3 flex items-center gap-2">
          {isValidating && (
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          )}

          {!isValidating && hasError && (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}

          {!isValidating && isValid && (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
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
