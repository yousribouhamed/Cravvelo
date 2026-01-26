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
import { Textarea } from "@ui/components/ui/textarea";
import { maketoast } from "@/src/components/toasts";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@ui/lib/utils";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
});

interface AddSeoFormProps {
  title: string | null;
  description: string | null;
}

const AddSeoForm: FC<AddSeoFormProps> = ({ description, title }) => {
  const t = useTranslations("websiteSettings.forms.seo");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const mutation = trpc.addWebSiteSeo.useMutation({
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
      title: title ? title : "",
      description: description ? description : "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await mutation.mutateAsync({
      title: data.title,
      description: data.description,
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel dir={isRTL ? "rtl" : "ltr"}>{t("titleLabel")}</FormLabel>
                  <FormControl>
                    <Input {...field} dir={isRTL ? "rtl" : "ltr"} />
                  </FormControl>
                  <FormDescription dir={isRTL ? "rtl" : "ltr"}>
                    {t("titleDescription")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel dir={isRTL ? "rtl" : "ltr"}>{t("descriptionLabel")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[140px]" dir={isRTL ? "rtl" : "ltr"} />
                  </FormControl>
                  <FormDescription dir={isRTL ? "rtl" : "ltr"}>
                    {t("descriptionDescription")}
                  </FormDescription>
                  <FormMessage />
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

export default AddSeoForm;
