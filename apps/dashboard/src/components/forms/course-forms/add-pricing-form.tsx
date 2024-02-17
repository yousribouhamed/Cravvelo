"use client";

import * as z from "zod";
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
import { Switch } from "@ui/components/ui/switch";
import { Input } from "@ui/components/ui/input";
import { Card, CardContent } from "@ui/components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import { getValueFromUrl } from "@/src/lib/utils";
import { useState } from "react";
import { maketoast } from "../../toasts";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { Course } from "database";

const PricingFormSchema = z.object({
  price: z.string(),
  compareAtPrice: z.string(),
});

interface AddPricingFormProps {
  course: Course;
}

function AddPricingForm({ course }: AddPricingFormProps) {
  const router = useRouter();
  const path = usePathname();
  const courseId = getValueFromUrl(path, 2);
  const [isFree, setIsFree] = useState(true);
  const mutation = trpc.priceCourse.useMutation({
    onSuccess: () => {
      maketoast.success();
      router.push(`/courses/${courseId}/publishing`);
    },
    onError: () => {
      maketoast.error();
    },
  });

  const form = useForm<z.infer<typeof PricingFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(PricingFormSchema),
    defaultValues: {
      price: course.price.toString(),
      compareAtPrice: course.compareAtPrice.toString(),
    },
  });

  async function onSubmit(values: z.infer<typeof PricingFormSchema>) {
    await mutation.mutateAsync({
      courseId,
      price: Number(values.price),
      compairAtPrice: Number(values.compareAtPrice),
    });
  }

  return (
    <div className="w-full grid grid-cols-3 gap-x-8 ">
      <div className="col-span-2 w-full h-full">
        <Form {...form}>
          <form
            id="add-text"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full "
          >
            <FormLabel className="text-xl  block font-bold text-black">
              {" "}
              اختر أفضل الأسعار التي تناسب الدورة التدريبية الخاصة بك
            </FormLabel>
            <div className="flex flex-row bg-white items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>جعل هذه الدورة مجانية</FormLabel>
              </div>

              <div dir="ltr">
                <Switch
                  checked={isFree}
                  onCheckedChange={(val) => setIsFree(val)}
                />
              </div>
            </div>
            {!isFree ? (
              <>
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>سعر</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0 DZD"
                          disabled={isFree}
                          {...field}
                        />
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
                      <FormLabel>
                        مقارنة بالسعر (هذا السعر سوف يظهم انه مشطب عند عرض
                        المنتج)
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isFree}
                          placeholder="0 DZD"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : null}
          </form>
        </Form>
      </div>
      <div className="col-span-1 w-full h-full ">
        <Card>
          <CardContent className="w-full h-fit flex flex-col p-6  space-y-4">
            <Button
              disabled={mutation.isLoading}
              type="submit"
              form="add-text"
              className="w-full flex items-center gap-x-2"
              size="lg"
            >
              {mutation.isLoading ? <LoadingSpinner /> : null}
              حفظ والمتابعة
            </Button>
            <Button
              type="button"
              onClick={() => router.back()}
              className="w-full"
              variant="secondary"
              size="lg"
            >
              {" "}
              إلغاء والعودة
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AddPricingForm;
