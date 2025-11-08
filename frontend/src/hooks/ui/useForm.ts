import { useState, useCallback } from 'react';
import type { ChangeEvent } from 'react';

type ValidationRule<T> = (value: T[keyof T]) => string | undefined;
type ValidationRules<T> = Partial<Record<keyof T, ValidationRule<T>>>;

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isDirty: boolean;
  handleChange: (field: keyof T) => (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (field: keyof T) => () => void;
  setFieldValue: (field: keyof T, value: T[keyof T]) => void;
  setFieldError: (field: keyof T, error: string) => void;
  validateField: (field: keyof T) => void;
  validateAll: () => boolean;
  reset: () => void;
  resetField: (field: keyof T) => void;
}

export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validationRules: ValidationRules<T> = {}
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = useCallback((field: keyof T) => {
    const rule = validationRules[field];
    if (rule) {
      const error = rule(values[field]);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
      return !error;
    }
    return true;
  }, [values, validationRules]);

  const validateAll = useCallback(() => {
    let isFormValid = true;
    const newErrors: Partial<Record<keyof T, string>> = {};

    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field as keyof T];
      if (rule) {
        const error = rule(values[field as keyof T]);
        if (error) {
          newErrors[field as keyof T] = error;
          isFormValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isFormValid;
  }, [values, validationRules]);

  const handleChange = useCallback((field: keyof T) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValues(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  }, [errors]);

  const handleBlur = useCallback((field: keyof T) => () => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    validateField(field);
  }, [validateField]);

  const setFieldValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const resetField = useCallback((field: keyof T) => {
    setValues(prev => ({
      ...prev,
      [field]: initialValues[field]
    }));
    setErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
    setTouched(prev => ({
      ...prev,
      [field]: false
    }));
  }, [initialValues]);

  const isValid = Object.keys(errors).every(key => !errors[key as keyof T]);
  const isDirty = Object.keys(values).some(key => 
    values[key as keyof T] !== initialValues[key as keyof T]
  );

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldError,
    validateField,
    validateAll,
    reset,
    resetField
  };
}

// 공통 validation 규칙들
export const validationRules = {
  required: (message = '필수 입력 항목입니다') => (value: unknown) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return message;
    }
    return undefined;
  },
  
  email: (message = '올바른 이메일 형식이 아닙니다') => (value: string) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return message;
    }
    return undefined;
  },
  
  minLength: (min: number, message?: string) => (value: string) => {
    if (value && value.length < min) {
      return message || `최소 ${min}자 이상 입력해주세요`;
    }
    return undefined;
  },
  
  maxLength: (max: number, message?: string) => (value: string) => {
    if (value && value.length > max) {
      return message || `최대 ${max}자까지 입력 가능합니다`;
    }
    return undefined;
  }
};

export default useForm;