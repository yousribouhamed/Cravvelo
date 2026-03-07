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
import { CalendarDays, CreditCard, Package, User, Globe } from "lucide-react";
import { formatCurrency } from "../../payments/utils";
import { useRouter } from "next/navigation";
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
      <div className="p-4 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-md" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
          <Skeleton className="h-10 w-40 rounded-md" />
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24 rounded-md" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-5 w-5 rounded shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-16 rounded-md" />
                    <Skeleton className="h-5 w-24 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 rounded-md" />
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
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
      <div className="w-full min-h-[300px] flex items-center justify-center p-6">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>{t("notFound")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              {error instanceof Error ? error.message : t("notFoundDescription")}
            </p>
            <div className="flex items-center gap-3">
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
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">
            {t("notFound")}
          </h3>
          <p className="text-sm text-gray-500">
            {t("notFoundDescription")}
          </p>
        </div>
      </div>
    );
  }

  const { invoice, purchasedItem, seller, paymentHistory } = data;

  const handlePayInvoice = () => {
    // // Add your payment logic here
    // console.log("Processing payment for invoice:", invoice.id);

    router.push(`/checkout?paymentId=${invoice.Payment.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "PAID":
        return "bg-green-100 text-green-800 border-green-200";
      case "FAILED":
        return "bg-red-100 text-red-800 border-red-200";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
    <div className="  p-4 space-y-4">
      {/* Header with Pay Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-sm text-gray-500">
            {t("invoiceNumber")}: {invoice.id}
          </p>
        </div>
        {invoice.status === "PENDING" && (
          <Button
            onClick={handlePayInvoice}
            size="lg"
            className="w-full sm:w-auto"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {t("payInvoice")} -{" "}
            {formatCurrency({
              amount: invoice.amount,
              currency: invoice.currency as "DZD",
            })}
          </Button>
        )}
      </div>

      {/* Invoice Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {t("summary")}
            <Badge className={getStatusColor(invoice.status)}>
              {translateStatus(invoice.status)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">{t("amount")}</p>
                <p className="text-lg font-semibold">
                  {formatCurrency({
                    amount: invoice.amount,
                    currency: invoice.currency as "DZD",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CalendarDays className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">{t("createdAt")}</p>
                <p className="text-sm">
                  {formatDate(invoice.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Package className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">{t("paymentType")}</p>
                <p className="text-sm">{invoice.Payment.type}</p>
              </div>
            </div>
          </div>
          {invoice.description && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {t("description")}
              </p>
              <p className="text-sm">{invoice.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Purchased Item Details */}
      {purchasedItem && (
        <Card>
          <CardHeader>
            <CardTitle>{t("purchasedItem")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              {purchasedItem.item.logoUrl && (
                <img
                  src={purchasedItem.item.logoUrl}
                  alt={purchasedItem.item.name}
                  className="w-16 h-16 rounded-lg object-cover border"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {purchasedItem.item.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {purchasedItem.item.shortDesc}
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="font-medium">{t("plan")}:</span>{" "}
                    {purchasedItem.planName}
                  </div>
                  <div>
                    <span className="font-medium">{t("category")}:</span>{" "}
                    {purchasedItem.item.category}
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
      <Card>
        <CardHeader>
          <CardTitle>{t("paymentHistory")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                {t("totalAttempts")}
              </p>
              <p className="font-medium">{paymentHistory.totalAttempts}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                {t("paymentMethod")}
              </p>
              <p className="font-medium">
                {paymentHistory.method || t("notSpecified")}
              </p>
            </div>
            {paymentHistory.refundAmount > 0 && (
              <>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {t("refundAmount")}
                  </p>
                  <p className="font-medium">
                    {formatCurrency({
                      amount: invoice.amount,
                      currency: invoice.currency as "DZD",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {t("refundReason")}
                  </p>
                  <p className="font-medium">
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
        <Card>
          <CardHeader>
            <CardTitle>{t("appInstallation")}</CardTitle>
          </CardHeader>
          <CardContent>
            {invoice.Payment.AppInstall.map((install) => (
              <div key={install.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{t("status")}</span>
                  <Badge className={getStatusColor(install.status)}>
                    {translateStatus(install.status)}
                  </Badge>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">{t("installedAt")}:</span>{" "}
                    {formatDate(install.installedAt)}
                  </div>
                  <div>
                    <span className="font-medium">{t("subscriptionAmount")}:</span>{" "}
                    {formatCurrency({
                      amount: invoice.amount,
                      currency: invoice.currency as "DZD",
                    })}
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
