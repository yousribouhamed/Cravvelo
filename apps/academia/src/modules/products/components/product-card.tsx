"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { InitialAvatar } from "@/components/initial-avatar";
import { useTranslations } from "next-intl";
import { useTenantCurrency } from "@/hooks/use-tenant";
import type { ProductWithDefaultPricing } from "../types";

export default function ProductCard({ product }: { product: ProductWithDefaultPricing }) {
  const t = useTranslations("products");
  const { formatPrice } = useTenantCurrency();

  const defaultPricing = product.ProductPricingPlans?.[0]?.PricingPlan ?? null;
  const isFree =
    defaultPricing?.pricingType === "FREE" ||
    defaultPricing?.price === 0 ||
    (defaultPricing == null && (product.price ?? 0) === 0);

  const currentPrice =
    defaultPricing?.price ?? (product.price != null ? Number(product.price) : 0);
  const originalPrice = defaultPricing?.compareAtPrice ?? undefined;
  const hasDiscount = originalPrice != null && originalPrice > currentPrice;

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div
        className="group w-full min-h-[340px] flex flex-col bg-white dark:bg-[#0A0A0C] border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-xl hover:ring-2 hover:ring-primary/10 overflow-hidden"
        style={{ borderRadius: "var(--academia-card-radius, 1rem)" }}
      >
        <div className="relative overflow-hidden shrink-0">
          {product.thumbnailUrl ? (
            <Image
              alt={product.title}
              src={product.thumbnailUrl}
              width={400}
              height={224}
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center justify-center gap-3">
              <InitialAvatar letter={product.title} size="lg" className="!bg-primary/20 !text-primary dark:!bg-primary/30 dark:!text-white" />
              <Package className="w-10 h-10 text-gray-400 dark:text-gray-600" />
            </div>
          )}

          <div className="absolute top-3 right-3">
            {isFree ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30">
                {t("free")}
              </Badge>
            ) : (
              <Badge variant="outline" className="border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300">
                {t("paid")}
              </Badge>
            )}
          </div>

          {hasDiscount && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-red-500 text-white hover:bg-red-500">
                {t("discount")}{" "}
                {Math.round(((originalPrice! - currentPrice) / originalPrice!) * 100)}%
              </Badge>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-start">
            {product.title}
          </h3>

          {product.subDescription && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 text-start">
              {product.subDescription}
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {isFree ? t("free") : formatPrice(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    {formatPrice(originalPrice!)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

