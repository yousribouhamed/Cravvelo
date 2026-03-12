"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { maketoast } from "@/src/components/toasts";
import type { SubscriptionPageData } from "../actions/subscription-page.actions";
import { CurrentPlanUsageView } from "./current-plan-usage-view";
import { SubscriptionPlansView } from "./subscription-plans-view";
import { SubscriptionUpgradeModal } from "./subscription-upgrade-modal";

interface SubscriptionSettingsContentProps {
  data: SubscriptionPageData;
}

export function SubscriptionSettingsContent({ data }: SubscriptionSettingsContentProps) {
  const t = useTranslations("subscription");
  const searchParams = useSearchParams();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const hasPlan = !!data.subscription;

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

  return (
    <div className="w-full py-6 space-y-8">
      {hasPlan ? (
        <>
          <CurrentPlanUsageView
            data={data}
            onUpgrade={() => setUpgradeModalOpen(true)}
          />
          <SubscriptionUpgradeModal
            open={upgradeModalOpen}
            onOpenChange={setUpgradeModalOpen}
            data={data}
          />
        </>
      ) : (
        <div id="plans">
          <SubscriptionPlansView />
        </div>
      )}
    </div>
  );
}
