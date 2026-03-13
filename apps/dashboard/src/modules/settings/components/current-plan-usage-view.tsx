"use client";

import { useTranslations } from "next-intl";
import { Button } from "@ui/components/ui/button";
import { Card, CardContent, CardHeader } from "@ui/components/ui/card";
import { Progress } from "@ui/components/ui/progress";
import { formatBytes } from "@/src/lib/utils";
import type { SubscriptionPageData } from "../actions/subscription-page.actions";
import { ArrowRight } from "lucide-react";

interface CurrentPlanUsageViewProps {
  data: SubscriptionPageData;
  onUpgrade?: () => void;
}

export function CurrentPlanUsageView({
  data,
  onUpgrade,
}: CurrentPlanUsageViewProps) {
  const t = useTranslations("subscription");
  const tUserNav = useTranslations("userNav");

  const { subscription, usage, limits } = data;
  const planNameKey = subscription
    ? `plans.${subscription.planCode.toLowerCase()}.name`
    : null;
  const planName = planNameKey ? t(planNameKey) : tUserNav("freePlan");
  const cycleKey =
    subscription?.billingCycle === "YEARLY" ? "yearly" : "monthly";
  const cycleLabel = subscription ? t(cycleKey) : "";

  const membersPercent =
    limits.membersMax > 0
      ? Math.min(100, (usage.membersCount / limits.membersMax) * 100)
      : 0;
  const storagePercent =
    limits.storageBytes > 0
      ? Math.min(100, (usage.storageUsedBytes / limits.storageBytes) * 100)
      : 0;
  const bandwidthPercent =
    limits.videoBandwidthBytes > 0
      ? Math.min(
          100,
          (usage.videoBandwidthUsedBytes / limits.videoBandwidthBytes) * 100
        )
      : 0;

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">{tUserNav("currentPlan")}</h2>
          <p className="text-muted-foreground">
            {subscription ? `${planName} (${cycleLabel})` : planName}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">{t("usage.members")}</span>
                <span>
                  {usage.membersCount.toLocaleString()} /{" "}
                  {limits.membersMax.toLocaleString()}
                </span>
              </div>
              <Progress value={membersPercent} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">{t("usage.storage")}</span>
                <span>
                  {formatBytes(usage.storageUsedBytes)} /{" "}
                  {formatBytes(limits.storageBytes)}
                </span>
              </div>
              <Progress value={storagePercent} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">
                  {t("usage.videoBandwidth")}
                </span>
                <span>
                  {formatBytes(usage.videoBandwidthUsedBytes)} /{" "}
                  {formatBytes(limits.videoBandwidthBytes)}
                </span>
              </div>
              <Progress value={bandwidthPercent} className="h-2" />
            </div>
          </div>

          <Button className="w-full sm:w-auto" onClick={onUpgrade}>
            {t("usage.upgradePlan")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
