"use client";

import { useQuery } from "@tanstack/react-query";
import { getInvoiceDetailById } from "../actions/invoices.actions";
import { Skeleton } from "@ui/components/ui/skeleton";
import { Button } from "@ui/components/ui/button";
import { Badge } from "@ui/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { Separator } from "@ui/components/ui/separator";
import { CalendarDays, CreditCard, Package } from "lucide-react";
import { formatCurrencyCompact } from "../../payments/utils";
import { useRouter } from "next/navigation";

const getPaymentMethodBadgeClass = (method: string | null) => {
  if (!method) return "bg-muted text-muted-foreground border-border";
  switch (method) {
    case "CHARGILY":
      return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30";
    case "BANK_TRANSFER":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
    case "CASH":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
    case "CREDIT_CARD":
      return "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/30";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};
import { ar, enUS } from "date-fns/locale";
import { format } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

interface PageProps {
  invoiceId: string;
}

export const InvoiceDetailsPage = ({ invoiceId }: PageProps) => {
  const router = useRouter();
  const locale = useLocale();
  const dateLocale = locale === "ar" ? ar : enUS;
  const t = useTranslations("invoices.details");
  const tStatus = useTranslations("invoices.status");
  const retryLabel = locale === "ar" ? "إعادة المحاولة" : "Retry";
  const backToInvoicesLabel = locale === "ar" ? "العودة إلى الفواتير" : "Back to invoices";

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["invoice-details", invoiceId],
    queryFn: async () => {
      const res = await getInvoiceDetailById({ invoiceId });
      return res;
    },
    enabled: Boolean(invoiceId),
    retry: 1,
  });

  if (isLoading || isFetching) {
    return (
      <div className="p-4 md:p-6 flex flex-col gap-6 max-w-4xl">
        <Skeleton className="h-4 w-48 rounded-md" />
        <Card className="rounded-xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-6 w-24 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded shrink-0" />
                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <Skeleton className="h-4 w-16 rounded-md" />
                    <Skeleton className="h-5 w-24 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-xl">
          <CardHeader>
            <Skeleton className="h-6 w-32 rounded-md" />
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="h-5 w-48 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-[300px] flex items-center justify-center p-4 md:p-6">
        <Card className="w-full max-w-lg rounded-xl border bg-card">
          <CardHeader>
            <CardTitle className="text-start">{t("notFound")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground text-start">
              {error instanceof Error ? error.message : t("notFoundDescription")}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={() => refetch()}>{retryLabel}</Button>
              <Button variant="secondary" onClick={() => router.push("/settings/invoices")}>
                {backToInvoicesLabel}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data?.invoice) {
    return (
      <div className="w-full min-h-[300px] flex items-center justify-center p-4">
        <div className="text-center">
          <h3 className="text-lg font-medium text-foreground">{t("notFound")}</h3>
          <p className="text-sm text-muted-foreground mt-1">{t("notFoundDescription")}</p>
        </div>
      </div>
    );
  }

  const { invoice, purchasedItem, seller, paymentHistory } = data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
      case "PAID":
      case "COMPLETED":
        return "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30";
      case "FAILED":
        return "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30";
      case "CANCELLED":
        return "bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/30";
      case "REFUNDED":
        return "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30";
      case "PROCESSING":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/30";
    }
  };

  const translateStatus = (status: string): string => {
    const statusKey = status.toUpperCase().toLowerCase();
    const statusMap: Record<string, string> = {
      pending: tStatus("pending"),
      paid: tStatus("paid"),
      failed: tStatus("failed"),
      cancelled: tStatus("cancelled"),
      completed: tStatus("completed"),
      processing: tStatus("processing"),
      refunded: tStatus("refunded"),
    };
    return statusMap[statusKey] || status;
  };

  const formatDate = (dateInput: string | Date | null | undefined) => {
    if (!dateInput) return "-";
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return format(date, "dd MMMM yyyy, HH:mm", { locale: dateLocale });
  };

  return (
    <div className="p-4 md:p-6 flex flex-col gap-6 max-w-4xl">
      {/* Invoice reference (RTL-aware) */}
      <p className="text-sm text-muted-foreground text-start">
        {t("invoiceNumber")}: {invoice.id}
      </p>

      {/* Invoice Summary Card */}
      <Card className="rounded-xl border bg-card">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-lg">{t("summary")}</CardTitle>
            <Badge
              variant="secondary"
              className={`border ${getStatusColor(invoice.status)}`}
            >
              {translateStatus(invoice.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 rtl:flex-row-reverse">
              <CreditCard className="w-5 h-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">{t("amount")}</p>
                <p className="text-lg font-semibold text-foreground truncate">
                  {formatCurrencyCompact({
                    amount: invoice.amount,
                    currency: invoice.currency ?? "DZD",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rtl:flex-row-reverse">
              <CalendarDays className="w-5 h-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">{t("createdAt")}</p>
                <p className="text-sm text-foreground">{formatDate(invoice.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rtl:flex-row-reverse">
              <Package className="w-5 h-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-muted-foreground">{t("paymentType")}</p>
                <Badge
                  variant="secondary"
                  className={`mt-1 border ${getPaymentMethodBadgeClass(invoice.Payment.method)}`}
                >
                  {invoice.Payment.method?.replace("_", " ") ?? invoice.Payment.type}
                </Badge>
              </div>
            </div>
          </div>
          {invoice.description && (
            <div className="pt-2 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground mb-1">{t("description")}</p>
              <p className="text-sm text-foreground">{invoice.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Purchased Item Details */}
      {purchasedItem && (
        <Card className="rounded-xl border bg-card">
          <CardHeader>
            <CardTitle className="text-lg">{t("purchasedItem")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4 rtl:flex-row-reverse">
              {purchasedItem.item.logoUrl && (
                <img
                  src={purchasedItem.item.logoUrl}
                  alt={purchasedItem.item.name}
                  className="w-16 h-16 rounded-lg object-cover border shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-foreground">
                  {purchasedItem.item.name}
                </h3>
                <p className="text-muted-foreground text-sm mt-1 mb-2">
                  {purchasedItem.item.shortDesc}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <div>
                    <span className="font-medium text-foreground">{t("plan")}:</span>{" "}
                    <span className="text-muted-foreground">{purchasedItem.planName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-foreground">{t("category")}:</span>{" "}
                    <span className="text-muted-foreground">{purchasedItem.item.category}</span>
                  </div>
                  {purchasedItem.isRecurring && (
                    <Badge variant="outline">{t("recurringSubscription")}</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card className="rounded-xl border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">{t("paymentHistory")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("totalAttempts")}</p>
              <p className="font-medium text-foreground mt-0.5">{paymentHistory.totalAttempts}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t("paymentMethod")}</p>
              <div className="font-medium mt-0.5">
                {paymentHistory.method ? (
                  <Badge
                    variant="secondary"
                    className={`border ${getPaymentMethodBadgeClass(paymentHistory.method)}`}
                  >
                    {paymentHistory.method.replace("_", " ")}
                  </Badge>
                ) : (
                  <span className="text-foreground">{t("notSpecified")}</span>
                )}
              </div>
            </div>
            {paymentHistory.refundAmount > 0 && (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("refundAmount")}</p>
                  <p className="font-medium text-foreground mt-0.5">
                    {formatCurrencyCompact({
                      amount: invoice.amount,
                      currency: invoice.currency ?? "DZD",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("refundReason")}</p>
                  <p className="font-medium text-foreground mt-0.5">
                    {paymentHistory.refundReason || t("notAvailable")}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* App Installation Details */}
      {invoice.Payment.AppInstall && invoice.Payment.AppInstall.length > 0 && (
        <Card className="rounded-xl border bg-card">
          <CardHeader>
            <CardTitle className="text-lg">{t("appInstallation")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {invoice.Payment.AppInstall.map((install) => (
              <div key={install.id} className="flex flex-col gap-3 rounded-lg border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-foreground">{t("status")}</span>
                  <Badge variant="secondary" className={`border ${getStatusColor(install.status)}`}>
                    {translateStatus(install.status)}
                  </Badge>
                </div>
                <Separator />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="text-start">
                    <span className="font-medium text-foreground">{t("installedAt")}:</span>{" "}
                    <span className="text-muted-foreground">{formatDate(install.installedAt)}</span>
                  </div>
                  <div className="text-start">
                    <span className="font-medium text-foreground">{t("subscriptionAmount")}:</span>{" "}
                    <span className="text-muted-foreground">
                      {formatCurrencyCompact({
                        amount: invoice.amount,
                        currency: invoice.currency ?? "DZD",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
