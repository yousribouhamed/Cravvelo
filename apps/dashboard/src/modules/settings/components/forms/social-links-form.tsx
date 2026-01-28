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
  facebookUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
});

interface SocialLinksFormProps {
  facebookUrl: string | null;
  twitterUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
}

const SocialLinksForm: FC<SocialLinksFormProps> = ({
  facebookUrl,
  twitterUrl,
  instagramUrl,
  linkedinUrl,
  youtubeUrl,
}) => {
  const t = useTranslations("websiteSettings.forms.socialLinks");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const mutation = trpc.addSocialLinks.useMutation({
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
      facebookUrl: facebookUrl ?? "",
      twitterUrl: twitterUrl ?? "",
      instagramUrl: instagramUrl ?? "",
      linkedinUrl: linkedinUrl ?? "",
      youtubeUrl: youtubeUrl ?? "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await mutation.mutateAsync({
      facebookUrl: data.facebookUrl,
      twitterUrl: data.twitterUrl,
      instagramUrl: data.instagramUrl,
      linkedinUrl: data.linkedinUrl,
      youtubeUrl: data.youtubeUrl,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border rounded-xl shadow-none">
          <CardHeader>
            <CardTitle dir={isRTL ? "rtl" : "ltr"}>{t("title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="facebookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel dir={isRTL ? "rtl" : "ltr"}>
                    {t("facebookUrl")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      dir="ltr"
                      placeholder="https://facebook.com/yourpage"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="twitterUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel dir={isRTL ? "rtl" : "ltr"}>
                    {t("twitterUrl")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      dir="ltr"
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instagramUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel dir={isRTL ? "rtl" : "ltr"}>
                    {t("instagramUrl")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      dir="ltr"
                      placeholder="https://instagram.com/yourhandle"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel dir={isRTL ? "rtl" : "ltr"}>
                    {t("linkedinUrl")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      dir="ltr"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="youtubeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel dir={isRTL ? "rtl" : "ltr"}>
                    {t("youtubeUrl")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      dir="ltr"
                      placeholder="https://youtube.com/@yourchannel"
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

export default SocialLinksForm;
