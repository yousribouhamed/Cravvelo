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
import { Switch } from "@ui/components/ui/switch";
import { useTranslations, useLocale } from "next-intl";
import type { ThemeCustomization } from "database";

const BANNER_STYLES = ["DEFAULT", "MINIMAL", "CENTERED", "ILLUSTRATION_LEFT"] as const;
const CARD_STYLES = ["DEFAULT", "COMPACT", "MINIMAL", "FEATURED"] as const;
const PRODUCT_CARD_STYLES = ["DEFAULT", "COMPACT", "MINIMAL"] as const;
const PLAYER_STYLES = ["DEFAULT", "MINIMAL", "THEATER"] as const;
const AUTH_STYLES = ["DEFAULT", "CENTERED_CARD", "SPLIT"] as const;
const PROFILE_STYLES = ["DEFAULT", "COMPACT", "SIDEBAR_LEFT"] as const;

const formSchema = z.object({
  // Sections
  enableWelcomeBanner: z.boolean(),
  dCoursesHomeScreen: z.boolean(),
  dDigitalProductsHomeScreen: z.boolean(),
  enableTestimonials: z.boolean(),
  enableContactForm: z.boolean(),
  // Component styles
  bannerStyle: z.enum(BANNER_STYLES).optional(),
  courseCardStyle: z.enum(CARD_STYLES).optional(),
  productCardStyle: z.enum(PRODUCT_CARD_STYLES).optional(),
  coursePlayerStyle: z.enum(PLAYER_STYLES).optional(),
  authFormStyle: z.enum(AUTH_STYLES).optional(),
  profileStyle: z.enum(PROFILE_STYLES).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface LayoutPageFormProps {
  website: {
    enableWelcomeBanner: boolean;
    dCoursesHomeScreen: boolean;
    dDigitalProductsHomeScreen: boolean;
    enableSalesBanner: boolean;
    itemsAlignment: boolean;
    enableTestimonials: boolean;
    enableContactForm: boolean;
    themeCustomization?: ThemeCustomization | null;
  };
}

const LayoutPageForm: FC<LayoutPageFormProps> = ({ website }) => {
  const t = useTranslations("websiteSettings.forms.layoutPage");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const theme = (website.themeCustomization ?? {}) as Record<string, unknown>;

  const layoutMutation = trpc.changeLayoutSettings.useMutation({
    onSuccess: () => {},
    onError: () => {
      maketoast.error();
    },
  });
  const themeMutation = trpc.updateWebsiteTheme.useMutation({
    onSuccess: () => {},
    onError: () => {
      maketoast.error();
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enableWelcomeBanner: website.enableWelcomeBanner ?? true,
      dCoursesHomeScreen: website.dCoursesHomeScreen ?? true,
      dDigitalProductsHomeScreen: website.dDigitalProductsHomeScreen ?? false,
      enableTestimonials: website.enableTestimonials ?? true,
      enableContactForm: website.enableContactForm ?? true,
      bannerStyle: (theme.bannerStyle as FormValues["bannerStyle"]) ?? "DEFAULT",
      courseCardStyle: (theme.courseCardStyle as FormValues["courseCardStyle"]) ?? "DEFAULT",
      productCardStyle: (theme.productCardStyle as FormValues["productCardStyle"]) ?? "DEFAULT",
      coursePlayerStyle: (theme.coursePlayerStyle as FormValues["coursePlayerStyle"]) ?? "DEFAULT",
      authFormStyle: (theme.authFormStyle as FormValues["authFormStyle"]) ?? "DEFAULT",
      profileStyle: (theme.profileStyle as FormValues["profileStyle"]) ?? "DEFAULT",
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      await layoutMutation.mutateAsync({
        dCoursesHomeScreen: data.dCoursesHomeScreen,
        dDigitalProductsHomeScreen: data.dDigitalProductsHomeScreen,
        enableSalesBanner: website.enableSalesBanner,
        enableWelcomeBanner: data.enableWelcomeBanner,
        itemsAlignment: website.itemsAlignment,
        enableTestimonials: data.enableTestimonials,
        enableContactForm: data.enableContactForm,
      });
      await themeMutation.mutateAsync({
        bannerStyle: data.bannerStyle,
        courseCardStyle: data.courseCardStyle,
        productCardStyle: data.productCardStyle,
        coursePlayerStyle: data.coursePlayerStyle,
        authFormStyle: data.authFormStyle,
        profileStyle: data.profileStyle,
      });
      maketoast.success();
    } catch {
      // errors handled in mutation onError
    }
  }

  const isPending = layoutMutation.isPending || themeMutation.isPending;

  const styleLabel = (key: string) => {
    const map: Record<string, string> = {
      DEFAULT: t("styleDefault"),
      MINIMAL: t("styleMinimal"),
      CENTERED: t("styleCentered"),
      ILLUSTRATION_LEFT: t("styleIllustrationLeft"),
      COMPACT: t("styleCompact"),
      FEATURED: t("styleFeatured"),
      THEATER: t("styleTheater"),
      CENTERED_CARD: t("styleCenteredCard"),
      SPLIT: t("styleSplit"),
      SIDEBAR_LEFT: t("styleSidebarLeft"),
    };
    return map[key] ?? key;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border rounded-xl shadow-none w-full">
          <CardHeader>
            <CardTitle dir={isRTL ? "rtl" : "ltr"}>{t("title")}</CardTitle>
            <CardDescription dir={isRTL ? "rtl" : "ltr"}>
              {t("description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3" dir={isRTL ? "rtl" : "ltr"}>
                {t("sectionsTitle")}
              </h3>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="enableWelcomeBanner"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg p-3">
                      <FormLabel dir={isRTL ? "rtl" : "ltr"}>{t("showWelcomeBanner")}</FormLabel>
                      <FormControl>
                        <div dir="ltr">
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dCoursesHomeScreen"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg p-3">
                      <FormLabel dir={isRTL ? "rtl" : "ltr"}>{t("showCourses")}</FormLabel>
                      <FormControl>
                        <div dir="ltr">
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dDigitalProductsHomeScreen"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg p-3">
                      <FormLabel dir={isRTL ? "rtl" : "ltr"}>{t("showProducts")}</FormLabel>
                      <FormControl>
                        <div dir="ltr">
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="enableTestimonials"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg p-3">
                      <FormLabel dir={isRTL ? "rtl" : "ltr"}>{t("showTestimonials")}</FormLabel>
                      <FormControl>
                        <div dir="ltr">
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="enableContactForm"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg p-3">
                      <FormLabel dir={isRTL ? "rtl" : "ltr"}>{t("showContactForm")}</FormLabel>
                      <FormControl>
                        <div dir="ltr">
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-3" dir={isRTL ? "rtl" : "ltr"}>
                {t("stylesTitle")}
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="bannerStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel dir={isRTL ? "rtl" : "ltr"}>{t("bannerStyle")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? "DEFAULT"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BANNER_STYLES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {styleLabel(s)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="courseCardStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel dir={isRTL ? "rtl" : "ltr"}>{t("courseCardStyle")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? "DEFAULT"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CARD_STYLES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {styleLabel(s)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productCardStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel dir={isRTL ? "rtl" : "ltr"}>{t("productCardStyle")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? "DEFAULT"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PRODUCT_CARD_STYLES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {styleLabel(s)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coursePlayerStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel dir={isRTL ? "rtl" : "ltr"}>{t("coursePlayerStyle")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? "DEFAULT"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PLAYER_STYLES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {styleLabel(s)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="authFormStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel dir={isRTL ? "rtl" : "ltr"}>{t("authFormStyle")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? "DEFAULT"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {AUTH_STYLES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {styleLabel(s)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profileStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel dir={isRTL ? "rtl" : "ltr"}>{t("profileStyle")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? "DEFAULT"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROFILE_STYLES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {styleLabel(s)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="flex items-center gap-x-2"
              disabled={isPending}
              type="submit"
            >
              {isPending ? <LoadingSpinner /> : null}
              {t("confirm")}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default LayoutPageForm;
