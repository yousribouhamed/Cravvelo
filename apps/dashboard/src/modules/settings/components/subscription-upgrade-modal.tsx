"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import type { SubscriptionPageData } from "../actions/subscription-page.actions";

type BillingCycle = "MONTHLY" | "YEARLY";

interface SubscriptionUpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: SubscriptionPageData;
}

function getPlanPrice(plan: SubscriptionPlan, cycle: BillingCycle): number {
  return cycle === "YEARLY" ? plan.priceYearly : plan.priceMonthly;
}

export function SubscriptionUpgradeModal({
  open,
  onOpenChange,
  data,
}: SubscriptionUpgradeModalProps) {
  const t = useTranslations("subscription");
  const subscription = data.subscription;

  const currentPlan = useMemo(() => {
    if (!subscription) return null;
    return (
      SUBSCRIPTION_PLANS.find((plan) => plan.planCode === subscription.planCode) ??
      null
    );
  }, [subscription]);

  const isYearlyLocked = subscription?.billingCycle === "YEARLY";
  const [selectedPlanCode, setSelectedPlanCode] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("MONTHLY");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSelectedPlanCode(null);
    setBillingCycle(isYearlyLocked ? "YEARLY" : "MONTHLY");
  }, [open, isYearlyLocked]);

  const selectedPlan = useMemo(() => {
    if (!selectedPlanCode) return null;
    return SUBSCRIPTION_PLANS.find((plan) => plan.planCode === selectedPlanCode) ?? null;
  }, [selectedPlanCode]);

  const upgradeCandidates = useMemo(() => {
    if (!subscription) return [];
    return SUBSCRIPTION_PLANS.filter((plan) => plan.planCode !== subscription.planCode);
  }, [subscription]);

  const currentCycle = subscription?.billingCycle === "YEARLY" ? "YEARLY" : "MONTHLY";
  const currentPrice = currentPlan ? getPlanPrice(currentPlan, currentCycle) : 0;
  const targetPrice = selectedPlan ? getPlanPrice(selectedPlan, billingCycle) : 0;
  const payableAmount = Math.max(0, targetPrice - currentPrice);

  const handleProceedToPayment = async () => {
    if (!selectedPlan || !subscription) {
      maketoast.errorWithText({ text: t("upgrade.selectPlanFirst") });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createSubscriptionCheckout({
        planCode: selectedPlan.planCode,
        billingCycle,
      });

      if (result.success && result.checkoutUrl) {
        onOpenChange(false);
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

  if (!subscription || !currentPlan) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("upgrade.title")}</DialogTitle>
          <DialogDescription>{t("upgrade.description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-medium">{t("upgrade.selectPlan")}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {upgradeCandidates.map((plan) => (
                <button
                  key={plan.planCode}
                  type="button"
                  onClick={() => setSelectedPlanCode(plan.planCode)}
                  className={cn(
                    "rounded-lg border-2 p-4 text-left transition-colors",
                    selectedPlanCode === plan.planCode
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <p className="font-semibold">
                    {t(`plans.${plan.planCode.toLowerCase()}.name`)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plan.currency} {plan.priceMonthly.toLocaleString()} {t("perMonth")} -{" "}
                    {plan.currency} {plan.priceYearly.toLocaleString()} {t("perYear")}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">{t("upgrade.selectCycle")}</p>
            {isYearlyLocked && (
              <p className="text-xs text-muted-foreground">{t("upgrade.yearlyOnlyHint")}</p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBillingCycle("MONTHLY")}
                disabled={isYearlyLocked}
                className={cn(
                  "rounded-lg border-2 p-4 text-left transition-colors",
                  billingCycle === "MONTHLY"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30",
                  isYearlyLocked && "cursor-not-allowed opacity-50"
                )}
              >
                <span className="font-semibold">{t("monthly")}</span>
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
              </button>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/20 p-4">
            <p className="text-sm text-muted-foreground">{t("upgrade.amountDueNow")}</p>
            <p className="mt-1 text-xl font-bold tabular-nums">
              {currentPlan.currency} {payableAmount.toLocaleString()}
            </p>
            {selectedPlan && payableAmount <= 0 && (
              <p className="mt-1 text-xs text-destructive">
                {t("upgrade.invalidUpgradeSelection")}
              </p>
            )}
          </div>

          <Button
            className="w-full"
            onClick={handleProceedToPayment}
            disabled={!selectedPlan || payableAmount <= 0 || isSubmitting}
          >
            {isSubmitting ? t("redirecting") : t("proceedToPayment")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
