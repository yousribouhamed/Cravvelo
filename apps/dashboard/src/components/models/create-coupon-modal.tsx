"use client";

import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
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

interface CreateCouponProps {
  refetch: () => Promise<any>;
}

const FormSchema = z.object({
  type: z.enum(["PERCENTAGE", "VALUE"], {
    required_error: "انت تحتاج الى اختيار نمط تخفيض.",
  }),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "يجب أن يكون سعر صالح",
  }),
  duration: z.string(),
  months: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "يجب أن يكون سعر صالح",
  }),
  usage_limits: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "يجب أن يكون سعر صالح",
  }),
});

const CreateCoupon: FC<CreateCouponProps> = ({ refetch }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      months: "0",
      type: "PERCENTAGE",
    },
  });

  const [isOpen, setIsOpen] = React.useState(false);

  const mutation = trpc.createCoupon.useMutation({
    onSuccess: async () => {
      await refetch();
      maketoast.success();
    },
    onError: () => {
      maketoast.error();
    },
    onSettled: () => {
      setIsOpen(false);
      form.reset();
    },
  });

  const reduce_type = form.watch("type");

  const duration = form.watch("duration");

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await mutation.mutateAsync({
      amount: data.amount,
      duration: data.duration,
      months: data.months,
      type: data.type,
      usage_limits: data.usage_limits,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <DialogTrigger asChild>
        <Button className=" rounded-xl border flex items-center gap-x-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.8575 3.61523V14.0404M14.0701 8.82784H3.6449"
              stroke="white"
              stroke-width="1.04252"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>انشاء القسيمة</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-[900px] h-[600px]  "
        title="انشاء قسيمة جديدة"
      >
        <div className="w-full grid grid-cols-3 h-[430px]">
          <div className="col-span-2 w-full h-full flex flex-col ">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full h-fit min-w-full p-4 space-y-2"
                id="coupon_form"
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3 my-2">
                      <FormLabel className="text-xl font-bold">
                        نمط التخفيض
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2 pr-4"
                        >
                          <FormItem className="flex  justify-end space-x-3 space-y-0">
                            <FormLabel className="font-normal">
                              تخفيض بالنسبة
                            </FormLabel>
                            <FormControl>
                              <RadioGroupItem value="PERCENTAGE" />
                            </FormControl>
                          </FormItem>

                          <FormItem className="flex justify-end space-x-3 space-y-0">
                            <FormLabel className="font-normal">
                              تخفيض بالقيمة
                            </FormLabel>
                            <FormControl>
                              <RadioGroupItem value="VALUE" />
                            </FormControl>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="w-full flex items-center gap-x-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {" "}
                          {reduce_type === "VALUE"
                            ? "كمية التخفيض"
                            : "نسبة التخفيض"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`${
                              reduce_type === "VALUE" ? "0 DZD" : "% 0"
                            } `}
                            {...field}
                            className="  max-w-[200px]"
                          />
                        </FormControl>
                        <FormDescription>
                          سيتم تخفيض هذه القيمة من مبلغ الدورة او المنتج
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
                        <FormLabel>حدود الاستعمال</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={Number(field.value)}
                            onChange={(e) => field.onChange(e.target.value)}
                            placeholder={`0 `}
                            className="  max-w-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          كم مرة تريد استخدام هذه القسيمة؟
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>مدة الفعالية</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger defaultValue={"forever"}>
                            <SelectValue placeholder="مرة واحدة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="forever">الى الابد</SelectItem>
                          <SelectItem value="by_month">محدودة</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        يرجى اختيار الاعدادات التي تناسب احتياجاتكم
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {duration === "by_month" && (
                  <FormField
                    control={form.control}
                    name="months"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>عدد الايام</FormLabel>
                        <FormControl>
                          <Input placeholder="4 اشهر" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </form>
            </Form>
          </div>
          <div className="col-span-1 w-full h-full flex items-center justify-center ">
            <Image
              src="/coupon.png"
              alt="coupon image"
              width={200}
              height={300}
            />
          </div>
        </div>
        <DialogFooter className="w-full h-[50px] flex items-center justify-end gap-x-4 px-4 my-4">
          <Button onClick={() => setIsOpen(false)} variant="ghost">
            إلغاء
          </Button>
          <Button
            form="coupon_form"
            // onClick={createCoupon}
            className=" flex items-center gap-x-2 "
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? <LoadingSpinner /> : null}
            انشاء القسيمة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCoupon;
