"use client";

import type { FC } from "react";
import { Card, CardContent } from "@ui/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@ui/components/ui/form";
import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";
import { Switch } from "@ui/components/ui/switch";

const formSchema = z.object({
  enabled: z.boolean(),
});

interface DisableReferralFormAbdullahProps {
  enabled: boolean;
}

const DisableReferralForm: FC<DisableReferralFormAbdullahProps> = ({
  enabled,
}) => {
  const mutation = trpc.enableReferal.useMutation({
    onSuccess: () => {
      maketoast.success();
    },
    onError: () => {
      maketoast.error();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await mutation.mutateAsync({
      enabled,
    });
  }

  return (
    <>
      <div>
        <Form {...form}>
          <form
            id="add-text"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormLabel className="text-xl  block font-bold text-black">
              الصلاحيات
            </FormLabel>
            <FormLabel className="text-md block  text-gray-600">
              اعطاء صلاحيات معينة للأكاديمية
            </FormLabel>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row bg-white items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>تفعيل نظام التسويق بالعمولة</FormLabel>
                    </div>
                    <FormControl>
                      <div dir="ltr">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>

      <div className="col-span-1 w-full h-full ">
        <Card>
          <CardContent className="w-full h-fit flex flex-col p-6 items-end  space-y-4">
            <Button
              disabled={mutation.isLoading}
              type="submit"
              form="add-text"
              className="w-full flex items-center gap-x-2 max-w-[200px]"
              size="lg"
            >
              {mutation.isLoading ? <LoadingSpinner /> : null}
              حفظ والمتابعة
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DisableReferralForm;
