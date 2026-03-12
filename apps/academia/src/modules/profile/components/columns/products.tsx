"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useMemo } from "react";
import {
  Package,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  RotateCcw,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { getProductDownloadUrl } from "@/modules/products/actions/download";

export type ProductSale = {
  id: string;
  orderNumber: number;
  amount: number;
  status: string;
  createdAt: Date;
  Product: {
    id: string;
    title: string;
    thumbnailUrl: string | null;
  } | null;
};

type StatusConfig = {
  variant: "default" | "secondary" | "destructive" | "outline";
  icon: React.ComponentType<{ className?: string }>;
};

export function useProductColumns(): ColumnDef<ProductSale>[] {
  const t = useTranslations("profile.products");
  const tLanding = useTranslations("products.landing");
  const locale = useLocale();
  const dateLocale = locale === "ar" ? "ar-DZ" : "en-US";

  return useMemo(() => {
    const statusVariantMap: Record<string, StatusConfig> = {
      CREATED: { variant: "secondary", icon: Clock },
      PROCESSING: { variant: "secondary", icon: Clock },
      COMPLETED: { variant: "default", icon: CheckCircle },
      CANCELLED: { variant: "destructive", icon: XCircle },
      REFUNDED: { variant: "outline", icon: RotateCcw },
    };

    const getStatusLabel = (status: string) => {
      if (!status) return status;
      try {
        return (t as (key: string) => string)(`status.${status}`) || status;
      } catch {
        return status;
      }
    };

    const handleDownload = async (productId: string) => {
      try {
        const res = await getProductDownloadUrl({ productId });
        if (!res.success || !res.data?.url) {
          toast.error(tLanding("downloadLinkError"));
          return;
        }
        window.location.href = res.data.url;
      } catch {
        toast.error(tLanding("downloadError"));
      }
    };

    return [
      {
        accessorKey: "Product.title",
        header: () => (
          <div className="flex items-center gap-2 font-semibold">
            <Package className="h-4 w-4" />
            {t("columns.productName")}
          </div>
        ),
        cell: ({ row }) => {
          const product = row.original.Product;
          const thumbnailUrl = product?.thumbnailUrl;

          if (!product) {
            return (
              <span className="text-gray-400 text-sm">
                {t("productNotFound")}
              </span>
            );
          }

          return (
            <div className="flex items-center gap-3">
              {thumbnailUrl && (
                <div className="relative h-12 w-12 rounded-lg overflow-hidden border shrink-0">
                  <Image
                    src={thumbnailUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {product.title}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "amount",
        header: () => (
          <div className="font-semibold">{t("columns.amount")}</div>
        ),
        cell: ({ row }) => {
          const amount = row.getValue("amount") as number;
          const formatted = new Intl.NumberFormat(dateLocale).format(amount);
          return (
            <span className="font-medium">
              {formatted} {t("currency")}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: () => (
          <div className="font-semibold">{t("columns.status")}</div>
        ),
        cell: ({ row }) => {
          const status = String(row.original.status ?? "");
          const config =
            statusVariantMap[status] ||
            ({ variant: "outline" as const, icon: Clock });
          const Icon = config.icon;
          const label = getStatusLabel(status);

          return (
            <Badge
              variant={config.variant}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium w-fit"
            >
              <Icon className="h-3 w-3" />
              {label}
            </Badge>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: () => (
          <div className="flex items-center gap-2 font-semibold">
            <Calendar className="h-4 w-4" />
            {t("columns.purchaseDate")}
          </div>
        ),
        cell: ({ row }) => {
          const date = row.getValue("createdAt") as Date;
          return (
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {new Date(date).toLocaleDateString(dateLocale, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(date).toLocaleDateString(dateLocale, {
                  weekday: "short",
                })}
              </span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => (
          <div className="font-semibold">{t("columns.actions")}</div>
        ),
        cell: ({ row }) => {
          const productId = row.original.Product?.id;
          const status = row.original.status;
          if (!productId) return <span className="text-gray-400 text-sm">—</span>;

          return (
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => handleDownload(productId)}
              disabled={status !== "COMPLETED"}
            >
              <Download className="h-3.5 w-3.5" />
              {t("actions.download")}
            </Button>
          );
        },
      },
    ] satisfies ColumnDef<ProductSale>[];
  }, [dateLocale, t, tLanding]);
}
