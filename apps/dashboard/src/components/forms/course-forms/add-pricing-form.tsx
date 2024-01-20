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
import { Input } from "@ui/components/ui/input";
import { Card, CardContent } from "@ui/components/ui/card";
import Tiptap from "../../tiptap";
import { usePathname, useRouter } from "next/navigation";
import { getValueFromUrl } from "@/src/lib/utils";
import { Label } from "@ui/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@ui/components/ui/radio-group";

const PricingFormSchema = z.object({
  type: z.enum(["all", "mentions"], {
    required_error: "You need to select a notification type.",
  }),
});

function AddPricingForm() {
  const router = useRouter();
  const path = usePathname();
  const chapterID = getValueFromUrl(path, 4);

  const mutation = trpc.createModule.useMutation({
    onSuccess: () => {},
    onError: () => {},
  });

  const form = useForm<z.infer<typeof PricingFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(PricingFormSchema),
    defaultValues: {
      type: "all",
    },
  });

  async function onSubmit(values: z.infer<typeof PricingFormSchema>) {}

  return (
    <div className="w-full grid grid-cols-3 gap-x-8 ">
      <div className="col-span-2 w-full h-full">
        <Form {...form}>
          <form
            id="add-text"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full "
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3 w-full h-fit">
                  <FormLabel className="text-3xl  block font-bold text-black">
                    {" "}
                    اختر أفضل الأسعار التي تناسب الدورة التدريبية الخاصة بك
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex w-full flex-col space-y-1"
                    >
                      <FormItem className="flex items-center justify-start w-full space-x-3 space-y-0">
                        <FormLabel className="font-normal">
                          جعل هذه الدورة مجانية
                        </FormLabel>
                        <FormControl>
                          <RadioGroupItem value="all" />
                        </FormControl>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormLabel className="font-normal">
                          جعل هذه الدورة مدفوعة الأجر
                        </FormLabel>
                        <FormControl>
                          <RadioGroupItem value="mentions" />
                        </FormControl>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              className="w-full"
              size="lg"
            >
              {" "}
              حفظ والمتابعة
            </Button>
            <Button
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
