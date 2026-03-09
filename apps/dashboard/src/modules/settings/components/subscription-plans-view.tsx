"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@ui/components/ui/button";
import { Card, CardContent, CardHeader } from "@ui/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@ui/components/ui/dialog";
import { cn } from "@ui/lib/utils";
import {
  SUBSCRIPTION_PLANS,
  type SubscriptionPlan,
} from "@/src/constants/subscription-plans";
import { createSubscriptionCheckout } from "../actions/subscription-checkout.actions";
import { maketoast } from "@/src/components/toasts";

type BillingCycle = "MONTHLY" | "YEARLY";

export function SubscriptionPlansView() {
  const t = useTranslations("subscription");
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("MONTHLY");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const success = searchParams.get("success");
    const failed = searchParams.get("failed");
    if (success === "1") {
      maketoast.successWithText({ text: t("paymentSuccess") });
      window.history.replaceState({}, "", "/settings/subscription");
    } else if (failed === "1") {
      maketoast.errorWithText({ text: t("paymentFailed") });
      window.history.replaceState({}, "", "/settings/subscription");
    }
  }, [searchParams, t]);

  const openModal = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setBillingCycle("MONTHLY");
    setModalOpen(true);
  };

  const handleProceedToPayment = async () => {
    if (!selectedPlan) return;
    setIsSubmitting(true);
    try {
      const result = await createSubscriptionCheckout({
        planCode: selectedPlan.planCode,
        billingCycle,
      });
      if (result.success && result.checkoutUrl) {
        setModalOpen(false);
        setSelectedPlan(null);
        window.location.href = result.checkoutUrl;
        return;
      }
      maketoast.errorWithText({
        text: result.error ?? t("checkoutError"),
      });
    } catch {
      maketoast.errorWithText({ text: t("checkoutError") });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="flex flex-row items-stretch gap-3">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const price = plan.priceMonthly;

            return (
              <Card
                key={plan.planCode}
                className={cn(
                  "relative flex min-w-[14rem] flex-1 flex-col overflow-hidden transition-all duration-200",
                  plan.highlight
                    ? "scale-[1.02] border-2 border-amber-500 bg-gradient-to-b from-amber-500/5 to-transparent shadow-lg shadow-amber-500/10"
                    : "border-border hover:border-muted-foreground/20 hover:shadow-md"
                )}
              >
                {plan.highlight && plan.highlightLabelKey && (
                  <div className="absolute left-0 right-0 top-0 bg-amber-500 py-1.5 text-center text-xs font-semibold text-white">
                    {t(plan.highlightLabelKey)}
                  </div>
                )}
                <CardHeader
                  className={cn(
                    "space-y-3 pb-4",
                    plan.highlight && "pt-10"
                  )}
                >
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {plan.tagline}
                    </p>
                    <p className="text-xl font-bold tracking-tight">
                      {plan.name}
                    </p>
                  </div>
                  <p className="text-2xl font-bold tabular-nums">
                    {plan.currency} {price.toLocaleString()}{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      {t("perMonth")}
                    </span>
                  </p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-4 pt-0">
                  <Button
                    className="w-full font-semibold"
                    variant="default"
                    onClick={() => openModal(plan)}
                  >
                    {t("getStarted")}
                  </Button>
                  {plan.ctaSubtextKey && (
                    <p className="text-center text-xs text-amber-600 dark:text-amber-400">
                      {t(plan.ctaSubtextKey)}
                    </p>
                  )}
                  <ul className="space-y-3 border-t border-border pt-4">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Image
                          src="/verified.svg"
                          alt=""
                          width={20}
                          height={20}
                          className="mt-0.5 h-5 w-5 shrink-0"
                        />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("chooseBilling")}</DialogTitle>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {selectedPlan.name} — {t("billingCycleHint")}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBillingCycle("MONTHLY")}
                  className={cn(
                    "rounded-lg border-2 p-4 text-left transition-colors",
                    billingCycle === "MONTHLY"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <span className="font-semibold">{t("monthly")}</span>
                  <p className="mt-1 text-lg font-bold tabular-nums">
                    {selectedPlan.currency}{" "}
                    {selectedPlan.priceMonthly.toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}
                      {t("perMonth")}
                    </span>
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("YEARLY")}
                  className={cn(
                    "rounded-lg border-2 p-4 text-left transition-colors",
                    billingCycle === "YEARLY"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <span className="font-semibold">{t("yearly")}</span>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("yearlySaveHint")}
                  </p>
                  <p className="mt-1 text-lg font-bold tabular-nums">
                    {selectedPlan.currency}{" "}
                    {selectedPlan.priceYearly.toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}
                      {t("perYear")}
                    </span>
                  </p>
                </button>
              </div>
              <Button
                className="w-full"
                onClick={handleProceedToPayment}
                disabled={isSubmitting}
              >
                {isSubmitting ? t("redirecting") : t("proceedToPayment")}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
