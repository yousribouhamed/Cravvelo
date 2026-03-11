"use client";

import type { FC } from "react";
import {
  Card,
  CardContent,
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
import { Input } from "@ui/components/ui/input";
import { Badge } from "@ui/components/ui/badge";
import { Separator } from "@ui/components/ui/separator";
import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@ui/lib/utils";
import type { ThemeCustomization } from "database";

const defaultTheme: Record<string, unknown> = {};

function getThemeFromWebsite(theme: unknown): Record<string, unknown> {
  if (theme && typeof theme === "object" && !Array.isArray(theme)) {
    return theme as Record<string, unknown>;
  }
  return {};
}

interface ThemeCustomizationFormProps {
  initialTheme: ThemeCustomization | null | undefined;
}

const PREVIEW_WIDTH: Record<string, string> = {
  narrow: "max-w-sm",
  default: "max-w-md",
  wide: "max-w-xl",
  full: "max-w-none",
};

export const ThemeCustomizationForm: FC<ThemeCustomizationFormProps> = ({
  initialTheme,
}) => {
  const t = useTranslations("websiteSettings.forms.theme");
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

  const form = useForm<Record<string, unknown>>({
    defaultValues: { ...defaultTheme, ...getThemeFromWebsite(initialTheme) },
  });

  const cardRadius = String(form.watch("cardRadius") ?? "lg");
  const cardShadow = String(form.watch("cardShadow") ?? "sm");
  const buttonStyle = String(form.watch("buttonStyle") ?? "DEFAULT");
  const navbarStyle = String(form.watch("navbarStyle") ?? "DEFAULT");
  const navbarHeight = String(form.watch("navbarHeight") ?? "default");
  const pageBgLight = String(form.watch("pageBackgroundLight") ?? "#fafafa");
  const pageBgDark = String(form.watch("pageBackgroundDark") ?? "#0e0e10");
  const contentMaxWidth = String(form.watch("contentMaxWidth") ?? "default");

  async function onSubmit(data: Record<string, unknown>) {
    const payload: Record<string, unknown> = {};
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && v !== null) payload[k] = v;
    });
    await mutation.mutateAsync(payload);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card className="border rounded-xl shadow-none w-full">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <CardTitle dir={isRTL ? "rtl" : "ltr"} className="text-base">
                Theme preview
              </CardTitle>
              <Badge variant="secondary">{t("pageLayoutTitle")}</Badge>
            </div>
            <p dir={isRTL ? "rtl" : "ltr"} className="text-sm text-muted-foreground">
              Change options and review a quick preview before saving.
            </p>
            <div
              className={cn("rounded-xl border p-4 transition-all", PREVIEW_WIDTH[contentMaxWidth] ?? PREVIEW_WIDTH.default)}
              style={{ backgroundColor: pageBgLight }}
            >
              <div
                className={cn(
                  "mb-3 rounded-md border px-3 text-sm",
                  navbarStyle === "MINIMAL" ? "border-transparent" : "border-border",
                  navbarHeight === "compact" ? "py-2" : navbarHeight === "tall" ? "py-4" : "py-3"
                )}
              >
                Navbar ({navbarStyle})
              </div>
              <div
                className={cn(
                  "rounded-md border p-3",
                  cardShadow === "none" ? "" : cardShadow === "sm" ? "shadow-sm" : cardShadow === "md" ? "shadow-md" : "shadow-lg"
                )}
                style={{
                  borderRadius:
                    cardRadius === "none"
                      ? "0"
                      : cardRadius === "sm"
                      ? "0.25rem"
                      : cardRadius === "md"
                      ? "0.5rem"
                      : cardRadius === "xl"
                      ? "1rem"
                      : cardRadius === "2xl"
                      ? "1.5rem"
                      : "0.75rem",
                }}
              >
                <p className="mb-3 text-sm text-muted-foreground">Card preview</p>
                <button
                  type="button"
                  className={cn(
                    "px-3 py-1.5 text-xs text-white",
                    buttonStyle === "SQUARE" ? "rounded-none" : "rounded-md",
                    buttonStyle === "PILL" ? "rounded-full" : ""
                  )}
                  style={{ backgroundColor: "#2563eb" }}
                >
                  Button ({buttonStyle})
                </button>
              </div>
              <div className="mt-2 text-[11px] text-muted-foreground">
                Light: {pageBgLight} | Dark: {pageBgDark}
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="border rounded-xl shadow-none w-full">
          <CardHeader>
            <CardTitle dir={isRTL ? "rtl" : "ltr"} className="text-base">
              {t("cardsTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="cardRadius"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("text-sm", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                    {t("cardRadius")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={(field.value as string) ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("cardRadiusPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sm">{t("presetSm")}</SelectItem>
                      <SelectItem value="md">{t("presetMd")}</SelectItem>
                      <SelectItem value="lg">{t("presetLg")}</SelectItem>
                      <SelectItem value="xl">{t("presetXl")}</SelectItem>
                      <SelectItem value="2xl">{t("preset2xl")}</SelectItem>
                      <SelectItem value="none">{t("presetNone")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cardShadow"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("text-sm", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                    {t("cardShadow")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={(field.value as string) ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("cardShadowPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">{t("presetNone")}</SelectItem>
                      <SelectItem value="sm">{t("presetSm")}</SelectItem>
                      <SelectItem value="md">{t("presetMd")}</SelectItem>
                      <SelectItem value="lg">{t("presetLg")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="border rounded-xl shadow-none w-full">
          <CardHeader>
            <CardTitle dir={isRTL ? "rtl" : "ltr"} className="text-base">
              {t("buttonsTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="buttonStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("text-sm", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                    {t("buttonStyle")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={(field.value as string) ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("buttonStylePlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DEFAULT">{t("buttonStyleDefault")}</SelectItem>
                      <SelectItem value="PILL">{t("buttonStylePill")}</SelectItem>
                      <SelectItem value="ROUNDED">{t("buttonStyleRounded")}</SelectItem>
                      <SelectItem value="SQUARE">{t("buttonStyleSquare")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="border rounded-xl shadow-none w-full">
          <CardHeader>
            <CardTitle dir={isRTL ? "rtl" : "ltr"} className="text-base">
              {t("navbarTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="navbarStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("text-sm", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                    {t("navbarStyle")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={(field.value as string) ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("navbarStylePlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DEFAULT">{t("navbarStyleDefault")}</SelectItem>
                      <SelectItem value="MINIMAL">{t("navbarStyleMinimal")}</SelectItem>
                      <SelectItem value="BLUR">{t("navbarStyleBlur")}</SelectItem>
                      <SelectItem value="CENTERED">{t("navbarStyleCentered")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="navbarHeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("text-sm", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                    {t("navbarHeight")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={(field.value as string) ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("navbarHeightPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="compact">{t("presetCompact")}</SelectItem>
                      <SelectItem value="default">{t("presetDefault")}</SelectItem>
                      <SelectItem value="tall">{t("presetTall")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Separator />

        <Card className="border rounded-xl shadow-none w-full">
          <CardHeader>
            <CardTitle dir={isRTL ? "rtl" : "ltr"} className="text-base">
              {t("pageLayoutTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="pageBackgroundLight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("text-sm", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                    {t("pageBackgroundLight")}
                  </FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        type="color"
                        className="w-12 h-9 p-1 cursor-pointer"
                        {...field}
                      />
                    </FormControl>
                    <Input
                      type="text"
                      placeholder="#fafafa"
                      className="flex-1 font-mono text-sm"
                      value={(field.value as string) ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pageBackgroundDark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("text-sm", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                    {t("pageBackgroundDark")}
                  </FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input
                        type="color"
                        className="w-12 h-9 p-1 cursor-pointer"
                        {...field}
                      />
                    </FormControl>
                    <Input
                      type="text"
                      placeholder="#0e0e10"
                      className="flex-1 font-mono text-sm"
                      value={(field.value as string) ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contentMaxWidth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("text-sm", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                    {t("contentMaxWidth")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={(field.value as string) ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("contentMaxWidthPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="narrow">{t("contentMaxWidthNarrow")}</SelectItem>
                      <SelectItem value="default">{t("presetDefault")}</SelectItem>
                      <SelectItem value="wide">{t("contentMaxWidthWide")}</SelectItem>
                      <SelectItem value="full">{t("contentMaxWidthFull")}</SelectItem>
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

export default ThemeCustomizationForm;
