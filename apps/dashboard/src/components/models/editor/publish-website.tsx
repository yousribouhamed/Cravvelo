"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
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
import { useEffect, useRef, useState, type FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@ui/components/ui/dialog";
import { Button } from "@ui/components/ui/button";
import { Textarea } from "@ui/components/ui/textarea";
import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "../../toasts";
import { useLocale, useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
import {
  sanitizeSubdomain,
  validateSubdomain,
} from "@/src/modules/settings/utils/wordsFilter";

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

const FormSchema = z.object({
  title: z.string().min(1),
  description: z
    .string()
    .max(500)
    .optional()
    .or(z.literal("")),
  subdomain: z.string().min(1),
  currency: z.string().min(1),
  language: z.string().min(1),
  timezone: z.string().min(1),
});

type SubdomainStatus = "idle" | "checking" | "available" | "invalid" | "taken";

const PublishWebsite: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subdomainStatus, setSubdomainStatus] =
    useState<SubdomainStatus>("idle");
  const t = useTranslations("createAcademia");
  const tCurrency = useTranslations("websiteSettings.forms.currencySettings");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      currency: "DZD",
      language: "ARABIC",
      timezone: "Africa/Algiers",
    },
  });

  const checkSubdomainMutation = trpc.checkSubdomain.useMutation();

  const currencySettingsMutation = trpc.addCurrencySettings.useMutation();

  const mutation = trpc.createWebSite.useMutation({
    onSuccess: async () => {
      try {
        const { currency, language, timezone } = form.getValues();
        const currencySymbol =
          CURRENCY_SYMBOLS[currency] != null
            ? CURRENCY_SYMBOLS[currency]
            : currency;

        await currencySettingsMutation.mutateAsync({
          currency,
          currencySymbol,
          language,
          timezone,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setIsOpen(false);
        window.location.reload();
      }
    },
    onError: (err) => {
      console.log(err);
      setIsOpen(false);
      maketoast.errorWithText({
        text: t("errors.createFailed"),
      });
    },
  });

  const watchedSubdomain = useWatch({
    control: form.control,
    name: "subdomain",
  });

  const lastValidatedSubdomainRef = useRef<string | null>(null);
  const activeValidationIdRef = useRef(0);

  useEffect(() => {
    if (!watchedSubdomain) {
      setSubdomainStatus("idle");
      form.clearErrors("subdomain");
      return;
    }

    const handle = setTimeout(async () => {
      const cleaned = sanitizeSubdomain(watchedSubdomain);

      if (!cleaned) {
        setSubdomainStatus("idle");
        form.clearErrors("subdomain");
        return;
      }

      const localValidation = validateSubdomain(cleaned);
      if (!localValidation.isValid) {
        setSubdomainStatus("invalid");
        form.setError("subdomain", {
          message: localValidation.message,
        });
        return;
      }

      if (lastValidatedSubdomainRef.current === cleaned) {
        return;
      }
      lastValidatedSubdomainRef.current = cleaned;

      setSubdomainStatus("checking");
      form.clearErrors("subdomain");

      const requestId = ++activeValidationIdRef.current;

      try {
        const result = await checkSubdomainMutation.mutateAsync({
          subdomain: cleaned,
        });

        if (requestId !== activeValidationIdRef.current) {
          return;
        }

        if (!result.isValid) {
          setSubdomainStatus("invalid");
          form.setError("subdomain", {
            message: result.message,
          });
          return;
        }

        setSubdomainStatus("available");
      } catch (error) {
        if (requestId !== activeValidationIdRef.current) {
          return;
        }
        console.error(error);
        setSubdomainStatus("invalid");
        form.setError("subdomain", {
          message: t("errors.createFailed"),
        });
      }
    }, 600);

    return () => clearTimeout(handle);
    // We intentionally only depend on the current input value to avoid
    // triggering this effect from form state updates like setError.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedSubdomain]);

  function onSubmit(values: z.infer<typeof FormSchema>) {
    if (subdomainStatus !== "available") {
      form.setError("subdomain", {
        message:
          form.formState.errors.subdomain?.message ||
          t("fields.subdomainHelper"),
      });
      return;
    }

    mutation.mutate({
      description: values.description ?? "",
      name: values.title,
      subdomain: values.subdomain,
    });
  }
  return (
    <Dialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <DialogTrigger asChild>
        <Button>{t("button")}</Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-lg"
        title={t("dialogTitle")}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <Form {...form}>
          <form
            id="createwebsiteform"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 p-4 w-full"
          >
            <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-8">
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel dir={isRTL ? "rtl" : "ltr"}>
                        {t("fields.titleLabel")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="dark:bg-[#252525]"
                          placeholder={t("fields.titlePlaceholder")}
                          dir={isRTL ? "rtl" : "ltr"}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel dir={isRTL ? "rtl" : "ltr"}>
                        {t("fields.descriptionLabel")}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          className="dark:bg-[#252525] min-h-[100px] h-fit"
                          placeholder={t("fields.descriptionPlaceholder")}
                          dir={isRTL ? "rtl" : "ltr"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="subdomain"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel dir={isRTL ? "rtl" : "ltr"}>
                        {t("fields.subdomainLabel")}
                      </FormLabel>
                      <div className="w-full h-14 border rounded-xl flex items-center p-2 bg-background dark:bg-[#111111]">
                        <Input
                          className="border-none bg-transparent"
                          placeholder={t("fields.subdomainPlaceholder")}
                          dir={isRTL ? "rtl" : "ltr"}
                          {...field}
                        />
                        <div className="w-[150px] h-full flex items-center justify-center bg-muted dark:bg-primary dark:text-primary-foreground rounded-lg">
                          <span>.cravvelo.com</span>
                        </div>
                      </div>
                      <FormDescription dir={isRTL ? "rtl" : "ltr"}>
                        {t("fields.subdomainHelper")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel dir={isRTL ? "rtl" : "ltr"}>
                        {tCurrency("currency")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={tCurrency("currency")}
                            />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel dir={isRTL ? "rtl" : "ltr"}>
                        {tCurrency("language")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={tCurrency("language")}
                            />
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
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel dir={isRTL ? "rtl" : "ltr"}>
                        {tCurrency("timezone")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={tCurrency("timezone")}
                            />
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
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter className="p-4">
          <Button
            form="createwebsiteform"
            className="flex items-center gap-x-2 font-bold rounded-xl"
            disabled={
              mutation.isLoading ||
              checkSubdomainMutation.isLoading ||
              !form.formState.isValid ||
              subdomainStatus !== "available"
            }
            type="submit"
          >
            {mutation.isLoading ? <LoadingSpinner /> : null}
            {mutation.isLoading ? t("actions.submitting") : t("actions.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PublishWebsite;
