"use client";

import type { FC } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";
import { CravveloEditor } from "@cravvelo/editor";
import { useTranslations, useLocale } from "next-intl";

const formSchema = z.object({
  refundPolicy: z.any(),
});

interface RefundPolicyFormProps {
  refundPolicy: any;
}

const RefundPolicyForm: FC<RefundPolicyFormProps> = ({ refundPolicy }) => {
  const t = useTranslations("websiteSettings.forms.refundPolicy");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const mutation = trpc.addRefundPolicy.useMutation({
    onSuccess: () => {
      maketoast.success();
    },
    onError: (error) => {
      console.log("Error:", error);
      maketoast.error();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      refundPolicy: refundPolicy ? JSON.parse(refundPolicy as string) : undefined,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await mutation.mutateAsync({
      refundPolicy: data.refundPolicy,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border rounded-xl shadow-none">
          <CardHeader>
            <CardTitle dir={isRTL ? "rtl" : "ltr"}>{t("title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="refundPolicy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel dir={isRTL ? "rtl" : "ltr"}>
                    {t("label")}
                  </FormLabel>
                  <FormControl>
                    <CravveloEditor
                      value={form.getValues("refundPolicy")}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              className="flex items-center gap-x-2"
              disabled={mutation.isLoading}
              type="submit"
            >
              {mutation.isLoading ? <LoadingSpinner /> : null}
              {t("confirm")}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default RefundPolicyForm;
