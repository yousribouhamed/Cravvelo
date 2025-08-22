import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import BrandButton from "@/components/brand-button";
import { createChargilyPaymentIntent } from "../../actions/chargily.actions";
import { usePaymentContext } from "../../context/payments-provider";

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
  checkoutUrl: string;
}

export function ChargilyForm({ isLoading = false }: ChargilyFormProps) {
  const { selectedProduct } = usePaymentContext();
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
      const response = await createChargilyPaymentIntent(payload);
      if (!response.success) {
        throw new Error("Failed to create payment intent");
      }
      return response;
    },
    onSuccess: (data) => {
      toast.success("تم إنشاء رابط الدفع بنجاح");
      // Redirect to checkout URL
      window.location.href = data.checkoutUrl;
    },
    onError: (error) => {
      console.error("Payment creation error:", error);
      toast.error("حدث خطأ في إنشاء رابط الدفع. يرجى المحاولة مرة أخرى");
    },
  });

  const handleChange = (field: keyof ChargilyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCouponApply = () => {
    if (formData.couponCode?.trim()) {
      setCouponApplied(true);
      toast.info("سيتم تطبيق منطق كود الخصم لاحقاً");
      console.log("Applying coupon:", formData.couponCode);
      // TODO: Implement coupon application logic
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct) {
      toast.error("لم يتم اختيار منتج");
      return;
    }

    if (!selectedProduct.id) {
      toast.error("معرف المنتج غير صحيح");
      return;
    }

    // Create payment intent using React Query mutation
    createPaymentMutation.mutate({
      productId: selectedProduct.id,
      type: selectedProduct.type as "COURSE" | "PRODUCT",
    });
  };

  const isSubmitLoading = isLoading || createPaymentMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      <Card className="flex-1">
        <CardContent className="p-4">
          <div className="space-y-6">
            {/* Coupon Code Section - Disabled for now */}
            <div className="space-y-2 opacity-60">
              <Label
                htmlFor="coupon"
                className="block text-right text-foreground"
              >
                كود الخصم (قريباً)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="coupon"
                  type="text"
                  value={formData.couponCode}
                  onChange={(e) => handleChange("couponCode", e.target.value)}
                  placeholder="أدخل كود الخصم"
                  className="text-right bg-background flex-1"
                  dir="rtl"
                  disabled={true} // Disabled until coupon logic is implemented
                />
                <Button
                  type="button"
                  onClick={handleCouponApply}
                  disabled={true} // Disabled until coupon logic is implemented
                  size="sm"
                  className="px-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {couponApplied ? "تم التطبيق" : "تطبيق"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-right">
                * ميزة كود الخصم قيد التطوير
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fixed Bottom Button */}
      <div className="my-4 p-4 flex items-center justify-center">
        <BrandButton
          size="lg"
          type="submit"
          className="w-full h-[40px]"
          loading={isSubmitLoading}
          disabled={!selectedProduct || isSubmitLoading}
        >
          إتمام الدفع عبر Chargily
        </BrandButton>
      </div>
    </form>
  );
}
