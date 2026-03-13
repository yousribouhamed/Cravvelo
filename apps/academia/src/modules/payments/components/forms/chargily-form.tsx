import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { createChargilyPaymentIntent } from "../../actions/chargily.actions";
import { usePaymentContext } from "../../context/payments-provider";
import { useTranslations, useLocale } from "next-intl";
import { useIsAuthenticated } from "@/hooks/use-tenant";

interface ChargilyFormProps {
  isLoading?: boolean;
}

interface ChargilyFormData {
  couponCode?: string;
}

interface PaymentIntentPayload {
  productId: string;
  type: "COURSE" | "PRODUCT";
}

interface PaymentResponse {
  success: boolean;
  checkoutUrl?: string;
  message?: string;
}

export function ChargilyForm({ isLoading = false }: ChargilyFormProps) {
  const { selectedProduct } = usePaymentContext();
  const t = useTranslations("payments.chargily");
  const isAuthenticated = useIsAuthenticated();
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const [formData, setFormData] = useState<ChargilyFormData>({
    couponCode: "",
  });
  const [couponApplied, setCouponApplied] = useState(false);

  // React Query mutation for payment intent creation
  const createPaymentMutation = useMutation<
    PaymentResponse,
    Error,
    PaymentIntentPayload
  >({
    mutationFn: async (payload: PaymentIntentPayload) => {
      const response = (await createChargilyPaymentIntent(payload)) as PaymentResponse;
      if (!response.success) {
        throw new Error(response.message ?? "Failed to create payment intent");
      }
      return response;
    },
    onSuccess: (data) => {
      if (!data.checkoutUrl) {
        toast.error(t("toastError"));
        return;
      }
      toast.success(t("toastSuccess"));
      window.location.href = data.checkoutUrl;
    },
    onError: (error) => {
      console.error("Payment creation error:", error);
      if (error.message.toLowerCase().includes("unauthorized")) {
        toast.error(t("toastAuthRequired"));
        return;
      }
      toast.error(error.message || t("toastError"));
    },
  });

  const handleChange = (field: keyof ChargilyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCouponApply = () => {
    if (formData.couponCode?.trim()) {
      setCouponApplied(true);
      toast.info(t("toastCouponComing"));
      // TODO: Implement coupon application logic
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct) {
      toast.error(t("toastNoProduct"));
      return;
    }

    if (!isAuthenticated) {
      toast.error(t("toastAuthRequired"));
      return;
    }

    if (!selectedProduct.id) {
      toast.error(t("toastInvalidProduct"));
      return;
    }

    // Create payment intent using React Query mutation
    createPaymentMutation.mutate({
      productId: selectedProduct.id,
      type: selectedProduct.type as "COURSE" | "PRODUCT",
    });
  };

  const isSubmitLoading = isLoading || createPaymentMutation.isLoading;

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      <Card className="flex-1">
        <CardContent className="p-4">
          <div className="space-y-6">
            {/* Coupon Code Section - Disabled for now */}
            <div className="space-y-2 opacity-60" dir={dir}>
              <Label
                htmlFor="coupon"
                className="block text-start text-foreground"
              >
                {t("couponLabel")}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="coupon"
                  type="text"
                  value={formData.couponCode}
                  onChange={(e) => handleChange("couponCode", e.target.value)}
                  placeholder={t("couponPlaceholder")}
                  className="text-start bg-background flex-1 min-w-0 min-h-11 md:min-h-0"
                  dir={dir}
                  disabled={true} // Disabled until coupon logic is implemented
                />
                <Button
                  type="button"
                  onClick={handleCouponApply}
                  disabled={true} // Disabled until coupon logic is implemented
                  size="sm"
                  className="px-4 shrink-0"
                >
                  {couponApplied ? t("couponApplied") : t("couponApply")}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-start">
                {t("couponHint")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fixed Bottom Button - sticky on mobile for always-visible CTA */}
      <div className="sticky bottom-0 z-10 bg-card pt-4 pb-[env(safe-area-inset-bottom)] md:static md:my-4 md:pb-4 flex items-center justify-center p-4">
        <Button
          size="lg"
          type="submit"
          className="w-full min-h-11 sm:h-10"
          loading={isSubmitLoading}
          disabled={!selectedProduct || isSubmitLoading}
        >
          {t("submitButton")}
        </Button>
      </div>
    </form>
  );
}
