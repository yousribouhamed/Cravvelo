"use client";

import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@ui/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@ui/components/ui/radio-group";
import { Button } from "@ui/components/ui/button";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { trpc } from "@/src/app/_trpc/client";
import * as React from "react";
import { maketoast } from "../toasts";
import Image from "next/image";
import { Input } from "@ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
import { Card } from "@ui/components/ui/card";
import { Badge } from "@ui/components/ui/badge";
import { Separator } from "@ui/components/ui/separator";
import {
  Plus,
  Percent,
  DollarSign,
  Calendar,
  Users,
  AlertCircle,
} from "lucide-react";

interface CreateCouponProps {
  refetch: () => Promise<any>;
}

const FormSchema = z
  .object({
    type: z.enum(["PERCENTAGE", "VALUE"], {
      required_error: "انت تحتاج الى اختيار نمط تخفيض.",
    }),
    amount: z
      .string()
      .min(1, { message: "المبلغ مطلوب" })
      .regex(/^\d+(\.\d{1,2})?$/, { message: "يجب أن يكون سعر صالح" })
      .refine((val) => parseFloat(val) > 0, {
        message: "المبلغ يجب أن يكون أكبر من صفر",
      }),
    duration: z.string().min(1, { message: "مدة الفعالية مطلوبة" }),
    months: z.string().optional(),
    usage_limits: z
      .string()
      .min(1, { message: "حدود الاستعمال مطلوبة" })
      .regex(/^\d+$/, { message: "يجب أن يكون رقم صحيح" })
      .refine((val) => parseInt(val) > 0, {
        message: "يجب أن يكون أكبر من صفر",
      }),
    code: z
      .string()
      .min(3, { message: "يجب أن يكون الكود 3 أحرف على الأقل" })
      .max(20, { message: "يجب أن يكون الكود 20 حرف على الأكثر" })
      .regex(/^[A-Z0-9]+$/, {
        message: "يجب أن يحتوي الكود على أحرف إنجليزية كبيرة وأرقام فقط",
      }),
  })
  .refine(
    (data) => {
      // Validate percentage doesn't exceed 100%
      if (data.type === "PERCENTAGE") {
        const amount = parseFloat(data.amount);
        return amount <= 100;
      }
      return true;
    },
    {
      message: "النسبة المئوية لا يمكن أن تتجاوز 100%",
      path: ["amount"],
    }
  )
  .refine(
    (data) => {
      // If duration is by_month, months field is required
      if (data.duration === "by_month") {
        return (
          data.months && data.months.trim() !== "" && parseInt(data.months) > 0
        );
      }
      return true;
    },
    {
      message: "عدد الأيام مطلوب عندما تكون المدة محدودة",
      path: ["months"],
    }
  );

const CreateCoupon: FC<CreateCouponProps> = ({ refetch }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      months: "",
      type: "PERCENTAGE",
      amount: "",
      usage_limits: "",
      code: "",
    },
  });

  const [isOpen, setIsOpen] = React.useState(false);

  const mutation = trpc.createCoupon.useMutation({
    onSuccess: async () => {
      await refetch();
      maketoast.success("تم إنشاء القسيمة بنجاح!");
      setIsOpen(false);
      form.reset();
    },
    onError: (error) => {
      maketoast.error(error.message || "حدث خطأ أثناء إنشاء القسيمة");
    },
  });

  const reduceType = form.watch("type");
  const duration = form.watch("duration");
  const amount = form.watch("amount");
  const usageLimits = form.watch("usage_limits");

  // Generate random coupon code
  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setValue("code", result);
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      await mutation.mutateAsync({
        amount: data.amount,
        duration: data.duration,
        months: data.months || "0",
        type: data.type,
        usage_limits: data.usage_limits,
      });
    } catch (error) {
      // Error is handled in mutation onError
    }
  };

  const resetForm = () => {
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus size={18} />
          <span>إنشاء قسيمة</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[1200px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-right">
            إنشاء قسيمة جديدة
          </DialogTitle>
        </DialogHeader>

        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
          {/* Form Section */}
          <div className=" w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
                id="coupon_form"
              >
                {/* Coupon Code Field */}
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold flex items-center gap-2">
                        <Badge variant="outline">كود القسيمة</Badge>
                      </FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            placeholder="SAVE20"
                            {...field}
                            className="font-mono uppercase"
                            onChange={(e) =>
                              field.onChange(e.target.value.toUpperCase())
                            }
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generateCode}
                          className="whitespace-nowrap"
                        >
                          إنشاء تلقائي
                        </Button>
                      </div>
                      <FormDescription>
                        كود فريد للقسيمة (أحرف إنجليزية كبيرة وأرقام فقط)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Discount Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        نمط التخفيض
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-3"
                        >
                          <Card className="p-3 hover:shadow-md transition-shadow">
                            <FormItem className="flex justify-between items-center space-y-0">
                              <div className="flex items-center gap-3">
                                <Percent size={20} className="text-blue-500" />
                                <div>
                                  <FormLabel className="font-medium cursor-pointer">
                                    تخفيض بالنسبة المئوية
                                  </FormLabel>
                                  <p className="text-sm text-gray-500">
                                    خصم نسبة مئوية من السعر
                                  </p>
                                </div>
                              </div>
                              <FormControl>
                                <RadioGroupItem value="PERCENTAGE" />
                              </FormControl>
                            </FormItem>
                          </Card>

                          <Card className="p-3 hover:shadow-md transition-shadow">
                            <FormItem className="flex justify-between items-center space-y-0">
                              <div className="flex items-center gap-3">
                                <DollarSign
                                  size={20}
                                  className="text-green-500"
                                />
                                <div>
                                  <FormLabel className="font-medium cursor-pointer">
                                    تخفيض بالقيمة الثابتة
                                  </FormLabel>
                                  <p className="text-sm text-gray-500">
                                    خصم مبلغ ثابت من السعر
                                  </p>
                                </div>
                              </div>
                              <FormControl>
                                <RadioGroupItem value="VALUE" />
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
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          {reduceType === "VALUE" ? (
                            <>
                              <DollarSign size={16} />
                              كمية التخفيض (دج)
                            </>
                          ) : (
                            <>
                              <Percent size={16} />
                              نسبة التخفيض (%)
                            </>
                          )}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max={
                              reduceType === "PERCENTAGE" ? "100" : undefined
                            }
                            placeholder={reduceType === "VALUE" ? "100" : "20"}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {reduceType === "VALUE"
                            ? "المبلغ المحدد سيتم خصمه من السعر الإجمالي"
                            : "النسبة المئوية للخصم (حتى 100%)"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="usage_limits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Users size={16} />
                          حدود الاستعمال
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
                          العدد الأقصى للمرات التي يمكن استخدام القسيمة فيها
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
                        مدة الفعالية
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر مدة الفعالية" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="forever">
                            صالحة إلى الأبد
                          </SelectItem>
                          <SelectItem value="by_month">
                            محدودة بفترة زمنية
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        حدد كم من الوقت ستبقى القسيمة صالحة للاستخدام
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Months field - only show when duration is by_month */}
                {duration === "by_month" && (
                  <FormField
                    control={form.control}
                    name="months"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>عدد الأيام</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="30"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          عدد الأيام التي ستبقى فيها القسيمة صالحة
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </form>
            </Form>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-end gap-4 pt-4">
          <Button
            type="button"
            onClick={resetForm}
            variant="outline"
            disabled={mutation.isLoading}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            form="coupon_form"
            className="flex items-center gap-2"
            disabled={mutation.isLoading || !form.formState.isValid}
          >
            {mutation.isLoading && <LoadingSpinner />}
            إنشاء القسيمة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCoupon;
