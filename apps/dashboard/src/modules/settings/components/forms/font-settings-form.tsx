"use client";

import type { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { useForm } from "react-hook-form";
import { Button } from "@ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@ui/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";
import { useLocale, useTranslations } from "next-intl";
import type { ThemeCustomization } from "database";
import {
  ARABIC_FONT_OPTIONS,
  DEFAULT_ARABIC_FONT,
  DEFAULT_ENGLISH_FONT,
  ENGLISH_FONT_OPTIONS,
} from "@/src/modules/settings/constants/font-options";

type FontFormValues = {
  englishFontFamily: string;
  arabicFontFamily: string;
};

interface FontSettingsFormProps {
  initialTheme: ThemeCustomization | null | undefined;
}

const FontSettingsForm: FC<FontSettingsFormProps> = ({ initialTheme }) => {
  const t = useTranslations("websiteSettings.forms.fontSettings");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const mutation = trpc.updateWebsiteTheme.useMutation({
    onSuccess: () => {
      maketoast.success();
    },
    onError: () => {
      maketoast.error();
    },
  });

  const form = useForm<FontFormValues>({
    defaultValues: {
      englishFontFamily: initialTheme?.englishFontFamily ?? DEFAULT_ENGLISH_FONT,
      arabicFontFamily: initialTheme?.arabicFontFamily ?? DEFAULT_ARABIC_FONT,
    },
  });

  async function onSubmit(values: FontFormValues) {
    await mutation.mutateAsync(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="border rounded-xl shadow-none w-full">
          <CardHeader>
            <CardTitle dir={isRTL ? "rtl" : "ltr"}>{t("title")}</CardTitle>
            <CardDescription dir={isRTL ? "rtl" : "ltr"}>
              {t("description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="englishFontFamily"
              render={({ field }) => (
                <FormItem>
                  <FormLabel dir={isRTL ? "rtl" : "ltr"}>{t("englishLabel")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("englishPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ENGLISH_FONT_OPTIONS.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="arabicFontFamily"
              render={({ field }) => (
                <FormItem>
                  <FormLabel dir={isRTL ? "rtl" : "ltr"}>{t("arabicLabel")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("arabicPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ARABIC_FONT_OPTIONS.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default FontSettingsForm;
