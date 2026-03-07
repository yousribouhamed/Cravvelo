"use client";

import type { FC } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { Button } from "@ui/components/ui/button";
import { Badge } from "@ui/components/ui/badge";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Clock,
  ArrowLeft,
  Settings,
  Zap,
  Shield,
  Globe,
  CreditCard,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@ui/lib/utils";

interface PaymentConnection {
  provider: string;
  isConnected: boolean;
}

interface PaymentMethodsConnectorsProps {
  connections: PaymentConnection[];
}

const AvailablePaymentMethods: FC<PaymentMethodsConnectorsProps> = ({
  connections,
}) => {
  const router = useRouter();
  const t = useTranslations("paymentMethods");
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  const getConnectionStatus = (providerId: string): boolean => {
    const connection = connections?.find(
      (conn) => conn.provider.toLowerCase() === providerId.toLowerCase()
    );
    return connection?.isConnected || false;
  };

  const paymentMethods = [
    {
      id: "chargily",
      name: t("chargily.name"),
      description: t("chargily.description"),
      shortDesc: t("chargily.shortDesc"),
      logo: "/chargily.jpg",
      isConnected: getConnectionStatus("chargily"),
      isAvailable: true,
      features: t.raw("chargily.features") as string[],
      primaryColor: "from-violet-500 to-purple-600",
      accentColor: "bg-violet-500 dark:bg-violet-600",
      hoverColor: "hover:bg-violet-600 dark:hover:bg-violet-700",
      route: "/payments/payments-methods/chargily",
      icon: <Zap className="w-4 h-4" />,
      badgeColor:
        "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
    },
    {
      id: "p2p",
      name: t("p2p.name"),
      description: t("p2p.description"),
      shortDesc: t("p2p.shortDesc"),
      logo: "/p2p-icon.svg",
      isConnected: getConnectionStatus("p2p"),
      isAvailable: true,
      features: t.raw("p2p.features") as string[],
      primaryColor: "from-emerald-500 to-green-600",
      accentColor: "bg-emerald-500 dark:bg-emerald-600",
      hoverColor: "hover:bg-emerald-600 dark:hover:bg-emerald-700",
      route: "/payments/payments-methods/p2p",
      icon: <CreditCard className="w-4 h-4" />,
      badgeColor:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    },
    {
      id: "stripe",
      name: t("stripe.name"),
      description: t("stripe.description"),
      shortDesc: t("stripe.shortDesc"),
      logo: "/stripe-2.svg",
      isConnected: getConnectionStatus("stripe"),
      isAvailable: false,
      features: t.raw("stripe.features") as string[],
      primaryColor: "from-blue-500 to-indigo-600",
      accentColor: "bg-blue-500 dark:bg-blue-600",
      hoverColor: "hover:bg-blue-600 dark:hover:bg-blue-700",
      route: "/payments/payments-methods/stripe",
      icon: <Globe className="w-4 h-4" />,
      badgeColor:
        "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    },
  ];

  return (
    <div className="w-full min-h-[400px] my-4" dir={dir}>
      <div className={cn("mb-8", dir === "rtl" && "text-right")}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t("pageTitle")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {t("pageDescription")}
        </p>
      </div>

      <div className="grid p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map((method) => (
          <Card
            key={method.id}
            className={cn(
              "relative overflow-hidden flex flex-col",
              method.isConnected && "ring-2 ring-green-200 dark:ring-green-700"
            )}
          >
            {/* Connected Badge */}
            {method.isConnected && (
              <div className={cn("absolute top-2 z-10", dir === "rtl" ? "left-4" : "right-4")}>
                <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700">
                  {t("connected")}
                </Badge>
              </div>
            )}

            {/* Coming Soon Badge */}
            {!method.isAvailable && (
              <div className={cn("absolute top-2 z-10", dir === "rtl" ? "left-4" : "right-4")}>
                <Badge className="bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600">
                  <Clock className={cn("w-3 h-3", dir === "rtl" ? "ml-1" : "mr-1")} />
                  {t("comingSoon")}
                </Badge>
              </div>
            )}

            <CardHeader className="pb-2">
              <div className={cn("flex items-center justify-between", dir === "rtl" && "flex-row-reverse")}>
                <div className={cn("flex items-center gap-3", dir === "rtl" && "flex-row-reverse")}>
                  <div className={cn("p-2 rounded-xl shrink-0", method.badgeColor)}>
                    {method.id === "p2p" ? (
                      method.icon
                    ) : (
                      <Image
                        src={method.logo}
                        alt={`${method.name} logo`}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    )}
                  </div>
                  <div className={cn("min-w-0", dir === "rtl" && "text-right")}>
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {method.name}
                    </CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {method.shortDesc}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 flex-1">
              <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                {method.description}
              </p>
              <div className="space-y-2">
                <h4 className={cn("text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2", dir === "rtl" && "flex-row-reverse justify-end")}>
                  <Shield className="w-4 h-4 shrink-0" />
                  {t("features")}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {method.features.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-4 pb-4 min-h-[44px] flex items-end">
              <Button
                onClick={(e) => {
                  if (!method.isAvailable) return;
                  e.stopPropagation();
                  router.push(method.route);
                }}
                disabled={!method.isAvailable}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 font-medium transition-all duration-200 min-h-[36px]",
                  method.isAvailable
                    ? `${method.accentColor} ${method.hoverColor} dark:text-white text-black`
                    : "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                )}
                size="sm"
              >
                {method.isAvailable && method.isConnected ? (
                  <>
                    <Settings className="w-4 h-4 shrink-0" />
                    {t("manageAccount")}
                  </>
                ) : method.isAvailable ? (
                  <>
                    <ArrowLeft className={cn("w-4 h-4 shrink-0", dir === "rtl" && "rotate-180")} />
                    {t("connectAccount")}
                  </>
                ) : (
                  <>
                    <Settings className="w-4 h-4 shrink-0" />
                    {t("manageAccount")}
                  </>
                )}
              </Button>
            </CardFooter>

            <div className="absolute inset-0 bg-white dark:bg-gray-800 opacity-0 hover:opacity-5 transition-opacity duration-300 pointer-events-none rounded-lg" />
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <div className={cn("mt-12 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700", dir === "rtl" && "text-right")}>
        <div className={cn("flex items-start gap-4", dir === "rtl" && "flex-row-reverse")}>
          <div className="p-2 bg-blue-100 dark:bg-gray-700 rounded-lg shrink-0">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t("security.title")}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
              {t("security.description")}
            </p>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/50 inline-flex items-center gap-2",
                dir === "rtl" && "flex-row-reverse"
              )}
            >
              {t("security.learnMore")}
              <ArrowLeft className={cn("w-4 h-4 shrink-0", dir === "rtl" && "rotate-180")} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailablePaymentMethods;
