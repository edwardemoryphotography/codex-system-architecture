export interface ValidationRule {
  validate: (value: string, formValues?: Record<string, string>) => boolean;
  message: string;
}

export interface FieldValidation {
  isValid: boolean;
  error: string | null;
  touched: boolean;
  validating: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validators = {
  required: (message = 'This field is required'): ValidationRule => ({
    validate: (value) => value.trim().length > 0,
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value) => value.length <= max,
    message: message || `Must be no more than ${max} characters`,
  }),

  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message,
  }),

  url: (message = 'Please enter a valid URL'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message,
  }),

  pattern: (regex: RegExp, message: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return regex.test(value);
    },
    message,
  }),

  alphanumeric: (message = 'Only letters and numbers are allowed'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return /^[a-zA-Z0-9]+$/.test(value);
    },
    message,
  }),

  noSpecialChars: (message = 'Special characters are not allowed'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return /^[a-zA-Z0-9\s]+$/.test(value);
    },
    message,
  }),

  match: (fieldName: string, message?: string): ValidationRule => ({
    validate: (value, formValues) => {
      if (!formValues) return true;
      return value === formValues[fieldName];
    },
    message: message || `Must match ${fieldName}`,
  }),

  number: (message = 'Please enter a valid number'): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      return !isNaN(Number(value));
    },
    message,
  }),

  min: (minValue: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const num = Number(value);
      return !isNaN(num) && num >= minValue;
    },
    message: message || `Must be at least ${minValue}`,
  }),

  max: (maxValue: number, message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      const num = Number(value);
      return !isNaN(num) && num <= maxValue;
    },
    message: message || `Must be no more than ${maxValue}`,
  }),

  custom: (validateFn: (value: string, formValues?: Record<string, string>) => boolean, message: string): ValidationRule => ({
    validate: validateFn,
    message,
  }),
};

export function validateField(value: string, rules: ValidationRule[], formValues?: Record<string, string>): { isValid: boolean; error: string | null } {
  for (const rule of rules) {
    if (!rule.validate(value, formValues)) {
      return { isValid: false, error: rule.message };
    }
  }
  return { isValid: true, error: null };
}

export function validateForm(values: Record<string, string>, schema: Record<string, ValidationRule[]>): ValidationResult {
  const errors: Record<string, string> = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(schema)) {
    const result = validateField(values[field] || '', rules, values);
    if (!result.isValid && result.error) {
      errors[field] = result.error;
      isValid = false;
    }
  }

  return { isValid, errors };
}

export function getFieldStrength(value: string, rules: ValidationRule[]): number {
  if (!value) return 0;
  let passed = 0;
  for (const rule of rules) {
    if (rule.validate(value)) passed++;
  }
  return Math.round((passed / rules.length) * 100);
}

export const passwordStrengthRules: ValidationRule[] = [
  validators.minLength(8, 'At least 8 characters'),
  validators.pattern(/[a-z]/, 'Contains lowercase letter'),
  validators.pattern(/[A-Z]/, 'Contains uppercase letter'),
  validators.pattern(/[0-9]/, 'Contains number'),
  validators.pattern(/[^a-zA-Z0-9]/, 'Contains special character'),
];

export function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  const score = getFieldStrength(password, passwordStrengthRules);

  if (score < 40) return { score, label: 'Weak', color: 'red' };
  if (score < 60) return { score, label: 'Fair', color: 'orange' };
  if (score < 80) return { score, label: 'Good', color: 'yellow' };
  return { score, label: 'Strong', color: 'green' };
}
