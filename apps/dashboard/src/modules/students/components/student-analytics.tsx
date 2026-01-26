"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@ui/components/ui/card";
import { useTranslations } from "next-intl";
import {
  Users,
  UserCheck,
  UserPlus,
  ShoppingBag,
} from "lucide-react";

interface StudentStats {
  totalStudents: number;
  activeStudents: number;
  newStudentsThisMonth: number;
  totalPurchases: number;
  studentsWithCertificates: number;
  emailVerifiedStudents: number;
}

interface StudentAnalyticsProps {
  stats: StudentStats | null;
}

export function StudentAnalytics({ stats }: StudentAnalyticsProps) {
  const t = useTranslations("students");

  if (!stats) {
    return null;
  }

  const analyticsCards = [
    {
      title: t("analytics.totalStudents"),
      value: stats.totalStudents.toString(),
      icon: Users,
      description: t("analytics.totalStudentsDescription"),
      className: "border-green-200 dark:border-green-800",
    },
    {
      title: t("analytics.activeStudents"),
      value: stats.activeStudents.toString(),
      icon: UserCheck,
      description: t("analytics.activeStudentsDescription"),
      className: "border-blue-200 dark:border-blue-800",
    },
    {
      title: t("analytics.newStudentsThisMonth"),
      value: stats.newStudentsThisMonth.toString(),
      icon: UserPlus,
      description: t("analytics.newStudentsThisMonthDescription"),
      className: "border-yellow-200 dark:border-yellow-800",
    },
    {
      title: t("analytics.totalPurchases"),
      value: stats.totalPurchases.toString(),
      icon: ShoppingBag,
      description: t("analytics.totalPurchasesDescription"),
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
