"use client";

import { useQuery } from "@tanstack/react-query";
import { CravveloSpinner } from "@/src/components/cravvelo-spinner";
import { getInvoiceDetailById } from "../actions/invoices.actions";
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

interface PageProps {
  invoiceId: string;
}

export const InvoiceDetailsPage = ({ invoiceId }: PageProps) => {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["invoice-details"],
    queryFn: async () => {
      const res = await getInvoiceDetailById({ invoiceId });
      return res;
    },
  });

  console.log("here is the invoice details : ", data);

  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center ">
        <CravveloSpinner />
      </div>
    );
  }

  if (!data?.invoice) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">
            Invoice not found
          </h3>
          <p className="text-sm text-gray-500">
            The requested invoice could not be loaded.
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="  p-4 space-y-4">
      {/* Header with Pay Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice Details</h1>
          <p className="text-sm text-gray-500">Invoice ID: {invoice.id}</p>
        </div>
        {invoice.status === "PENDING" && (
          <Button
            onClick={handlePayInvoice}
            size="lg"
            className="w-full sm:w-auto"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Pay Invoice -{" "}
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
            Invoice Summary
            <Badge className={getStatusColor(invoice.status)}>
              {invoice.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Amount</p>
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
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="text-sm">
                  {formatDate(invoice.createdAt.toISOString())}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Package className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Payment Type
                </p>
                <p className="text-sm">{invoice.Payment.type}</p>
              </div>
            </div>
          </div>
          {invoice.description && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                Description
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
            <CardTitle>Purchased Item</CardTitle>
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
                    <span className="font-medium">Plan:</span>{" "}
                    {purchasedItem.planName}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span>{" "}
                    {purchasedItem.item.category}
                  </div>
                  {purchasedItem.isRecurring && (
                    <Badge variant="outline">Recurring Subscription</Badge>
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
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Attempts
              </p>
              <p className="font-medium">{paymentHistory.totalAttempts}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Payment Method
              </p>
              <p className="font-medium">
                {paymentHistory.method || "Not specified"}
              </p>
            </div>
            {paymentHistory.refundAmount > 0 && (
              <>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Refund Amount
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
                    Refund Reason
                  </p>
                  <p className="font-medium">
                    {paymentHistory.refundReason || "N/A"}
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
            <CardTitle>App Installation</CardTitle>
          </CardHeader>
          <CardContent>
            {invoice.Payment.AppInstall.map((install) => (
              <div key={install.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Status</span>
                  <Badge className={getStatusColor(install.status)}>
                    {install.status}
                  </Badge>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Installed At:</span>{" "}
                    {formatDate(install.installedAt.toISOString())}
                  </div>
                  <div>
                    <span className="font-medium">Subscription Amount:</span>{" "}
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
