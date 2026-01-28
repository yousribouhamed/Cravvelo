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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";
import { useTranslations, useLocale } from "next-intl";

const formSchema = z.object({
  googleAnalyticsId: z.string().optional(),
  facebookPixelId: z.string().optional(),
});

interface AnalyticsFormProps {
  googleAnalyticsId: string | null;
  facebookPixelId: string | null;
}

const AnalyticsForm: FC<AnalyticsFormProps> = ({
  googleAnalyticsId,
  facebookPixelId,
}) => {
  const t = useTranslations("websiteSettings.forms.analytics");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const mutation = trpc.addAnalyticsIds.useMutation({
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
      googleAnalyticsId: googleAnalyticsId ?? "",
      facebookPixelId: facebookPixelId ?? "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await mutation.mutateAsync({
      googleAnalyticsId: data.googleAnalyticsId,
      facebookPixelId: data.facebookPixelId,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border border-border rounded-xl shadow-none">
          <CardHeader>
            <CardTitle dir={isRTL ? "rtl" : "ltr"}>{t("title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="googleAnalyticsId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel dir={isRTL ? "rtl" : "ltr"}>
                    {t("googleAnalyticsId")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      dir="ltr"
                      placeholder="G-XXXXXXXXXX"
                    />
                  </FormControl>
                  <FormDescription dir={isRTL ? "rtl" : "ltr"}>
                    {t("googleAnalyticsIdDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="facebookPixelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel dir={isRTL ? "rtl" : "ltr"}>
                    {t("facebookPixelId")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      dir="ltr"
                      placeholder="123456789012345"
                    />
                  </FormControl>
                  <FormDescription dir={isRTL ? "rtl" : "ltr"}>
                    {t("facebookPixelIdDescription")}
                  </FormDescription>
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

export default AnalyticsForm;
