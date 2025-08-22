import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BrandButton from "@/components/brand-button";
import { useForm } from "@/hooks/use-form";

interface ChargilyFormProps {
  isLoading?: boolean;
}

interface ChargilyFormData {
  email: string;
  phone: string;
  couponCode?: string;
}

export function ChargilyForm({ isLoading = false }: ChargilyFormProps) {
  const [formData, setFormData] = useState<ChargilyFormData>({
    email: "",
    phone: "",
    couponCode: "",
  });
  const [couponApplied, setCouponApplied] = useState(false);

  const handleChange = (field: keyof ChargilyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCouponApply = () => {
    if (formData.couponCode?.trim()) {
      setCouponApplied(true);
      console.log("Applying coupon:", formData.couponCode);
      // Handle coupon application logic here
    }
  };

  const isFormValid = () => {
    return (
      formData.email.trim() !== "" &&
      formData.phone.trim() !== "" &&
      /\S+@\S+\.\S+/.test(formData.email)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      <Card className="flex-1">
        <CardContent className="p-4">
          <div className="space-y-6">
            {/* Coupon Code Section */}
            <div className="space-y-2">
              <Label
                htmlFor="coupon"
                className="block text-right text-foreground"
              >
                كود الخصم (اختياري)
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
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  onClick={handleCouponApply}
                  disabled={!formData.couponCode?.trim() || isLoading}
                  size="sm"
                  className="px-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {couponApplied ? "تم التطبيق" : "تطبيق"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fixed Bottom Button */}
      <div className="my-4 p-4 flex items-center justify-center  ">
        <BrandButton
          size={"lg"}
          type="submit"
          className="w-full h-[40px]"
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "جاري المعالجة..." : "إتمام الدفع عبر Chargily"}
        </BrandButton>
      </div>
    </form>
  );
}
