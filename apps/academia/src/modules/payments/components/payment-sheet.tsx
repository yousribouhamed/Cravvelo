"use client";

import BrandButton from "@/components/brand-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTenantBranding } from "@/hooks/use-tenant";
import { useState } from "react";
import { CreditCard, Smartphone, Lock, Check } from "lucide-react";
import { createChargilyCheckout } from "../actions/chargily.actions";
import { getTenantPaymentConnections } from "../actions/connections.actions";
import { useQuery } from "@tanstack/react-query";
import { PaymentSheetSkeleton } from "./payment-skeleton";

// Skeleton Loader Component

export function PaymentButton() {
  const {
    data: connections,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tenant-payment-connections"],
    queryFn: async () => {
      const result = await getTenantPaymentConnections();
      if (!result.success) {
        throw new Error("Failed to fetch payment connections");
      }
      return result.data;
    },
  });

  const { primaryColor, primaryColorDark } = useTenantBranding();
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState("chargily");

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const price = await createChargilyCheckout();
      console.log("Checkout completed:", price);
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter active payment methods
  const activeConnections =
    connections?.filter((connection) => connection.isActive) || [];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <BrandButton variant="outline" className="font-semibold">
          اشتري الآن
        </BrandButton>
      </SheetTrigger>
      <SheetContent side="left">
        {isLoading ? (
          <PaymentSheetSkeleton />
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
                          <div className="bg-muted/50 rounded-lg p-4 border">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <div className="w-8 h-8 bg-white/20 rounded backdrop-blur-sm"></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-foreground mb-1">
                                  دورة البرمجة الشاملة
                                </h4>
                                <p className="text-sm text-muted-foreground mb-2">
                                  دورة متكاملة لتعلم البرمجة من الصفر
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                    5000 د.ج
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    1 ×
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-border">
                              <div className="flex justify-between items-center">
                                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                  5000 د.ج
                                </span>
                                <span className="text-lg font-bold text-foreground">
                                  المجموع الكلي
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Security Notice */}
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
                      </div>
                    </div>

                    {/* Payment Methods & Form */}
                    <div className="space-y-6 col-span-2" dir="rtl">
                      {/* {error && (
                        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                          <div className="text-red-700 dark:text-red-300 text-sm text-center">
                            حدث خطأ في تحميل طرق الدفع. يرجى المحاولة مرة أخرى.
                          </div>
                        </div>
                      )} */}

                      {/* Payment Methods */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">
                          طرق الدفع
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Show available payment methods based on connections */}
                          {activeConnections.some(
                            (conn) => conn.provider === "chargily"
                          ) && (
                            <div
                              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                paymentMethod === "chargily"
                                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-400"
                                  : "border-border hover:border-muted-foreground/50 bg-card"
                              }`}
                              onClick={() => setPaymentMethod("chargily")}
                            >
                              <div className="flex flex-col items-center text-center space-y-3">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    paymentMethod === "chargily"
                                      ? "border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400"
                                      : "border-muted-foreground/50"
                                  }`}
                                >
                                  {paymentMethod === "chargily" && (
                                    <Check className="w-3 h-3 text-white" />
                                  )}
                                </div>
                                <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                <div className="space-y-1">
                                  <div className="font-medium text-foreground">
                                    شارجيلي - Chargily
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    دفع آمن بالبطاقة البنكية
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* P2P Option */}
                          {activeConnections.some(
                            (conn) => conn.provider === "p2p"
                          ) && (
                            <div
                              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                paymentMethod === "p2p"
                                  ? "border-green-500 bg-green-50 dark:bg-green-950/30 dark:border-green-400"
                                  : "border-border hover:border-muted-foreground/50 bg-card"
                              }`}
                              onClick={() => setPaymentMethod("p2p")}
                            >
                              <div className="flex flex-col items-center text-center space-y-3">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    paymentMethod === "p2p"
                                      ? "border-green-500 bg-green-500 dark:border-green-400 dark:bg-green-400"
                                      : "border-muted-foreground/50"
                                  }`}
                                >
                                  {paymentMethod === "p2p" && (
                                    <Check className="w-3 h-3 text-white" />
                                  )}
                                </div>
                                <Smartphone className="w-8 h-8 text-green-600 dark:text-green-400" />
                                <div className="space-y-1">
                                  <div className="font-medium text-foreground">
                                    التحويل المباشر - P2P
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    تحويل مباشر عبر الهاتف المحمول
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {activeConnections.length === 0 && !error && (
                            <div className="col-span-2 text-center py-8 text-muted-foreground">
                              لا توجد طرق دفع متاحة حالياً
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Payment Form */}
                      {activeConnections.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-foreground">
                            تفاصيل الدفع
                          </h3>

                          {paymentMethod === "chargily" && (
                            <div className="space-y-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-sm justify-end">
                                <span>دفع آمن ومشفر بواسطة Chargily</span>
                                <Lock className="w-4 h-4" />
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <Label
                                    htmlFor="email"
                                    className="block mb-2 text-right text-foreground"
                                  >
                                    البريد الإلكتروني
                                  </Label>
                                  <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@email.com"
                                    className="text-left bg-background"
                                    dir="ltr"
                                  />
                                </div>

                                <div>
                                  <Label
                                    htmlFor="phone"
                                    className="block mb-2 text-right text-foreground"
                                  >
                                    رقم الهاتف
                                  </Label>
                                  <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+213 555 123 456"
                                    className="text-left bg-background"
                                    dir="ltr"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {paymentMethod === "p2p" && (
                            <div className="space-y-4 bg-green-50 dark:bg-green-950/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
                              <div className="text-sm text-green-700 dark:text-green-300 text-right mb-4">
                                سيتم توجيهك لإكمال عملية التحويل المباشر
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <Label
                                    htmlFor="p2p-phone"
                                    className="block mb-2 text-right text-foreground"
                                  >
                                    رقم هاتفك
                                  </Label>
                                  <Input
                                    id="p2p-phone"
                                    type="tel"
                                    placeholder="+213 555 123 456"
                                    className="text-left bg-background"
                                    dir="ltr"
                                  />
                                </div>

                                <div>
                                  <Label
                                    htmlFor="p2p-name"
                                    className="block mb-2 text-right text-foreground"
                                  >
                                    الاسم الكامل
                                  </Label>
                                  <Input
                                    id="p2p-name"
                                    type="text"
                                    placeholder="أدخل اسمك الكامل"
                                    className="text-right bg-background"
                                    dir="rtl"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>

            <SheetFooter className="pt-6 border-t mt-4 flex-shrink-0">
              <div className="w-full space-y-3">
                <BrandButton
                  onClick={handleCheckout}
                  className="w-full h-12 text-lg font-semibold"
                  style={{ backgroundColor: primaryColor }}
                  disabled={loading || activeConnections.length === 0}
                >
                  {loading ? "جارٍ المعالجة..." : "ادفع 5000 د.ج"}
                </BrandButton>
                <p className="text-xs text-center text-muted-foreground px-4">
                  بالنقر على "ادفع"، فإنك توافق على شروط الخدمة وسياسة الخصوصية
                </p>
              </div>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
