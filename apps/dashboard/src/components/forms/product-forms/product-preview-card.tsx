"use client";

import Image from "next/image";
import { Package, ShoppingBag } from "lucide-react";
import { Badge } from "@ui/components/ui/badge";
import { Avatar, AvatarFallback } from "@ui/components/ui/avatar";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/src/hooks/use-currency";

export interface ProductPreviewCardProduct {
  title: string;
  thumbnailUrl: string | null;
  subDescription: string | null;
  price?: number | null;
  compareAtPrice?: number | null;
  totalSales?: number;
  ProductPricingPlans?: Array<{
    isDefault: boolean;
    PricingPlan: {
      price: number | null;
      compareAtPrice: number | null;
      pricingType: string;
    };
  }>;
  _count?: { Sale: number };
}

interface ProductPreviewCardProps {
  product: ProductPreviewCardProduct;
}

export function ProductPreviewCard({ product }: ProductPreviewCardProps) {
  const t = useTranslations("productForms.publishingForm");
  const { formatPrice } = useCurrency();

  const defaultPricing = product.ProductPricingPlans?.find((p) => p.isDefault)?.PricingPlan;
  const isFree =
    defaultPricing?.pricingType === "FREE" ||
    (defaultPricing?.price ?? 0) === 0 ||
    (defaultPricing == null && (product.price ?? 0) === 0);

  const currentPrice =
    defaultPricing?.price ?? (product.price != null ? Number(product.price) : 0);
  const originalPrice = defaultPricing?.compareAtPrice ?? product.compareAtPrice;
  const hasDiscount = originalPrice != null && originalPrice > currentPrice;
  const salesCount = product._count?.Sale ?? product.totalSales ?? 0;

  const pricingMain = isFree ? t("free") : formatPrice(currentPrice);
  const pricingBadge = isFree ? t("free") : t("paid");

  return (
    <div className="w-full max-w-md">
      <p className="text-xs font-medium text-muted-foreground mb-2">{t("previewOnAcademy")}</p>
      <div className="w-full min-h-[380px] flex flex-col bg-card rounded-2xl border border-border overflow-hidden">
        {/* Thumbnail */}
        <div className="relative overflow-hidden shrink-0 h-56">
          {product.thumbnailUrl ? (
            <Image
              alt={product.title}
              src={product.thumbnailUrl}
              width={400}
              height={224}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex flex-col items-center justify-center gap-3">
              <Avatar className="h-14 w-14 rounded-full bg-primary/20 text-primary">
                <AvatarFallback className="text-lg font-semibold">
                  {product.title?.charAt(0) ?? "?"}
                </AvatarFallback>
              </Avatar>
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
          )}

          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-background/90 text-foreground">
              {pricingBadge}
            </Badge>
          </div>

          {hasDiscount && originalPrice != null && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-destructive text-destructive-foreground">
                {t("discount")}{" "}
                {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 flex-1 flex flex-col">
          <h3 className="font-semibold text-base text-foreground line-clamp-2 leading-snug">
            {product.title}
          </h3>

          {product.subDescription && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.subDescription}
            </p>
          )}

          {salesCount > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <ShoppingBag className="w-4 h-4" />
              <span>
                {salesCount} {t("salesCount")}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-base font-bold text-foreground">{pricingMain}</span>
            <Badge
              variant={isFree ? "default" : "outline"}
              className={
                isFree
                  ? "bg-green-600 hover:bg-green-600 text-white"
                  : "border-primary text-primary"
              }
            >
              {pricingBadge}
            </Badge>
          </div>
          {hasDiscount && originalPrice != null && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
