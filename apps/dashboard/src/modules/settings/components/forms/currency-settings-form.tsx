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
import { useTranslations, useLocale } from "next-intl";

const formSchema = z.object({
  currency: z.string().min(1),
  language: z.string().min(1),
  timezone: z.string().min(1),
});

/** Currency code -> symbol (we set symbol from selection to avoid conflicts) */
const CURRENCY_SYMBOLS: Record<string, string> = {
  DZD: "د.ج",
  USD: "$",
  EUR: "€",
  GBP: "£",
  SAR: "ر.س",
  AED: "د.إ",
  MAD: "د.م.",
  TND: "د.ت",
  EGP: "£",
};

const currencies = [
  { code: "DZD", name: "Algerian Dinar" },
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "SAR", name: "Saudi Riyal" },
  { code: "AED", name: "UAE Dirham" },
  { code: "MAD", name: "Moroccan Dirham" },
  { code: "TND", name: "Tunisian Dinar" },
  { code: "EGP", name: "Egyptian Pound" },
];

const languages = [
  { code: "ARABIC", name: "العربية" },
  { code: "ENGLISH", name: "English" },
  { code: "FRENCH", name: "Français" },
];

const timezones = [
  { code: "Africa/Algiers", name: "Africa/Algiers (GMT+1)" },
  { code: "Africa/Cairo", name: "Africa/Cairo (GMT+2)" },
  { code: "Africa/Casablanca", name: "Africa/Casablanca (GMT+1)" },
  { code: "Africa/Tunis", name: "Africa/Tunis (GMT+1)" },
  { code: "Asia/Riyadh", name: "Asia/Riyadh (GMT+3)" },
  { code: "Asia/Dubai", name: "Asia/Dubai (GMT+4)" },
  { code: "Europe/London", name: "Europe/London (GMT+0)" },
  { code: "Europe/Paris", name: "Europe/Paris (GMT+1)" },
  { code: "America/New_York", name: "America/New_York (GMT-5)" },
];

interface CurrencySettingsFormProps {
  currency: string | null;
  currencySymbol: string | null;
  language: string | null;
  timezone: string | null;
}

const CurrencySettingsForm: FC<CurrencySettingsFormProps> = ({
  currency,
  currencySymbol,
  language,
  timezone,
}) => {
  const t = useTranslations("websiteSettings.forms.currencySettings");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const mutation = trpc.addCurrencySettings.useMutation({
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
      currency: currency ?? "DZD",
      language: language ?? "ARABIC",
      timezone: timezone ?? "Africa/Algiers",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const currencySymbol = CURRENCY_SYMBOLS[data.currency] ?? data.currency;
    await mutation.mutateAsync({
      currency: data.currency,
      currencySymbol,
      language: data.language,
      timezone: data.timezone,
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
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel dir={isRTL ? "rtl" : "ltr"}>
                    {t("currency")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("currency")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies.map((curr) => (
                        <SelectItem key={curr.code} value={curr.code}>
                          {curr.code} - {curr.name}
                          {CURRENCY_SYMBOLS[curr.code] != null
                            ? ` (${CURRENCY_SYMBOLS[curr.code]})`
                            : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {t("currencySymbolAuto")}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel dir={isRTL ? "rtl" : "ltr"}>
                    {t("language")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("language")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel dir={isRTL ? "rtl" : "ltr"}>
                    {t("timezone")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("timezone")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.code} value={tz.code}>
                          {tz.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default CurrencySettingsForm;
