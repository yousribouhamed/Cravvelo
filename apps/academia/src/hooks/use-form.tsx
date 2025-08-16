"use client";

import { useCallback, useState } from "react";
import { z } from "zod";

type FieldErrors<T> = Partial<Record<keyof T, string>>;
type TouchedFields<T> = Partial<Record<keyof T, boolean>>;

interface UseFormReturn<T> {
  values: T;
  errors: FieldErrors<T>;
  touched: TouchedFields<T>;
  setValue: <K extends keyof T>(name: K, value: T[K]) => void;
  setTouched: (name: keyof T) => void;
  validate: () => boolean;
  reset: () => void;
  isValid: boolean;
  isDirty: boolean;
}

export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationSchema: z.ZodSchema<T>
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FieldErrors<T>>({});
  const [touched, setTouched] = useState<TouchedFields<T>>({});

  // Set a specific field value with type safety
  const setValue = useCallback(
    <K extends keyof T>(name: K, value: T[K]) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  // Mark a field as touched
  const setTouchedField = useCallback((name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  // Validate all fields using the Zod schema
  const validate = useCallback((): boolean => {
    const result = validationSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors: FieldErrors<T> = {};

      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof T;
        if (field) {
          fieldErrors[field] = error.message;
        }
      });

      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  }, [values, validationSchema]);

  // Reset form to initial state
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Computed properties
  const isValid = Object.keys(errors).length === 0;
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched: setTouchedField,
    validate,
    reset,
    isValid,
    isDirty,
  };
};

// Usage example with the sign-in form
export type SignInFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

// Example of how to use it:
/*
const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean()
});

const MyComponent = () => {
  const form = useForm<SignInFormData>({
    email: '',
    password: '',
    rememberMe: false
  }, signInSchema);

  // TypeScript will provide autocomplete and type checking
  form.setValue('email', 'test@example.com'); // ✅ Valid
  form.setValue('email', 123); // ❌ Type error
  form.setValue('invalidField', 'value'); // ❌ Type error

  return (
    <input 
      value={form.values.email} 
      onChange={(e) => form.setValue('email', e.target.value)}
    />
  );
};
*/
