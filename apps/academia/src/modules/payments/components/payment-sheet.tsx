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

export function PaymentSheet() {
  const {
    isSheetOpen,
    setSheetOpen,
    selectedProduct,
    connections,
    activeConnections,
    isConnectionsLoading,
  } = usePaymentContext();

  console.log(selectedProduct);

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
      <SheetContent side="left">
        {isConnectionsLoading ? (
          <PaymentSheetSkeleton />
        ) : !selectedProduct ? (
          // Show error state if no product selected (fallback)
          <div className="h-full flex items-center justify-center" dir="rtl">
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  لم يتم اختيار منتج
                </h3>
                <p className="text-muted-foreground">
                  يرجى اختيار منتج قبل المتابعة إلى عملية الدفع
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col" dir="rtl">
            <SheetHeader className="text-right pb-6 flex-shrink-0">
              <SheetTitle className="text-2xl font-bold text-foreground">
                إتمام عملية الشراء
              </SheetTitle>
              <SheetDescription className="text-muted-foreground">
                راجع طلبك واختر طريقة الدفع المناسبة لإكمال عملية الشراء
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-4">
                  {/* Two Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Summary */}
                    <div className="lg:sticky lg:top-0">
                      <div dir="rtl" className="space-y-4">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-foreground">
                            ملخص الطلب
                          </h3>
                          <div className="bg-muted/50 rounded-lg p-4 border my-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                {selectedProduct.image ? (
                                  <img
                                    src={selectedProduct.image}
                                    alt={selectedProduct.name}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-white/20 rounded backdrop-blur-sm"></div>
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
                                  {currentPrice > 0 ? (
                                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                      {currentPrice.toLocaleString()}{" "}
                                      {selectedProduct.currency}
                                    </span>
                                  ) : (
                                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                      مجاني
                                    </span>
                                  )}
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
                                        {selectedPricing.compareAtPrice.toLocaleString()}{" "}
                                        {selectedProduct.currency}
                                      </span>
                                    </div>
                                  )}
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-border">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-foreground">
                                  المجموع الكلي
                                </span>
                                {currentPrice > 0 ? (
                                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                    {currentPrice.toLocaleString()}{" "}
                                    {selectedProduct.currency}
                                  </span>
                                ) : (
                                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                    مجاني
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Show access duration info if available */}
                            {selectedPricing && (
                              <div className="mt-3 pt-3 border-t border-border">
                                <div className="text-xs text-muted-foreground text-center">
                                  {selectedPricing.accessDuration ===
                                    "UNLIMITED" && "وصول غير محدود"}
                                  {selectedPricing.accessDuration ===
                                    "LIMITED" &&
                                    selectedPricing.accessDurationDays &&
                                    `وصول لمدة ${selectedPricing.accessDurationDays} يوم`}
                                  {selectedPricing.pricingType ===
                                    "RECURRING" &&
                                    selectedPricing.recurringDays &&
                                    ` • يتجدد كل ${selectedPricing.recurringDays} يوم`}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Security Notice - only show for paid products */}
                        {currentPrice > 0 && (
                          <div className="bg-muted/50 rounded-lg p-4 border">
                            <div className="flex items-start gap-3">
                              <div className="text-right text-sm text-muted-foreground flex-1">
                                <div className="font-medium mb-1 text-foreground">
                                  دفع آمن 100%
                                </div>
                                <div>
                                  جميع المعاملات مشفرة ومحمية. لن نحتفظ بمعلومات
                                  الدفع الخاصة بك.
                                </div>
                              </div>
                              <Lock className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Methods & Form */}
                    <div className="space-y-6 col-span-2" dir="rtl">
                      {/* Debug Info (remove in production) */}
                      {process.env.NODE_ENV === "development" && (
                        <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                          <div className="text-xs text-yellow-700 dark:text-yellow-300">
                            Debug: {connections?.length || 0} total connections,{" "}
                            {activeConnections?.length || 0} active | Price:{" "}
                            {currentPrice} {selectedProduct.currency}
                            {selectedPricing &&
                              ` | Pricing: ${selectedPricing.name}`}
                          </div>
                        </div>
                      )}

                      {/* Only show payment methods for paid products */}
                      {currentPrice > 0 ? (
                        <>
                          {/* Payment Methods */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground">
                              طرق الدفع
                            </h3>

                            <PaymentMethodCards />
                          </div>

                          {/* Payment Form */}
                          {activeConnections &&
                            activeConnections.length > 0 && (
                              <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground">
                                  تفاصيل الدفع
                                </h3>

                                <PaymentForms />
                              </div>
                            )}
                        </>
                      ) : (
                        /* Free Product Message */
                        <div className="text-center py-8">
                          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">
                              منتج مجاني
                            </h3>
                            <p className="text-blue-600 dark:text-blue-400">
                              هذا المنتج متاح مجاناً. يمكنك الوصول إليه مباشرة
                              دون الحاجة للدفع.
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
