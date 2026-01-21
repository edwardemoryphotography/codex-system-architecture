import { useState, useId } from 'react';
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { FieldValidation } from '../../lib/validation';

interface FormInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  validation?: FieldValidation;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  isDarkMode?: boolean;
  autoComplete?: string;
  icon?: React.ReactNode;
  showStrength?: boolean;
  strengthScore?: number;
  strengthLabel?: string;
  name?: string;
}

export function FormInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  validation,
  hint,
  required,
  disabled,
  isDarkMode = false,
  autoComplete,
  icon,
  showStrength,
  strengthScore = 0,
  strengthLabel,
  name,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const id = useId();
  const errorId = `${id}-error`;

  const hasError = validation?.touched && !validation?.isValid;
  const isValid = validation?.touched && validation?.isValid && value.length > 0;
  const isValidating = validation?.validating;

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const getStrengthColor = () => {
    if (strengthScore < 40) return 'bg-red-500';
    if (strengthScore < 60) return 'bg-orange-500';
    if (strengthScore < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

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
        {icon && (
          <div
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            {icon}
          </div>
        )}

        <input
          id={id}
          name={name}
          type={inputType}
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
          autoComplete={autoComplete}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={`
            w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none
            ${icon ? 'pl-10' : ''}
            ${type === 'password' ? 'pr-20' : 'pr-10'}
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

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isValidating && (
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          )}

          {!isValidating && hasError && (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}

          {!isValidating && isValid && (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}

          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`p-1 rounded transition-colors ${
                isDarkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {showStrength && value.length > 0 && (
        <div className="space-y-1">
          <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${getStrengthColor()}`}
              style={{ width: `${strengthScore}%` }}
            />
          </div>
          {strengthLabel && (
            <p className={`text-xs ${
              strengthScore < 40 ? 'text-red-500' :
              strengthScore < 60 ? 'text-orange-500' :
              strengthScore < 80 ? 'text-yellow-600' :
              'text-green-500'
            }`}>
              Password strength: {strengthLabel}
            </p>
          )}
        </div>
      )}

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
