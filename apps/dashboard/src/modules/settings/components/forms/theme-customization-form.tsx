"use client";

import { useState, type FC } from "react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@ui/components/ui/collapsible";
import { Check, ChevronDown } from "lucide-react";
import Image from "next/image";
import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@ui/lib/utils";
import type { ThemeCustomization } from "database";
import { THEME_PRESETS } from "@/src/modules/settings/constants/theme-presets";

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

const PRESET_KEYS = Array.from(
  new Set(THEME_PRESETS.flatMap((preset) => Object.keys(preset.values)))
);

type TokenDef = { lightKey: string; darkKey: string; labelKey: string };
const DESIGN_TOKEN_GROUPS: { groupLabelKey: string; tokens: TokenDef[] }[] = [
  { groupLabelKey: "groupBaseColors", tokens: [{ lightKey: "backgroundLight", darkKey: "backgroundDark", labelKey: "tokenBackground" }, { lightKey: "foregroundLight", darkKey: "foregroundDark", labelKey: "tokenForeground" }] },
  { groupLabelKey: "groupCard", tokens: [{ lightKey: "cardLight", darkKey: "cardDark", labelKey: "tokenCard" }, { lightKey: "cardForegroundLight", darkKey: "cardForegroundDark", labelKey: "tokenCardForeground" }] },
  { groupLabelKey: "groupPopover", tokens: [{ lightKey: "popoverLight", darkKey: "popoverDark", labelKey: "tokenPopover" }, { lightKey: "popoverForegroundLight", darkKey: "popoverForegroundDark", labelKey: "tokenPopoverForeground" }] },
  { groupLabelKey: "groupPrimary", tokens: [{ lightKey: "primaryLight", darkKey: "primaryDark", labelKey: "tokenPrimary" }, { lightKey: "primaryForegroundLight", darkKey: "primaryForegroundDark", labelKey: "tokenPrimaryForeground" }] },
  { groupLabelKey: "groupSecondary", tokens: [{ lightKey: "secondaryLight", darkKey: "secondaryDark", labelKey: "tokenSecondary" }, { lightKey: "secondaryForegroundLight", darkKey: "secondaryForegroundDark", labelKey: "tokenSecondaryForeground" }] },
  { groupLabelKey: "groupMuted", tokens: [{ lightKey: "mutedLight", darkKey: "mutedDark", labelKey: "tokenMuted" }, { lightKey: "mutedForegroundLight", darkKey: "mutedForegroundDark", labelKey: "tokenMutedForeground" }] },
  { groupLabelKey: "groupAccent", tokens: [{ lightKey: "accentLight", darkKey: "accentDark", labelKey: "tokenAccent" }, { lightKey: "accentForegroundLight", darkKey: "accentForegroundDark", labelKey: "tokenAccentForeground" }] },
  { groupLabelKey: "groupDestructive", tokens: [{ lightKey: "destructiveLight", darkKey: "destructiveDark", labelKey: "tokenDestructive" }] },
  { groupLabelKey: "groupBorderInputRing", tokens: [{ lightKey: "borderLight", darkKey: "borderDark", labelKey: "tokenBorder" }, { lightKey: "inputLight", darkKey: "inputDark", labelKey: "tokenInput" }, { lightKey: "ringLight", darkKey: "ringDark", labelKey: "tokenRing" }] },
  { groupLabelKey: "groupCharts", tokens: [{ lightKey: "chart1Light", darkKey: "chart1Dark", labelKey: "tokenChart1" }, { lightKey: "chart2Light", darkKey: "chart2Dark", labelKey: "tokenChart2" }, { lightKey: "chart3Light", darkKey: "chart3Dark", labelKey: "tokenChart3" }, { lightKey: "chart4Light", darkKey: "chart4Dark", labelKey: "tokenChart4" }, { lightKey: "chart5Light", darkKey: "chart5Dark", labelKey: "tokenChart5" }] },
  { groupLabelKey: "groupSidebar", tokens: [{ lightKey: "sidebarLight", darkKey: "sidebarDark", labelKey: "tokenSidebar" }, { lightKey: "sidebarForegroundLight", darkKey: "sidebarForegroundDark", labelKey: "tokenSidebarForeground" }, { lightKey: "sidebarPrimaryLight", darkKey: "sidebarPrimaryDark", labelKey: "tokenSidebarPrimary" }, { lightKey: "sidebarPrimaryForegroundLight", darkKey: "sidebarPrimaryForegroundDark", labelKey: "tokenSidebarPrimaryForeground" }, { lightKey: "sidebarAccentLight", darkKey: "sidebarAccentDark", labelKey: "tokenSidebarAccent" }, { lightKey: "sidebarAccentForegroundLight", darkKey: "sidebarAccentForegroundDark", labelKey: "tokenSidebarAccentForeground" }, { lightKey: "sidebarBorderLight", darkKey: "sidebarBorderDark", labelKey: "tokenSidebarBorder" }, { lightKey: "sidebarRingLight", darkKey: "sidebarRingDark", labelKey: "tokenSidebarRing" }] },
];

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
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  function applyPreset(presetId: string) {
    const preset = THEME_PRESETS.find((item) => item.id === presetId);
    if (!preset) return;
    PRESET_KEYS.forEach((key) => {
      form.setValue(key, undefined, { shouldDirty: true });
    });
    Object.entries(preset.values).forEach(([key, value]) => {
      form.setValue(key, value, { shouldDirty: true });
    });
    setSelectedPresetId(presetId);
  }

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
          <CardHeader className="pb-2">
            <CardTitle dir={isRTL ? "rtl" : "ltr"} className="text-base">
              {t("presetThemesTitle")}
            </CardTitle>
            <p dir={isRTL ? "rtl" : "ltr"} className="text-sm text-muted-foreground">
              {t("presetThemesDescription")}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {THEME_PRESETS.map((preset) => {
                const selected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset.id)}
                    className={cn(
                      "group flex flex-col overflow-hidden rounded-lg border bg-background text-left transition hover:border-primary/50",
                      selected ? "border-primary ring-2 ring-primary/20" : "border-border"
                    )}
                  >
                    <Image
                      src={preset.thumbnail}
                      alt={t(preset.nameKey)}
                      width={320}
                      height={180}
                      className="h-24 w-full object-cover"
                    />
                    <div className="flex items-center justify-between px-3 py-2">
                      <p className="text-xs font-medium">{t(preset.nameKey)}</p>
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground group-hover:text-primary">
                        {selected ? <Check className="h-3 w-3" /> : null}
                        {t("presetApply")}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

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
              className="max-w-md rounded-xl border p-4 transition-all"
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
          <CardHeader className="pb-2">
            <CardTitle dir={isRTL ? "rtl" : "ltr"} className="text-sm font-medium">
              {t("cardsTitle")} · {t("buttonsTitle")} · {t("navbarTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:grid-cols-5">
            <FormField
              control={form.control}
              name="cardRadius"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className={cn("text-xs", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                    {t("cardRadius")}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={(field.value as string) ?? ""}>
                    <FormControl>
                      <SelectTrigger className="h-8">
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
                <FormItem className="space-y-1">
                  <FormLabel className={cn("text-xs", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                    {t("cardShadow")}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={(field.value as string) ?? ""}>
                    <FormControl>
                      <SelectTrigger className="h-8">
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
            <FormField
              control={form.control}
              name="buttonStyle"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className={cn("text-xs", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                    {t("buttonStyle")}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={(field.value as string) ?? ""}>
                    <FormControl>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder={t("buttonStylePlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DEFAULT">{t("buttonStyleDefault")}</SelectItem>
                      <SelectItem value="PILL">{t("buttonStylePill")}</SelectItem>
                      <SelectItem value="ROUNDED">{t("buttonStyleRounded")}</SelectItem>
                      <SelectItem value="SQUARE">{t("buttonStyleSquare")}</SelectItem>
                      <SelectItem value="THREE_D">{t("buttonStyle3d")}</SelectItem>
                      <SelectItem value="PRESSED">{t("buttonStylePressed")}</SelectItem>
                      <SelectItem value="GLASS">{t("buttonStyleGlass")}</SelectItem>
                      <SelectItem value="BOLD_OUTLINE">{t("buttonStyleBoldOutline")}</SelectItem>
                      <SelectItem value="GRADIENT">{t("buttonStyleGradient")}</SelectItem>
                      <SelectItem value="NEUMORPHIC">{t("buttonStyleNeumorphic")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="navbarStyle"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className={cn("text-xs", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                    {t("navbarStyle")}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={(field.value as string) ?? ""}>
                    <FormControl>
                      <SelectTrigger className="h-8">
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
                <FormItem className="space-y-1">
                  <FormLabel className={cn("text-xs", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                    {t("navbarHeight")}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={(field.value as string) ?? ""}>
                    <FormControl>
                      <SelectTrigger className="h-8">
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

        <Card className="border rounded-xl shadow-none w-full">
          <CardHeader className="pb-2">
            <CardTitle dir={isRTL ? "rtl" : "ltr"} className="text-sm font-medium">
              {t("pageLayoutTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
          </CardContent>
        </Card>

        <Card className="border rounded-xl shadow-none w-full">
          <CardHeader>
            <CardTitle dir={isRTL ? "rtl" : "ltr"} className="text-base">
              {t("designTokensTitle")}
            </CardTitle>
            <p dir={isRTL ? "rtl" : "ltr"} className="text-sm text-muted-foreground">
              {t("designTokensDescription")}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="radius"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn("text-sm", isRTL ? "text-right" : "text-left")} dir={isRTL ? "rtl" : "ltr"}>
                    {t("designTokensRadius")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder={t("designTokensRadiusPlaceholder")}
                      className="font-mono text-sm"
                      {...field}
                      value={(field.value as string) ?? ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {DESIGN_TOKEN_GROUPS.map((group) => (
              <Collapsible key={group.groupLabelKey} defaultOpen={group.groupLabelKey === "groupBaseColors"}>
                <CollapsibleTrigger type="button" className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted/50">
                  {t(group.groupLabelKey)}
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {group.tokens.map((token) => (
                      <div key={token.lightKey} className="space-y-2 rounded-lg border p-3">
                        <p className="text-xs font-medium text-muted-foreground">{t(token.labelKey)}</p>
                        <div className="grid grid-cols-2 gap-2">
                          <FormField
                            control={form.control}
                            name={token.lightKey}
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel className="text-xs">{t("lightMode")}</FormLabel>
                                <div className="flex gap-1">
                                  <FormControl>
                                    <Input type="color" className="h-8 w-10 shrink-0 p-1 cursor-pointer" {...field} value={(field.value as string) ?? "#ffffff"} />
                                  </FormControl>
                                  <Input
                                    type="text"
                                    placeholder="#fff"
                                    className="min-w-0 flex-1 font-mono text-xs"
                                    value={(field.value as string) ?? ""}
                                    onChange={(e) => field.onChange(e.target.value)}
                                  />
                                </div>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={token.darkKey}
                            render={({ field }) => (
                              <FormItem className="space-y-1">
                                <FormLabel className="text-xs">{t("darkMode")}</FormLabel>
                                <div className="flex gap-1">
                                  <FormControl>
                                    <Input type="color" className="h-8 w-10 shrink-0 p-1 cursor-pointer" {...field} value={(field.value as string) ?? "#0a0a0a"} />
                                  </FormControl>
                                  <Input
                                    type="text"
                                    placeholder="#0a0a0a"
                                    className="min-w-0 flex-1 font-mono text-xs"
                                    value={(field.value as string) ?? ""}
                                    onChange={(e) => field.onChange(e.target.value)}
                                  />
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
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
