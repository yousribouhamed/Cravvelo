"use client";

import BrandButton from "@/components/brand-button";
import { usePaymentIntent } from "@/modules/payments/hooks/use-paymentIntent";
import { productToPaymentProduct } from "@/modules/payments/utils";
import { useTenantCurrency } from "@/hooks/use-tenant";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { getProductDownloadUrl } from "../actions/download";
import Link from "next/link";

export default function ProductBuyCard({
  product,
  isOwned,
}: {
  product: any;
  isOwned: boolean;
}) {
  const t = useTranslations("products.landing");
  const { currency } = useTenantCurrency();

  const { invokePaymentIntent } = usePaymentIntent(
    productToPaymentProduct({ product, tenantCurrency: currency })
  );

  const handleDownload = async () => {
    try {
      const res = await getProductDownloadUrl({ productId: product.id });
      if (!res.success || !res.data?.url) {
        toast.error(t("downloadLinkError"));
        return;
      }
      window.location.href = res.data.url;
    } catch {
      toast.error(t("downloadError"));
    }
  };

  return (
    <div className="w-full bg-card text-card-foreground min-h-0 md:min-h-[320px] h-fit rounded-xl border p-4 flex flex-col gap-y-4 mt-6 md:sticky md:top-[86px]">
      <h3 className="text-lg font-semibold text-right">{t("title")}</h3>

      {isOwned ? (
        <>
          <BrandButton onClick={handleDownload} className="w-full">
            {t("download")}
          </BrandButton>
          <p className="text-xs text-muted-foreground text-right">
            {t("downloadHint")}
          </p>
        </>
      ) : (
        <>
          <BrandButton onClick={invokePaymentIntent} className="w-full">
            {t("buy")}
          </BrandButton>

          <p className="text-xs text-muted-foreground text-right">
            {t("buyHint")}
          </p>

          <Link href={`/login?redirect=/products/${product.id}`}>
            <button className="text-sm underline text-muted-foreground hover:text-foreground text-right w-full">
              {t("alreadyHaveAccount")}
            </button>
          </Link>
        </>
      )}
    </div>
  );
}

