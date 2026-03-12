"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Lock, AlertCircle } from "lucide-react";
import { PaymentSheetSkeleton } from "./payment-skeleton";
import { PaymentMethodCards } from "./payment-method-cards";
import { PaymentForms } from "./payment-forms";
import { usePaymentContext } from "../context/payments-provider";
import {
  PaymentProduct,
  PaymentPricingOption,
} from "@/modules/payments/types/index";
import React from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useTenantCurrency, useIsAuthenticated } from "@/hooks/use-tenant";
import { useMediaQuery } from "@/hooks/use-media-query";
import { GuestAuthForm } from "./guest-auth-form";

export function PaymentSheet() {
  const {
    isSheetOpen,
    setSheetOpen,
    selectedProduct,
    activeConnections,
    isConnectionsLoading,
  } = usePaymentContext();
  const t = useTranslations("payments");
  const { formatPrice } = useTenantCurrency();
  const isAuthenticated = useIsAuthenticated();
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const isRTL = locale === "ar";
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const sheetSide = isDesktop ? "left" : "bottom";

  const getCurrentPrice = (product: PaymentProduct | null): number => {
    if (!product) return 0;

    // If product has pricing options and a selected pricing ID
    if (product.pricingOptions && product.selectedPricingId) {
      const selectedPricing = product.pricingOptions.find(
        (option) => option.id === product.selectedPricingId
      );
      return selectedPricing?.price || 0;
    }

    // Fall back to the main price
    return product.price || 0;
  };

  // Get selected pricing option details
  const getSelectedPricingOption = (
    product: PaymentProduct | null
  ): PaymentPricingOption | null => {
    if (!product || !product.pricingOptions || !product.selectedPricingId) {
      return null;
    }

    return (
      product.pricingOptions.find(
        (option) => option.id === product.selectedPricingId
      ) || null
    );
  };

  const currentPrice = getCurrentPrice(selectedProduct);
  const selectedPricing = getSelectedPricingOption(selectedProduct);

  // Prevent sheet from opening if no product is selected
  const handleSheetOpenChange = (open: boolean) => {
    if (open && !selectedProduct) {
      console.warn("Cannot open payment sheet: No product selected");
      return;
    }
    setSheetOpen(open);
  };

  // Close sheet if product becomes null while sheet is open
  React.useEffect(() => {
    if (isSheetOpen && !selectedProduct) {
      setSheetOpen(false);
    }
  }, [selectedProduct, isSheetOpen, setSheetOpen]);

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
      <SheetContent side={sheetSide} dir={dir}>
        {isConnectionsLoading ? (
          <PaymentSheetSkeleton />
        ) : !selectedProduct ? (
          // Show error state if no product selected (fallback)
          <div className="h-full flex items-center justify-center" dir={dir}>
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t("noProductSelected")}
                </h3>
                <p className="text-muted-foreground">
                  {t("noProductMessage")}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col" dir={dir}>
            <SheetHeader
              className={`pb-6 shrink-0 ${isRTL ? "text-right" : "text-left"}`}
            >
              <SheetTitle className="text-2xl font-bold text-foreground">
                {t("title")}
              </SheetTitle>
              <SheetDescription className="text-muted-foreground">
                {t("description")}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-4">
                  {/* Two Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Summary - right in LTR, left in RTL (via order) */}
                    <div
                      className={`lg:sticky lg:top-0 ${isRTL ? "lg:order-1" : "lg:order-2"}`}
                    >
                      <div dir={dir} className="space-y-4">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-foreground">
                            {t("summary")}
                          </h3>
                          <div className="bg-muted/50 rounded-lg p-4 border my-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-primary/15 rounded-lg flex items-center justify-center shrink-0 border border-border">
                                {selectedProduct.image ? (
                                  <Image
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover rounded-lg"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-primary/20 rounded" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-foreground mb-1">
                                  {selectedProduct.name}
                                </h4>

                                {/* Show selected pricing option if available */}
                                {selectedPricing && (
                                  <div className="mb-2">
                                    <span className="text-xs text-muted-foreground">
                                      {selectedPricing.name}
                                    </span>
                                    {selectedPricing.description && (
                                      <p className="text-xs text-muted-foreground">
                                        {selectedPricing.description}
                                      </p>
                                    )}
                                  </div>
                                )}

                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-primary">
                                    {currentPrice > 0
                                      ? formatPrice(currentPrice)
                                      : t("free")}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    1 ×
                                  </span>
                                </div>

                                {/* Show compare at price if available */}
                                {selectedPricing?.compareAtPrice &&
                                  selectedPricing.compareAtPrice >
                                    currentPrice && (
                                    <div className="mt-1">
                                      <span className="text-sm text-muted-foreground line-through">
                                        {formatPrice(selectedPricing.compareAtPrice)}
                                      </span>
                                    </div>
                                  )}
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-border">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-foreground">
                                  {t("total")}
                                </span>
                                <span className="text-xl font-bold text-primary">
                                  {currentPrice > 0
                                    ? formatPrice(currentPrice)
                                    : t("free")}
                                </span>
                              </div>
                            </div>

                            {/* Show access duration info if available */}
                            {selectedPricing && (
                              <div className="mt-3 pt-3 border-t border-border">
                                <div className="text-xs text-muted-foreground text-center">
                                  {selectedPricing.accessDuration ===
                                    "UNLIMITED" && t("unlimitedAccess")}
                                  {selectedPricing.accessDuration ===
                                    "LIMITED" &&
                                    selectedPricing.accessDurationDays != null &&
                                    selectedPricing.accessDurationDays > 0 &&
                                    t("limitedAccess", {
                                      days: selectedPricing.accessDurationDays,
                                    })}
                                  {selectedPricing.pricingType ===
                                    "RECURRING" &&
                                    selectedPricing.recurringDays &&
                                    selectedPricing.recurringDays > 0 &&
                                    ` • ${t("recurringAccess", {
                                      days: selectedPricing.recurringDays,
                                    })}`}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Security Notice - only show for paid products */}
                        {currentPrice > 0 && (
                          <div className="bg-muted/50 rounded-lg p-4 border">
                            <div className="flex items-start gap-3">
                              <div
                                className={`text-sm text-muted-foreground flex-1 ${isRTL ? "text-right" : "text-left"}`}
                              >
                                <div className="font-medium mb-1 text-foreground">
                                  {t("securePayment")}
                                </div>
                                <div>
                                  {t("securePaymentMessage")}
                                </div>
                              </div>
                              <Lock className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Methods & Form - left in LTR, right in RTL (via order) */}
                    <div
                      className={`space-y-6 col-span-2 ${isRTL ? "lg:order-2" : "lg:order-1"}`}
                      dir={dir}
                    >
                      {/* Only show payment methods for paid products */}
                      {currentPrice > 0 ? (
                        <>
                          {/* Payment Methods */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground">
                              {t("selectPaymentMethod")}
                            </h3>

                            <PaymentMethodCards />
                          </div>

                          {/* Payment Form */}
                          {activeConnections &&
                            activeConnections.length > 0 && (
                              <div className="space-y-4">
                                {!isAuthenticated ? (
                                  <>
                                    <h3 className="text-lg font-semibold text-foreground">
                                      {t("guestAuthSectionTitle")}
                                    </h3>
                                    <GuestAuthForm />
                                  </>
                                ) : (
                                  <>
                                    <h3 className="text-lg font-semibold text-foreground">
                                      {t("paymentDetails")}
                                    </h3>
                                    <PaymentForms />
                                  </>
                                )}
                              </div>
                            )}
                        </>
                      ) : (
                        /* Free Product Message */
                        <div className="text-center py-8">
                          <div className="bg-muted/50 border border-border rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              {t("freeProduct")}
                            </h3>
                            <p className="text-muted-foreground">
                              {t("freeProductMessage")}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
