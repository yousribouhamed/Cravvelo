"use client";

import { useState, type FC } from "react";
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
import { Input } from "@ui/components/ui/input";
import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";
import { useTranslations, useLocale } from "next-intl";
import DomainStatus from "@/src/components/domain-status";
import DomainConfiguration from "@/src/components/domain-configuration";
import { useDomainStatus } from "@/src/hooks/use-domain-status";

interface AddCustomDomain {
  customDomain: string | null;
}

const formSchema = z.object({
  cutomedomain: z.string().trim().toLowerCase().refine(
    (value) =>
      value === "" ||
      /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(
        value
      ),
    {
      message: "Please enter a valid domain like yourdomain.com",
    }
  ),
});

function normalizeDomainInput(value: string): string {
  const normalized = value.trim().toLowerCase();
  return normalized.replace(/^https?:\/\//, "").split("/")[0] || "";
}

const AddCustomDomainForm: FC<AddCustomDomain> = ({ customDomain }) => {
  const t = useTranslations("websiteSettings.forms.customDomain");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const mutation = trpc.setCustomDomain.useMutation({
    onSuccess: () => {
      maketoast.success();
    },
    onError: (err) => {
      console.error(err);
      maketoast.error();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cutomedomain: customDomain ? customDomain : "",
    },
  });

  const watchedDomain = form.watch("cutomedomain");
  const normalizedWatchedDomain = normalizeDomainInput(watchedDomain || "");
  const [pinnedDomain, setPinnedDomain] = useState<string | null>(null);
  const isDomainValid =
    normalizedWatchedDomain.length > 0 &&
    /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(
      normalizedWatchedDomain
    );
  const activeDomain = pinnedDomain || (isDomainValid ? normalizedWatchedDomain : "");
  const { status, domainJson, loading } = useDomainStatus({
    domain: activeDomain,
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const normalizedDomain = normalizeDomainInput(data.cutomedomain);
    await mutation.mutateAsync({
      customdomain: normalizedDomain,
    });
    form.setValue("cutomedomain", normalizedDomain);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border border-gray-200 dark:border-gray-700 h-full w-full rounded-xl shadow-none bg-card">
          <CardHeader>
            <CardTitle dir={isRTL ? "rtl" : "ltr"}>{t("title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="cutomedomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel dir={isRTL ? "rtl" : "ltr"}>{t("label")}</FormLabel>
                  <div className="relative flex w-full">
                    <FormControl>
                      <Input
                        placeholder={t("placeholder")}
                        {...field}
                        dir="ltr"
                        className="z-10 flex-1 rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
                      />
                    </FormControl>
                    <div className="absolute left-3 z-10 flex h-full items-center">
                      {isDomainValid && (
                        <DomainStatus
                          domain={normalizedWatchedDomain}
                          status={status}
                          loading={loading}
                          disablePolling
                        />
                      )}
                    </div>
                  </div>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground mt-2" dir={isRTL ? "rtl" : "ltr"}>
                    {t("description")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1" dir={isRTL ? "rtl" : "ltr"}>
                    Supports both apex domains (example.com) and subdomains
                    (academy.example.com).
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!isDomainValid && !pinnedDomain}
                      onClick={() => {
                        if (pinnedDomain) {
                          setPinnedDomain(null);
                          return;
                        }
                        if (isDomainValid) {
                          setPinnedDomain(normalizedWatchedDomain);
                        }
                      }}
                    >
                      {pinnedDomain ? "Unpin DNS instructions" : "Pin DNS instructions"}
                    </Button>
                    {pinnedDomain && (
                      <span className="text-xs text-muted-foreground">
                        Pinned: {pinnedDomain}
                      </span>
                    )}
                  </div>
                </FormItem>
              )}
            />
            {activeDomain && (
              <div dir="ltr" className="w-full min-h-[300px] h-fit">
                <DomainConfiguration
                  domain={activeDomain}
                  status={status}
                  domainJson={domainJson}
                  disablePolling
                />
              </div>
            )}
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

export default AddCustomDomainForm;
