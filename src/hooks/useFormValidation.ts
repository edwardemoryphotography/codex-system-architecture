import { useState, useCallback, useRef } from 'react';
import { ValidationRule, validateField, validateForm, FieldValidation } from '../lib/validation';

export interface FormConfig<T extends Record<string, string>> {
  initialValues: T;
  validationSchema: Record<keyof T, ValidationRule[]>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  debounceMs?: number;
}

export interface FormState<T extends Record<string, string>> {
  values: T;
  fields: Record<keyof T, FieldValidation>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  submitCount: number;
}

export interface FormActions<T extends Record<string, string>> {
  setValue: (field: keyof T, value: string) => void;
  setValues: (values: Partial<T>) => void;
  setTouched: (field: keyof T) => void;
  validateField: (field: keyof T) => Promise<boolean>;
  validateAll: () => Promise<boolean>;
  handleSubmit: (onSubmit: (values: T) => Promise<void>) => (e?: React.FormEvent) => Promise<void>;
  reset: () => void;
  getFieldProps: (field: keyof T) => {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onBlur: () => void;
    name: string;
    'aria-invalid': boolean;
    'aria-describedby': string;
  };
}

export function useFormValidation<T extends Record<string, string>>(
  config: FormConfig<T>
): [FormState<T>, FormActions<T>] {
  const { initialValues, validationSchema, validateOnChange = true, validateOnBlur = true, debounceMs = 300 } = config;

  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});

  const createInitialFieldState = (): Record<keyof T, FieldValidation> => {
    const fields = {} as Record<keyof T, FieldValidation>;
    for (const key of Object.keys(initialValues) as (keyof T)[]) {
      fields[key] = { isValid: true, error: null, touched: false, validating: false };
    }
    return fields;
  };

  const [values, setValuesState] = useState<T>(initialValues);
  const [fields, setFields] = useState<Record<keyof T, FieldValidation>>(createInitialFieldState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const isDirty = Object.keys(values).some((key) => values[key as keyof T] !== initialValues[key as keyof T]);
  const isValid = Object.values(fields).every((field) => (field as FieldValidation).isValid);

  const validateSingleField = useCallback(
    async (field: keyof T, currentValues: T = values): Promise<boolean> => {
      const rules = validationSchema[field];
      if (!rules) return true;

      setFields((prev) => ({
        ...prev,
        [field]: { ...prev[field], validating: true },
      }));

      const result = validateField(currentValues[field], rules, currentValues as Record<string, string>);

      setFields((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          isValid: result.isValid,
          error: result.error,
          validating: false,
        },
      }));

      return result.isValid;
    },
    [validationSchema, values]
  );

  const setValue = useCallback(
    (field: keyof T, value: string) => {
      setValuesState((prev) => {
        const newValues = { ...prev, [field]: value };

        if (validateOnChange) {
          if (debounceTimers.current[field as string]) {
            clearTimeout(debounceTimers.current[field as string]);
          }
          debounceTimers.current[field as string] = setTimeout(() => {
            validateSingleField(field, newValues);
          }, debounceMs);
        }

        return newValues;
      });
    },
    [validateOnChange, validateSingleField, debounceMs]
  );

  const setValues = useCallback((newValues: Partial<T>) => {
    setValuesState((prev) => ({ ...prev, ...newValues }));
  }, []);

  const setTouched = useCallback(
    (field: keyof T) => {
      setFields((prev) => ({
        ...prev,
        [field]: { ...prev[field], touched: true },
      }));

      if (validateOnBlur) {
        validateSingleField(field);
      }
    },
    [validateOnBlur, validateSingleField]
  );

  const validateAll = useCallback(async (): Promise<boolean> => {
    const result = validateForm(values as Record<string, string>, validationSchema as Record<string, ValidationRule[]>);

    const newFields = { ...fields };
    for (const key of Object.keys(validationSchema) as (keyof T)[]) {
      newFields[key] = {
        ...newFields[key],
        isValid: !result.errors[key as string],
        error: result.errors[key as string] || null,
        touched: true,
      };
    }
    setFields(newFields);

    return result.isValid;
  }, [values, validationSchema, fields]);

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => Promise<void>) =>
      async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        setSubmitCount((c) => c + 1);
        const isFormValid = await validateAll();

        if (!isFormValid) return;

        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      },
    [validateAll, values]
  );

  const reset = useCallback(() => {
    setValuesState(initialValues);
    setFields(createInitialFieldState());
    setSubmitCount(0);
  }, [initialValues]);

  const getFieldProps = useCallback(
    (field: keyof T) => ({
      value: values[field],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setValue(field, e.target.value);
      },
      onBlur: () => setTouched(field),
      name: field as string,
      'aria-invalid': !fields[field].isValid && fields[field].touched,
      'aria-describedby': `${String(field)}-error`,
    }),
    [values, fields, setValue, setTouched]
  );

  const state: FormState<T> = {
    values,
    fields,
    isSubmitting,
    isValid,
    isDirty,
    submitCount,
  };

  const actions: FormActions<T> = {
    setValue,
    setValues,
    setTouched,
    validateField: validateSingleField,
    validateAll,
    handleSubmit,
    reset,
    getFieldProps,
  };

  return [state, actions];
}
