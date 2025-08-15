"use client";

import type { FC } from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@ui/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import {
  validateSubdomain,
  checkSubdomainAvailability,
  sanitizeSubdomain,
} from "../utils/wordsFilter";

// Enhanced form schema with better validation
const formSchema = z.object({
  subdomain: z
    .string()
    .min(1, { message: "يرجى إدخال النطاق الفرعي" })
    .transform(sanitizeSubdomain)
    .refine(
      (val) => {
        const validation = validateSubdomain(val);
        return validation.isValid;
      },
      {
        message: "النطاق الفرعي غير صالح",
      }
    ),
});

interface ChangeDomainFormProps {
  subdomain: string | null;
  onSuccess?: (newSubdomain: string) => void;
  onError?: (error: string) => void;
}

const ChangeSubDomainForm: FC<ChangeDomainFormProps> = ({
  subdomain,
  onSuccess,
  onError,
}) => {
  const [validationState, setValidationState] = useState<{
    isChecking: boolean;
    isAvailable: boolean | null;
    message?: string;
    suggestion?: string;
  }>({
    isChecking: false,
    isAvailable: null,
  });

  const initialSubdomain = subdomain ? subdomain.split(".")[0] : "";

  const mutation = trpc.chnageSubDmain.useMutation({
    onSuccess: (data) => {
      setValidationState({ isChecking: false, isAvailable: null });
      onSuccess?.(data?.subdomain || form.getValues().subdomain);
    },
    onError: (error) => {
      const errorMessage = error.message || "حدث خطأ أثناء تحديث النطاق الفرعي";
      onError?.(errorMessage);
      form.setError("subdomain", { message: errorMessage });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subdomain: initialSubdomain,
    },
  });

  const watchedSubdomain = form.watch("subdomain");

  // Real-time validation and availability check
  useEffect(() => {
    const checkAvailability = async (value: string) => {
      if (!value || value.length < 3) return;

      const validation = validateSubdomain(value);
      if (!validation.isValid) {
        setValidationState({
          isChecking: false,
          isAvailable: false,
          message: validation.message,
          suggestion: validation.suggestion,
        });
        return;
      }

      setValidationState((prev) => ({ ...prev, isChecking: true }));

      try {
        const availability = await checkSubdomainAvailability(value);
        setValidationState({
          isChecking: false,
          isAvailable: availability.isAvailable,
          message: availability.message,
        });
      } catch (error) {
        setValidationState({
          isChecking: false,
          isAvailable: null,
          message: "فشل في التحقق من توفر النطاق الفرعي",
        });
      }
    };

    const debounceTimer = setTimeout(() => {
      if (watchedSubdomain) {
        checkAvailability(watchedSubdomain);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [watchedSubdomain]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Final validation before submission
    const validation = validateSubdomain(data.subdomain);
    if (!validation.isValid) {
      form.setError("subdomain", { message: validation.message });
      return;
    }

    // Check if available
    if (validationState.isAvailable === false) {
      form.setError("subdomain", { message: "هذا النطاق الفرعي غير متاح" });
      return;
    }

    await mutation.mutateAsync({
      subdomain: data.subdomain + ".cravvelo.com",
    });
  };

  const applySuggestion = () => {
    if (validationState.suggestion) {
      form.setValue("subdomain", validationState.suggestion);
    }
  };

  const getStatusIcon = () => {
    if (validationState.isChecking) {
      return <LoadingSpinner />;
    }
    if (validationState.isAvailable === true) {
      return <span className="text-green-500 text-sm">✓ متاح</span>;
    }
    if (validationState.isAvailable === false) {
      return <span className="text-red-500 text-sm">✗ غير متاح</span>;
    }
    return null;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border rounded-xl shadow-none">
          <CardHeader>
            <CardTitle>النطاق الفرعي</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="subdomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>النطاق الفرعي لموقعك</FormLabel>
                  <FormControl>
                    <div className="w-full h-14 border rounded-xl flex items-center p-2">
                      <div className="w-[150px] h-full flex items-center justify-center bg-primary text-white rounded-lg">
                        <span className="text-sm">cravvelo.com/</span>
                      </div>
                      <div className="flex-1 flex items-center">
                        <Input
                          className="border-none shadow-none focus-visible:ring-0"
                          placeholder="حدد اسم المجال الخاص بك"
                          {...field}
                          onChange={(e) => {
                            const sanitized = sanitizeSubdomain(e.target.value);
                            field.onChange(sanitized);
                          }}
                        />
                        <div className="ml-2 flex items-center">
                          {getStatusIcon()}
                        </div>
                      </div>
                    </div>
                  </FormControl>

                  {/* Validation message */}
                  {validationState.message && (
                    <div className="text-sm text-red-500 mt-1">
                      {validationState.message}
                      {validationState.suggestion && (
                        <div className="mt-1">
                          <span className="text-gray-600">اقتراح: </span>
                          <button
                            type="button"
                            onClick={applySuggestion}
                            className="text-blue-500 underline hover:text-blue-700"
                          >
                            {validationState.suggestion}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <FormDescription>
                    يرجى استخدام 3-32 حرفًا. يُسمح بالأحرف الإنجليزية والأرقام
                    والشرطات فقط.
                    <br />
                    <span className="text-xs text-gray-500">
                      سيتم تنظيف النص تلقائياً وإزالة الأحرف غير المسموحة
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button
              className="flex items-center gap-x-2"
              disabled={
                mutation.isLoading ||
                validationState.isChecking ||
                validationState.isAvailable === false ||
                !form.formState.isValid
              }
              type="submit"
            >
              {mutation.isLoading ? <LoadingSpinner /> : null}
              تأكيد
            </Button>

            {/* Additional info */}
            <div className="text-xs text-gray-500">
              {watchedSubdomain && (
                <span>المعاينة: {watchedSubdomain}.cravvelo.com</span>
              )}
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default ChangeSubDomainForm;
