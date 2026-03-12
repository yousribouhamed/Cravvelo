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
} from "@ui/components/ui/form";

import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";
import { Switch } from "@ui/components/ui/switch";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@ui/lib/utils";

interface DisableSalesFormProps {
  dCoursesHomeScreen: boolean;
  dDigitalProductsHomeScreen: boolean;
  itemsAlignment: boolean;
  enableSalesBanner: boolean;
  enableWelcomeBanner: boolean;
}

const formSchema = z.object({
  dCoursesHomeScreen: z.boolean(),
  dDigitalProductsHomeScreen: z.boolean(),
  itemsAlignment: z.boolean(),
  enableSalesBanner: z.boolean(),
  enableWelcomeBanner: z.boolean(),
});

const WebsiteLayoutForm: FC<DisableSalesFormProps> = ({
  dCoursesHomeScreen,
  dDigitalProductsHomeScreen,
  enableSalesBanner,
  enableWelcomeBanner,
  itemsAlignment,
}) => {
  const t = useTranslations("websiteSettings.forms.layout");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const mutation = trpc.changeLayoutSettings.useMutation({
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
      dCoursesHomeScreen,
      dDigitalProductsHomeScreen,
      enableSalesBanner,
      enableWelcomeBanner,
      itemsAlignment,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await mutation.mutateAsync({
      dCoursesHomeScreen: data.dCoursesHomeScreen,
      dDigitalProductsHomeScreen: data.dDigitalProductsHomeScreen,
      enableSalesBanner: data.enableSalesBanner,
      enableWelcomeBanner: data.enableWelcomeBanner,
      itemsAlignment: data.itemsAlignment,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border rounded-xl shadow-none w-full h-full">
          <CardHeader>
            <CardTitle dir={isRTL ? "rtl" : "ltr"}>{t("title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="dCoursesHomeScreen"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg  p-3 ">
                  <div className="space-y-0.5">
                    <FormLabel dir={isRTL ? "rtl" : "ltr"}>{t("showCourses")}</FormLabel>
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
            <FormField
              control={form.control}
              name="dDigitalProductsHomeScreen"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg  p-3 ">
                  <div className="space-y-0.5">
                    <FormLabel dir={isRTL ? "rtl" : "ltr"}>
                      {t("showProducts")}
                    </FormLabel>
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
            <FormField
              control={form.control}
              name="enableSalesBanner"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg  p-3">
                  <div className="space-y-0.5">
                    <FormLabel dir={isRTL ? "rtl" : "ltr"}>{t("showSalesBanner")}</FormLabel>
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
            <FormField
              control={form.control}
              name="enableWelcomeBanner"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg  p-3">
                  <div className="space-y-0.5">
                    <FormLabel dir={isRTL ? "rtl" : "ltr"}>{t("showWelcomeBanner")}</FormLabel>
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
            <FormField
              control={form.control}
              name="itemsAlignment"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg  p-3">
                  <div className="space-y-0.5">
                    <FormLabel dir={isRTL ? "rtl" : "ltr"}>{t("centerLayout")}</FormLabel>
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
          </CardContent>
          <CardFooter>
            <Button
              className=" flex items-center gap-x-2"
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

export default WebsiteLayoutForm;
