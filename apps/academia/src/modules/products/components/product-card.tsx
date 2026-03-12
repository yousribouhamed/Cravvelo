"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTenantCurrency, useTenantThemeStyles } from "@/hooks/use-tenant";
import type { ProductWithDefaultPricing } from "../types";
import { cn } from "@/lib/utils";

export default function ProductCard({ product }: { product: ProductWithDefaultPricing }) {
  const t = useTranslations("products");
  const { formatPrice } = useTenantCurrency();
  const { productCardStyle } = useTenantThemeStyles();
  const isCompact = productCardStyle === "COMPACT";
  const isMinimal = productCardStyle === "MINIMAL";

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
    <Link href={`/products/${product.id}`} className="block" data-product-card-style={productCardStyle}>
      <div
        className={cn(
          "academia-card group w-full flex bg-card border border-border hover:border-primary/20 transition-all duration-200 hover:shadow-xl hover:ring-2 hover:ring-primary/10 overflow-hidden",
          isMinimal && "flex-row items-center min-h-0 py-3 px-4 gap-4",
          !isMinimal && "flex-col",
          isCompact && "min-h-[260px]",
          !isCompact && !isMinimal && "min-h-[340px]",
        )}
        style={{ borderRadius: "var(--academia-card-radius, 1rem)" }}
      >
        {!isMinimal && (
        <div className="relative overflow-hidden shrink-0">
          {product.thumbnailUrl ? (
            <Image
              alt={product.title}
              src={product.thumbnailUrl}
              width={400}
              height={224}
              className={cn(
                "w-full object-cover group-hover:scale-105 transition-transform duration-200",
                isCompact && "h-40",
                "h-56",
              )}
            />
          ) : (
            <div className="w-full h-56 bg-muted flex items-center justify-center">
              <Package className={cn("text-muted-foreground", isCompact && "w-12 h-12", "w-14 h-14")} aria-hidden />
            </div>
          )}

          <div className="absolute top-3 right-3">
            {isFree ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30">
                {t("free")}
              </Badge>
            ) : (
              <Badge variant="outline" className="border-primary/30 text-primary">
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
        )}

        <div
          className={cn(
            "flex-1 flex flex-col min-w-0",
            isMinimal && "flex-row items-center justify-between gap-4 py-0",
            isCompact && "p-4 space-y-2",
            !isMinimal && !isCompact && "p-6 space-y-4",
          )}
        >
          <div className={cn("flex-1 min-w-0", isMinimal && "flex items-center gap-3")}>
            {isMinimal && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Package className="h-5 w-5" aria-hidden />
              </div>
            )}
            <div className="min-w-0">
              <h3
                className={cn(
                  "font-semibold text-card-foreground leading-snug group-hover:text-primary transition-colors text-start",
                  isMinimal && "text-sm line-clamp-1",
                  isCompact && "text-base line-clamp-2",
                  !isMinimal && !isCompact && "text-lg line-clamp-2",
                )}
              >
                {product.title}
              </h3>
              {product.subDescription && !isMinimal && (
                <p className={cn("text-sm text-muted-foreground text-start", isCompact && "line-clamp-1", !isCompact && "line-clamp-2")}>
                  {product.subDescription}
                </p>
              )}
            </div>
          </div>

          <div className={cn("flex items-center justify-between shrink-0", !isMinimal && "pt-2")}>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className={cn("font-bold text-card-foreground", isMinimal && "text-base", !isMinimal && "text-lg")}>
                  {isFree ? t("free") : formatPrice(currentPrice)}
                </span>
                {hasDiscount && !isMinimal && (
                  <span className="text-sm text-muted-foreground line-through">
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

