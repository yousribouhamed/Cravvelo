"use client";

import { Button } from "@/components/ui/button";
import { usePaymentIntent } from "@/modules/payments/hooks/use-paymentIntent";
import {
  isProductFree,
  productToPaymentProduct,
} from "@/modules/payments/utils";
import { useIsAuthenticated, useTenantCurrency } from "@/hooks/use-tenant";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { getProductDownloadUrl } from "../actions/download";
import Link from "next/link";
import { claimFreeItemAccess } from "@/modules/payments/actions/free-access.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductBuyCard({
  product,
  isOwned,
}: {
  product: any;
  isOwned: boolean;
}) {
  const router = useRouter();
  const t = useTranslations("products.landing");
  const { currency } = useTenantCurrency();
  const isAuthenticated = useIsAuthenticated();
  const [isClaimingFree, setIsClaimingFree] = useState(false);
  const paymentProduct = productToPaymentProduct({
    product,
    tenantCurrency: currency,
  });
  const isFree = isProductFree(paymentProduct);

  const { invokePaymentIntent } = usePaymentIntent(paymentProduct);

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

  const handlePrimaryAction = async () => {
    if (!isFree) {
      invokePaymentIntent();
      return;
    }

    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${product.id}`);
      return;
    }

    try {
      setIsClaimingFree(true);
      const result = await claimFreeItemAccess({
        productId: product.id,
        type: "PRODUCT",
      });
      if (!result.success) {
        toast.error(result.message || "Failed to unlock free product");
        return;
      }
      await handleDownload();
    } catch (error) {
      console.error(error);
      toast.error("Failed to unlock free product");
    } finally {
      setIsClaimingFree(false);
    }
  };

  return (
    <div className="w-full bg-card text-card-foreground min-h-0 md:min-h-[320px] h-fit rounded-xl border p-4 flex flex-col gap-y-4 mt-6 md:sticky md:top-[86px]">
      <h3 className="text-lg font-semibold text-right">{t("title")}</h3>

      {isOwned ? (
        <>
          <Button onClick={handleDownload} className="w-full">
            {t("download")}
          </Button>
          <p className="text-xs text-muted-foreground text-right">
            {t("downloadHint")}
          </p>
        </>
      ) : (
        <>
          <Button
            onClick={handlePrimaryAction}
            className="w-full"
            loading={isClaimingFree}
            disabled={isClaimingFree}
          >
            {t("buy")}
          </Button>

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

