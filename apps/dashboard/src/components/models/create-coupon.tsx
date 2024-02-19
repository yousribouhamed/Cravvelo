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
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
  amount: z.string(),
  duration: z.string(),
});

const CreateCoupon: FC<CreateCouponProps> = ({ refetch }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const mutation = trpc.createCoupon.useMutation({
    onSuccess: async () => {
      await refetch();
      maketoast.success();
    },
    onError: () => {
      maketoast.error();
    },
  });

  async function createCoupon() {
    await mutation.mutateAsync().then(() => {});
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {}

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
          انشاء القسيمة
        </Button>
      </DialogTrigger>
      <DialogContent
        className="w-[900px] h-[600px]  "
        title="انشاء قسيمة جديدة"
      >
        <div className="w-ful grid grid-cols-3 h-[430px]">
          <div className="col-span-1 w-full h-full flex items-center justify-center ">
            <Image
              src="/coupon.png"
              alt="coupon image"
              width={200}
              height={300}
            />
          </div>
          <div className="col-span-2 w-full h-full flex flex-col ">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-2/3 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
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
                              <RadioGroupItem value="all" />
                            </FormControl>
                          </FormItem>

                          <FormItem className="flex justify-end space-x-3 space-y-0">
                            <FormLabel className="font-normal">
                              تخفيض بالقيمة
                            </FormLabel>
                            <FormControl>
                              <RadioGroupItem value="none" />
                            </FormControl>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كمية التخفيض</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          <SelectTrigger>
                            <SelectValue placeholder="Select a verified email to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="m@example.com">
                            m@example.com
                          </SelectItem>
                          <SelectItem value="m@google.com">
                            m@google.com
                          </SelectItem>
                          <SelectItem value="m@support.com">
                            m@support.com
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        You can manage email addresses in your{" "}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>عدد الاشهر</FormLabel>
                      <FormControl>
                        <Input placeholder="shadcn" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </div>
        <DialogFooter className="w-full h-[50px] flex items-center justify-end gap-x-4 px-4 my-4">
          <Button onClick={() => setIsOpen(false)} variant="ghost">
            إلغاء
          </Button>
          <Button
            onClick={createCoupon}
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
