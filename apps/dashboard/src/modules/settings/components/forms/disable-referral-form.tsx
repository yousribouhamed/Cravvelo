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
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@ui/lib/utils";

const formSchema = z.object({
  isEnabled: z.boolean(),
});

interface DisableReferralFormAbdullahProps {
  enabled: boolean;
}

const DisableReferralForm: FC<DisableReferralFormAbdullahProps> = ({
  enabled,
}) => {
  const t = useTranslations("websiteSettings.forms.referral");
  const locale = useLocale();
  const isRTL = locale === "ar";

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
      isEnabled: enabled,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await mutation.mutateAsync({
      enabled: data.isEnabled,
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
            <FormLabel className={cn("text-xl block font-bold text-black", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
              {t("permissions")}
            </FormLabel>
            <FormLabel className={cn("text-md block text-gray-600", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
              {t("permissionsDescription")}
            </FormLabel>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="isEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row bg-white items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel dir={isRTL ? "rtl" : "ltr"}>{t("enableAffiliate")}</FormLabel>
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
              className="w-full  rounded-xl flex items-center gap-x-2 max-w-[200px]"
            >
              {mutation.isLoading ? <LoadingSpinner /> : null}
              {t("saveAndContinue")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DisableReferralForm;
