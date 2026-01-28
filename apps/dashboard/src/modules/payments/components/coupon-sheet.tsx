"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Coupon } from "database";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@ui/components/ui/sheet";
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
import { Button } from "@ui/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@ui/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
import { Card } from "@ui/components/ui/card";
import { Separator } from "@ui/components/ui/separator";
import { Switch } from "@ui/components/ui/switch";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { trpc } from "@/src/app/_trpc/client";
import { maketoast } from "@/src/components/toasts";
import { Percent, DollarSign, Calendar, Users } from "lucide-react";

const couponFormSchema = z
  .object({
    code: z
      .string()
      .min(3, { message: "Code must be at least 3 characters" })
      .max(20, { message: "Code must be at most 20 characters" })
      .regex(/^[A-Z0-9]+$/, {
        message: "Code must contain only uppercase letters and numbers",
      }),
    discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
    discountAmount: z
      .string()
      .min(1, { message: "Amount is required" })
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Amount must be greater than zero",
      }),
    duration: z.enum(["forever", "limited"]),
    numberOfDays: z.string().optional(),
    usageLimit: z
      .string()
      .min(1, { message: "Usage limit is required" })
      .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
        message: "Usage limit must be greater than zero",
      }),
    isActive: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (data.discountType === "PERCENTAGE") {
        const amount = parseFloat(data.discountAmount);
        return amount <= 100;
      }
      return true;
    },
    {
      message: "Percentage cannot exceed 100%",
      path: ["discountAmount"],
    }
  )
  .refine(
    (data) => {
      if (data.duration === "limited") {
        return (
          data.numberOfDays &&
          data.numberOfDays.trim() !== "" &&
          parseInt(data.numberOfDays) > 0
        );
      }
      return true;
    },
    {
      message: "Number of days is required when duration is limited",
      path: ["numberOfDays"],
    }
  );

type CouponFormValues = z.infer<typeof couponFormSchema>;

interface CouponSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon?: Coupon | null;
  onSuccess?: () => void;
}

export function CouponSheet({
  open,
  onOpenChange,
  coupon,
  onSuccess,
}: CouponSheetProps) {
  const t = useTranslations("coupons");
  const isEditing = !!coupon;

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
      discountType: "PERCENTAGE",
      discountAmount: "",
      duration: "forever",
      numberOfDays: "",
      usageLimit: "",
      isActive: true,
    },
  });

  // Reset form when coupon changes or sheet opens
  React.useEffect(() => {
    if (open) {
      if (coupon) {
        // Convert expirationDate to Date object if it's a string
        const expDate = typeof coupon.expirationDate === 'string' 
          ? new Date(coupon.expirationDate) 
          : coupon.expirationDate;
        
        // Calculate if this is a "forever" or "limited" coupon
        const isForever = expDate.getFullYear() >= 2999;

        form.reset({
          code: coupon.code,
          discountType: coupon.discountType,
          discountAmount: coupon.discountAmount.toString(),
          duration: isForever ? "forever" : "limited",
          numberOfDays: isForever
            ? ""
            : Math.ceil(
                (expDate.getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              ).toString(),
          usageLimit: coupon.usageLimit?.toString() || "",
          isActive: coupon.isActive,
        });
      } else {
        form.reset({
          code: "",
          discountType: "PERCENTAGE",
          discountAmount: "",
          duration: "forever",
          numberOfDays: "",
          usageLimit: "",
          isActive: true,
        });
      }
    }
  }, [open, coupon, form]);

  const createMutation = trpc.createCoupon.useMutation({
    onSuccess: () => {
      maketoast.success(t("messages.created"));
      onOpenChange(false);
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      maketoast.error(error.message || t("messages.createError"));
    },
  });

  const updateMutation = trpc.updateCoupon.useMutation({
    onSuccess: () => {
      maketoast.success(t("messages.updated"));
      onOpenChange(false);
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      maketoast.error(error.message || t("messages.updateError"));
    },
  });

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  const discountType = form.watch("discountType");
  const duration = form.watch("duration");

  // Generate random coupon code
  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setValue("code", result);
  };

  const onSubmit = async (data: CouponFormValues) => {
    // Calculate expiration date
    let expirationDate: Date;
    if (data.duration === "forever") {
      expirationDate = new Date(3000, 0, 1);
    } else {
      const days = parseInt(data.numberOfDays || "30");
      expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + days);
    }

    const payload = {
      code: data.code.toUpperCase(),
      discountType: data.discountType,
      discountAmount: parseFloat(data.discountAmount),
      expirationDate,
      usageLimit: parseInt(data.usageLimit),
      isActive: data.isActive,
    };

    if (isEditing && coupon) {
      await updateMutation.mutateAsync({
        id: coupon.id,
        ...payload,
      });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-y-auto p-6">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? t("editCoupon") : t("createCoupon")}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? t("form.editDescription") || "Update the coupon details below"
              : t("form.createDescription") ||
                "Fill in the details to create a new coupon"}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-6"
          >
            {/* Coupon Code */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.code")}</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder={t("form.codePlaceholder")}
                        {...field}
                        className="font-mono uppercase"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                        disabled={isEditing}
                      />
                    </FormControl>
                    {!isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateCode}
                      >
                        {t("form.generateCode")}
                      </Button>
                    )}
                  </div>
                  <FormDescription>{t("form.codeDescription")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            {/* Discount Type */}
            <FormField
              control={form.control}
              name="discountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.discountType")}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-3"
                    >
                      <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                        <FormItem className="flex justify-between items-center space-y-0">
                          <div className="flex items-center gap-3">
                            <Percent size={20} className="text-blue-500" />
                            <div>
                              <FormLabel className="font-medium cursor-pointer">
                                {t("form.percentageDiscount")}
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                {t("form.percentageDescription")}
                              </p>
                            </div>
                          </div>
                          <FormControl>
                            <RadioGroupItem value="PERCENTAGE" />
                          </FormControl>
                        </FormItem>
                      </Card>

                      <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                        <FormItem className="flex justify-between items-center space-y-0">
                          <div className="flex items-center gap-3">
                            <DollarSign size={20} className="text-green-500" />
                            <div>
                              <FormLabel className="font-medium cursor-pointer">
                                {t("form.fixedDiscount")}
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                {t("form.fixedDescription")}
                              </p>
                            </div>
                          </div>
                          <FormControl>
                            <RadioGroupItem value="FIXED_AMOUNT" />
                          </FormControl>
                        </FormItem>
                      </Card>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount and Usage Limits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="discountAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      {discountType === "FIXED_AMOUNT" ? (
                        <>
                          <DollarSign size={16} />
                          {t("form.discountAmount")}
                        </>
                      ) : (
                        <>
                          <Percent size={16} />
                          {t("form.discountAmount")} (%)
                        </>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max={discountType === "PERCENTAGE" ? "100" : undefined}
                        placeholder={
                          discountType === "FIXED_AMOUNT" ? "100" : "20"
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {discountType === "FIXED_AMOUNT"
                        ? t("form.discountAmountDescription")
                        : t("form.discountPercentageDescription")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usageLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users size={16} />
                      {t("form.usageLimit")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="100"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("form.usageLimitDescription")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Duration */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar size={16} />
                    {t("form.duration")}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("form.durationPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="forever">{t("form.forever")}</SelectItem>
                      <SelectItem value="limited">
                        {t("form.limitedTime")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Number of Days - only shown when duration is limited */}
            {duration === "limited" && (
              <FormField
                control={form.control}
                name="numberOfDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.numberOfDays")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="30"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("form.numberOfDaysDescription")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Active Status */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t("form.isActive")}
                    </FormLabel>
                    <FormDescription>
                      {field.value
                        ? t("status.active")
                        : t("status.inactive")}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <SheetFooter className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {t("cancel") || "Cancel"}
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !form.formState.isValid}
              >
                {isLoading && <LoadingSpinner className="mr-2" />}
                {isEditing ? t("editCoupon") : t("createCoupon")}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
