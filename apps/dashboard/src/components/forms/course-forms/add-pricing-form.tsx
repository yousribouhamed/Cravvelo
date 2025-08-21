"use client";

import { z } from "@/src/lib/zod-error-map";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { trpc } from "@/src/app/_trpc/client";
import { Button } from "@ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
import { Card, CardContent } from "@ui/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@ui/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { getValueFromUrl } from "@/src/lib/utils";
import { maketoast } from "../../toasts";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { Course, Pricing } from "database";

const PricingFormSchema = z.object({
  pricingType: z.enum(["FREE", "ONE_TIME", "RECURRING"]),
  price: z.string().optional(),
  compareAtPrice: z.string().optional(),
  accessDuration: z.enum(["LIMITED", "UNLIMITED"]).optional(),
  accessDurationDays: z.string().optional(),
  recurringDays: z.string().optional(), // Changed from recurringInterval to recurringDays
  customRecurringDays: z.string().optional(), // New field for custom days
});

interface PricingPlanWithJunction extends Pricing {
  isDefault: boolean;
  junctionId: string;
}

interface AddPricingFormProps {
  course: Course;
  pricingPlans?: PricingPlanWithJunction[];
}

function AddPricingForm({ course, pricingPlans }: AddPricingFormProps) {
  const currentPlan = pricingPlans?.[0]; // Fixed: added optional chaining
  const router = useRouter();
  const path = usePathname();
  const courseId = getValueFromUrl(path, 2);

  const mutation = trpc.priceCourse.useMutation({
    onSuccess: () => {
      maketoast.success();
      router.push(`/courses/${courseId}/students-management`);
    },
    onError: () => {
      maketoast.error();
    },
  });

  // Helper function to determine if recurring days is a custom value
  const getRecurringDaysValue = (days?: number | null) => {
    if (!days) return "30"; // Default to 30 days

    // Check if it matches predefined options
    const predefinedValues = ["7", "30", "90", "365"];
    const daysString = days.toString();

    if (predefinedValues.includes(daysString)) {
      return daysString;
    }

    // If it doesn't match predefined values, it's custom
    return "custom";
  };

  const getCustomRecurringDaysValue = (days?: number | null) => {
    if (!days) return "";

    // Check if it matches predefined options
    const predefinedValues = [7, 30, 90, 365];

    if (predefinedValues.includes(days)) {
      return ""; // Not custom
    }

    // It's a custom value
    return days.toString();
  };

  const form = useForm<z.infer<typeof PricingFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(PricingFormSchema),
    defaultValues: {
      pricingType: currentPlan?.pricingType ?? "ONE_TIME",
      price: currentPlan?.price ? currentPlan.price.toString() : "10",
      accessDuration: currentPlan?.accessDuration ?? "UNLIMITED",
      accessDurationDays: currentPlan?.accessDurationDays
        ? currentPlan.accessDurationDays.toString()
        : "",
      compareAtPrice: currentPlan?.compareAtPrice
        ? currentPlan.compareAtPrice.toString()
        : "",
      recurringDays: getRecurringDaysValue(currentPlan?.recurringDays),
      customRecurringDays: getCustomRecurringDaysValue(
        currentPlan?.recurringDays
      ),
    },
  });

  async function onSubmit(values: z.infer<typeof PricingFormSchema>) {
    // Determine the actual recurring days value
    let actualRecurringDays = undefined;
    if (values.pricingType === "RECURRING") {
      if (values.recurringDays === "custom") {
        actualRecurringDays = Number(values.customRecurringDays || 1);
      } else {
        actualRecurringDays = Number(values.recurringDays || 30);
      }
    }

    await mutation.mutateAsync({
      courseId,
      pricingType: values.pricingType,
      price: values.pricingType === "FREE" ? 0 : Number(values.price || 0),
      compareAtPrice:
        values.pricingType === "FREE" ? 0 : Number(values.compareAtPrice || 0),
      accessDuration:
        values.pricingType === "ONE_TIME" ? values.accessDuration : undefined,
      accessDurationDays:
        values.pricingType === "ONE_TIME" && values.accessDuration === "LIMITED"
          ? Number(values.accessDurationDays || 0)
          : undefined,
      recurringDays: actualRecurringDays, // Changed from recurringInterval
    });
  }

  const pricingType = form.watch("pricingType");
  const accessDuration = form.watch("accessDuration");
  const recurringDays = form.watch("recurringDays");

  // Predefined recurring options in days
  const recurringOptions = [
    { value: "7", label: "أسبوعياً (7 أيام)" },
    { value: "30", label: "شهرياً (30 يوماً)" },
    { value: "90", label: "ربع سنوي (90 يوماً)" },
    { value: "365", label: "سنوياً (365 يوماً)" },
    { value: "custom", label: "مخصص" },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Form Section */}
      <Card>
        <CardContent className="py-4 space-y-6">
          <Form {...form}>
            <form
              id="add-pricing"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Pricing Type Tabs */}
              <FormField
                control={form.control}
                name="pricingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-2 block text-sm font-medium">
                      نوع الخطة
                    </FormLabel>
                    <Tabs
                      value={field.value}
                      onValueChange={field.onChange}
                      className="w-full"
                    >
                      <TabsList className="grid grid-cols-3 ml-auto rounded-xl border">
                        <TabsTrigger value="FREE">مجاني</TabsTrigger>
                        <TabsTrigger value="ONE_TIME">دفعة واحدة</TabsTrigger>
                        <TabsTrigger value="RECURRING">
                          اشتراك متجدد
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Show price fields if not FREE */}
              {pricingType !== "FREE" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>السعر</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="compareAtPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>مقارنة بالسعر</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* ONE_TIME extra fields */}
              {pricingType === "ONE_TIME" && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="accessDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>مدة الوصول</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر المدة" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="LIMITED">محدودة</SelectItem>
                            <SelectItem value="UNLIMITED">
                              غير محدودة
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {accessDuration === "LIMITED" && (
                    <FormField
                      control={form.control}
                      name="accessDurationDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>عدد الأيام</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}

              {/* RECURRING extra fields */}
              {pricingType === "RECURRING" && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="recurringDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>فترة التجديد</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر فترة التجديد" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {recurringOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Custom days input */}
                  {recurringDays === "custom" && (
                    <FormField
                      control={form.control}
                      name="customRecurringDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>عدد الأيام المخصص</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              placeholder="أدخل عدد الأيام"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Save Actions - Now placed under the card */}
      <Card className="flex flex-col sm:flex-row gap-4 ">
        <CardContent className="flex items-center justify-end gap-x-4  h-full pt-4 flex-col lg:flex-row ">
          <Button
            disabled={mutation.isLoading}
            type="submit"
            form="add-pricing"
            className="flex items-center justify-center gap-x-2"
          >
            {mutation.isLoading ? <LoadingSpinner /> : null}
            حفظ والمتابعة
          </Button>
          <Button
            type="button"
            onClick={() => router.back()}
            variant="secondary"
          >
            إلغاء والعودة
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddPricingForm;
