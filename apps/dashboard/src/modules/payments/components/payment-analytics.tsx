"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/ui/card";
import { formatCurrencyCompact } from "../utils";
import { useTranslations } from "next-intl";
import { 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  Wallet
} from "lucide-react";

interface PaymentStats {
  totalAmount: number;
  totalPayments: number;
  statusBreakdown: Array<{
    status: string;
    _count: { _all: number };
    _sum: { amount: number | null };
  }>;
  monthlyTrends: Array<{
    createdAt: Date;
    _sum: { amount: number | null };
    _count: { _all: number };
  }>;
}

interface PaymentAnalyticsProps {
  stats: PaymentStats | null;
}

export function PaymentAnalytics({ stats }: PaymentAnalyticsProps) {
  const t = useTranslations();

  if (!stats) {
    return null;
  }

  // Calculate metrics from status breakdown
  const pendingStats = stats.statusBreakdown.find((s) => s.status === "PENDING") || {
    _count: { _all: 0 },
    _sum: { amount: 0 },
  };
  const completedStats = stats.statusBreakdown.find((s) => s.status === "COMPLETED") || {
    _count: { _all: 0 },
    _sum: { amount: 0 },
  };

  const pendingAmount = pendingStats._sum.amount || 0;
  const pendingCount = pendingStats._count._all || 0;
  const completedAmount = completedStats._sum.amount || 0;
  const completedCount = completedStats._count._all || 0;

  // Get wallet balance (this would ideally come from a separate query, but for now we'll use totalAmount as a placeholder)
  // In a real scenario, you'd fetch wallet balance separately
  const walletBalance = completedAmount; // Using completed amount as balance approximation

  const analyticsCards = [
    {
      title: t("payments.analytics.totalRevenue"),
      value: formatCurrencyCompact({ amount: completedAmount, currency: "DZD" }),
      icon: DollarSign,
      description: t("payments.analytics.totalRevenueDescription"),
      className: "border-green-200 dark:border-green-800",
    },
    {
      title: t("payments.analytics.pendingPayments"),
      value: `${pendingCount} ${t("payments.analytics.payments")}`,
      amount: formatCurrencyCompact({ amount: pendingAmount, currency: "DZD" }),
      icon: Clock,
      description: t("payments.analytics.pendingPaymentsDescription"),
      className: "border-yellow-200 dark:border-yellow-800",
    },
    {
      title: t("payments.analytics.completedPayments"),
      value: `${completedCount} ${t("payments.analytics.payments")}`,
      amount: formatCurrencyCompact({ amount: completedAmount, currency: "DZD" }),
      icon: CheckCircle2,
      description: t("payments.analytics.completedPaymentsDescription"),
      className: "border-blue-200 dark:border-blue-800",
    },
    {
      title: t("payments.analytics.totalPayments"),
      value: `${stats.totalPayments} ${t("payments.analytics.payments")}`,
      amount: formatCurrencyCompact({ amount: stats.totalAmount, currency: "DZD" }),
      icon: TrendingUp,
      description: t("payments.analytics.totalPaymentsDescription"),
      className: "border-purple-200 dark:border-purple-800",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {analyticsCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className={card.className}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {card.amount && (
                <p className="text-xs text-muted-foreground mt-1">
                  {card.amount}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
