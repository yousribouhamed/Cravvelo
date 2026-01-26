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
    <div className={`w-full min-h-[400px] my-4 ${dir === "rtl" ? "rtl" : ""}`} dir={dir}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t("pageTitle")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t("pageDescription")}
        </p>
      </div>

      <div className="grid p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map((method) => (
          <Card
            key={method.id}
            className={`relative overflow-hidden ${
              method.isConnected
                ? "ring-2 ring-green-200 dark:ring-green-700"
                : ""
            }`}
          >
            {/* Connected Badge */}
            {method.isConnected && (
              <div className={`absolute top-2 z-10 ${dir === "rtl" ? "left-4" : "right-4"}`}>
                <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700">
                  {t("connected")}
                </Badge>
              </div>
            )}

            {/* Coming Soon Badge */}
            {!method.isAvailable && (
              <div className={`absolute top-4 z-10 ${dir === "rtl" ? "left-4" : "right-4"}`}>
                <Badge className="bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600">
                  <Clock className={`w-3 h-3 ${dir === "rtl" ? "ml-1" : "mr-1"}`} />
                  {t("comingSoon")}
                </Badge>
              </div>
            )}

            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${method.badgeColor}`}>
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
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {method.name}
                    </CardTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {method.shortDesc}
                    </p>
                  </div>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {method.icon}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                {method.description}
              </p>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
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

            <CardFooter className="pt-4 gap-2">
              {method.isAvailable ? (
                <>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(method.route);
                    }}
                    className={`flex-1 ${method.accentColor} ${method.hoverColor} dark:text-white text-black font-medium transition-all duration-200 flex items-center justify-center gap-2`}
                    size="sm"
                  >
                    {method.isConnected ? (
                      <>
                        <Settings className="w-4 h-4" />
                        {t("manageAccount")}
                      </>
                    ) : (
                      <>
                        <ArrowLeft className="w-4 h-4" />
                        {t("connectAccount")}
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  disabled
                  className="flex-1 bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                  size="sm"
                >
                  <Clock className={`w-4 h-4 ${dir === "rtl" ? "ml-2" : "mr-2"}`} />
                  {t("comingSoon")}
                </Button>
              )}
            </CardFooter>

            {/* Subtle hover effect overlay */}
            <div className="absolute inset-0 bg-white dark:bg-gray-800 opacity-0 hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 dark:bg-gray-700 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t("security.title")}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
              {t("security.description")}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/50"
            >
              {t("security.learnMore")}
              <ArrowLeft className={`w-4 h-4 ${dir === "rtl" ? "ml-2" : "mr-2"}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailablePaymentMethods;
