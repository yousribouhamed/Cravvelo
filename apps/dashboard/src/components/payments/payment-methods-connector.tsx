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
import { PaymentsConnect } from "database";
import Image from "next/image";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Settings,
  Zap,
  Shield,
  Globe,
  CreditCard,
} from "lucide-react";

interface PaymentMethodsConnectorsProps {
  data: PaymentsConnect;
}

const PaymentMethodsConnectors: FC<PaymentMethodsConnectorsProps> = ({
  data,
}) => {
  const router = useRouter();

  const isChargilyConnected =
    data && data?.chargilyPublicKey && data?.chargilySecretKey ? true : false;

  const paymentMethods = [
    {
      id: "chargily",
      name: "Chargily",
      arabicName: "شارجيلي",
      description:
        "المنصة الأولى في الجزائر لاستقبال الأموال عبر الإنترنت دون الحاجة لسجل تجاري",
      shortDesc: "الدفع الرقمي في الجزائر",
      logo: "/chargily.jpg",
      isConnected: isChargilyConnected,
      isAvailable: true,
      features: ["دفع فوري", "بدون سجل تجاري", "آمن ومضمون"],
      primaryColor: "from-violet-500 to-purple-600",
      accentColor: "bg-violet-500 dark:bg-violet-600",
      hoverColor: "hover:bg-violet-600 dark:hover:bg-violet-700",
      route: "/settings/payments-methods/chargily",
      icon: <Zap className="w-4 h-4" />,
      badgeColor:
        "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
    },
    {
      id: "stripe",
      name: "Stripe",
      arabicName: "سترايب",
      description:
        "منصة مدفوعات عالمية تتيح للشركات قبول المدفوعات وإدارة العمليات المالية بسهولة وأمان",
      shortDesc: "المدفوعات العالمية",
      logo: "/stripe-2.svg",
      isConnected: false,
      isAvailable: false,
      features: ["قبول دولي", "أمان متقدم", "تقارير مفصلة"],
      primaryColor: "from-blue-500 to-indigo-600",
      accentColor: "bg-blue-500 dark:bg-blue-600",
      hoverColor: "hover:bg-blue-600 dark:hover:bg-blue-700",
      route: "/settings/payments-methods/stripe",
      icon: <Globe className="w-4 h-4" />,
      badgeColor:
        "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      id: "p2p",
      name: "P2P Transfer",
      arabicName: "التحويل المباشر",
      description:
        "تحويل مباشر من شخص لشخص عبر المحافظ الرقمية والتطبيقات المصرفية المحلية",
      shortDesc: "التحويل المباشر P2P",
      logo: "/p2p-icon.svg",
      isConnected: false,
      isAvailable: true,
      features: ["تحويل سريع", "رسوم منخفضة", "دعم محلي"],
      primaryColor: "from-emerald-500 to-green-600",
      accentColor: "bg-emerald-500 dark:bg-emerald-600",
      hoverColor: "hover:bg-emerald-600 dark:hover:bg-emerald-700",
      route: "/settings/payments-methods/p2p",
      icon: <CreditCard className="w-4 h-4" />,
      badgeColor:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    },
  ];

  return (
    <div className="w-full min-h-[400px] p-4 md:p-8 rtl" dir="rtl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          طرق الدفع
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          اربط حسابك مع منصات الدفع المختلفة لبدء استقبال الأموال
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentMethods.map((method) => (
          <Card
            key={method.id}
            className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl dark:shadow-gray-800/50 dark:hover:shadow-gray-800/70 transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-800 ${
              method.isConnected
                ? "ring-2 ring-green-200 dark:ring-green-700"
                : ""
            }`}
          >
            {/* Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${method.primaryColor} opacity-5 dark:opacity-10`}
            />

            {/* Connected Badge */}
            {method.isConnected && (
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700">
                  <CheckCircle2 className="w-3 h-3 ml-1" />
                  متصل
                </Badge>
              </div>
            )}

            {/* Coming Soon Badge */}
            {!method.isAvailable && (
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600">
                  <Clock className="w-3 h-3 ml-1" />
                  قريباً
                </Badge>
              </div>
            )}

            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${method.badgeColor}`}>
                    <Image
                      src={method.logo}
                      alt={`${method.name} logo`}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {method.arabicName}
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
                  المميزات
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
                    onClick={() => router.push(method.route)}
                    className={`flex-1 ${method.accentColor} ${method.hoverColor} text-white font-medium transition-all duration-200`}
                    size="sm"
                  >
                    {method.isConnected ? (
                      <>
                        <Settings className="w-4 h-4 ml-2" />
                        إدارة الحساب
                      </>
                    ) : (
                      <>
                        <ArrowLeft className="w-4 h-4 ml-2" />
                        ربط الحساب
                      </>
                    )}
                  </Button>

                  {method.isConnected && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-900"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  disabled
                  className="flex-1 bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                  size="sm"
                >
                  <Clock className="w-4 h-4 ml-2" />
                  قريباً
                </Button>
              )}
            </CardFooter>

            {/* Subtle hover effect overlay */}
            <div className="absolute inset-0 bg-white dark:bg-gray-800 opacity-0 hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              أمان المدفوعات
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
              جميع طرق الدفع المتوفرة تستخدم أحدث تقنيات الأمان والتشفير لحماية
              بياناتك المالية
            </p>
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/50"
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              تعرف على المزيد
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsConnectors;
