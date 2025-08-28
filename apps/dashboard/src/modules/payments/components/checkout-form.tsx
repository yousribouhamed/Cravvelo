"use client";

import { useState } from "react";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";
import { Label } from "@ui/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { PaymentMethodCards } from "./payment-method-selected";
import { generateChargilyCheckoutLink } from "../actions/app.checkout.actions";
import { maketoast } from "@/src/components/toasts";

export default function CheckoutForm({ paymentId }: { paymentId: string }) {
  const [loading, setLoading] = useState<boolean>();

  const handlePay = async () => {
    setLoading(true);
    const checkout = await generateChargilyCheckoutLink({ paymentId });

    if (checkout.success) {
      window.location.href = checkout.data.checkout_url;
      return;
    }

    maketoast.error();
    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen flex items-start justify-end px-4 py-8">
      <Card className="w-full border-none">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-start">
            إتمام الدفع
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Methods */}

          {/* Coupon Code */}
          <div className="space-y-2">
            <Label htmlFor="coupon">رمز الكوبون</Label>
            <Input
              id="coupon"
              type="text"
              placeholder="أدخل رمز الكوبون (غير متاح حالياً)"
              disabled
              className="disabled:opacity-70 disabled:cursor-not-allowed"
            />
          </div>

          {/* Pay Button */}
          <div className="space-y-3">
            <Button loading={loading} onClick={handlePay} className="w-full">
              ادفع الآن
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              محمي بواسطة <span className="font-semibold">Cravvelo</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
