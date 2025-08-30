"use client";

import type { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Button } from "@ui/components/ui/button";
import { Switch } from "@ui/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ChargilyConnectSchema } from "@/src/lib/validators/payments";
import { Input } from "@ui/components/ui/input";
import React, { useState } from "react";
import { maketoast } from "@/src/components/toasts";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import {
  ExternalLink,
  Key,
  Shield,
  CheckCircle2,
  ArrowLeft,
  Lightbulb,
  AlertCircle,
  Power,
  PowerOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  connectChargily,
  updateChargily,
  activateConnectionChargily,
  disconnectChargily,
} from "../actions/chargily";
import { ChargilyConfigType } from "../types";

type Inputs = z.infer<typeof ChargilyConnectSchema>;

interface PaymentMethodsConnectorsProps {
  data: ChargilyConfigType | null;
  isAlreadyActive: boolean;
}

const ChargilyConnector: FC<PaymentMethodsConnectorsProps> = ({
  data,
  isAlreadyActive,
}) => {
  const router = useRouter();
  const [isActive, setIsActive] = useState(isAlreadyActive ?? false);

  const mutation = useMutation({
    mutationFn: data ? updateChargily : connectChargily,
    onSuccess: () => {
      maketoast.success();
      router.push(`/payments/payments-methods`);
    },
    onError: () => {
      maketoast.error();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: isActive ? disconnectChargily : activateConnectionChargily,
    onSuccess: () => {
      setIsActive(!isActive);
      maketoast.success();
    },
    onError: () => {
      maketoast.error();
    },
  });

  const form = useForm<Inputs>({
    resolver: zodResolver(ChargilyConnectSchema),
    defaultValues: {
      // Fixed: Correct field mapping
      chargilyPrivateKey: data?.secretKey || "",
      chargilyPublicKey: data?.publicKey || "",
    },
  });

  function onSubmit(formData: Inputs) {
    // Fixed: Correct field mapping
    mutation.mutate({
      secretKey: formData.chargilyPrivateKey,
      publicKey: formData.chargilyPublicKey,
    });
  }

  const handleToggle = () => {
    if (data?.publicKey && data?.secretKey) {
      toggleMutation.mutate({});
    }
  };

  const isConnected = data?.publicKey && data?.secretKey;

  return (
    <div className="w-full min-h-screen rtl my-8" dir="rtl">
      {/* Header Section */}
      <div className="w-full mx-auto">
        {/* Status Card */}
        {isConnected ? (
          <div
            className={`mb-6 p-4 border rounded-2xl ${
              isActive
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isActive ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : (
                  <PowerOff className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                )}
                <div>
                  <p
                    className={`font-semibold ${
                      isActive
                        ? "text-green-800 dark:text-green-200"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {isActive ? "مفعل ويعمل" : "متصل ولكن معطل"}
                  </p>
                  <p
                    className={`text-sm ${
                      isActive
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {isActive
                      ? "حسابك متصل مع شارجيلي ويمكنك الآن استقبال المدفوعات"
                      : "الحساب متصل ولكن مُعطل مؤقتاً - لن تتم معالجة المدفوعات"}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center gap-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    checked={isActive}
                    onCheckedChange={handleToggle}
                    disabled={toggleMutation.isLoading}
                    className="data-[state=checked]:bg-green-500 dark:data-[state=checked]:bg-green-600"
                  />
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {isActive ? "مفعل" : "معطل"}
                    </span>
                    {toggleMutation.isLoading && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        جاري التحديث...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="font-semibold text-blue-800 dark:text-blue-200">
                  لم يتم الربط بعد
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  أكمل الخطوات أدناه لربط حسابك مع شارجيلي
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
                      <Shield className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                        إعداد مفاتيح API
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        أدخل مفاتيح API الخاصة بك من لوحة تحكم شارجيلي
                      </CardDescription>
                    </div>
                  </div>

                  {/* Connection Status Indicator */}
                  {isConnected && (
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          isActive
                            ? "bg-green-500 animate-pulse"
                            : "bg-gray-400"
                        }`}
                      ></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {isActive ? "نشط" : "معطل"}
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                    id="chargily-form"
                  >
                    {/* Public Key Field */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="chargilyPublicKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 dark:text-gray-100 font-semibold flex items-center gap-2">
                              <Key className="w-4 h-4" />
                              المفتاح العام (Public Key)
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input placeholder="live_pk_..." {...field} />
                                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              </div>
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              المفتاح العام آمن للاستخدام في الواجهة الأمامية
                            </p>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Private Key Field */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="chargilyPrivateKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 dark:text-gray-100 font-semibold flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              المفتاح الخاص (Secret Key)
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="password"
                                  placeholder="live_sk_..."
                                  {...field}
                                />
                                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              </div>
                            </FormControl>
                            <FormMessage />
                            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-amber-700 dark:text-amber-300">
                                <strong>تنبيه:</strong> المفتاح الخاص سري جداً
                                ولا يجب مشاركته مع أي شخص. يتم تشفيره وحفظه
                                بأمان.
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        disabled={mutation.isLoading}
                        type="submit"
                        size="lg"
                      >
                        {mutation.isLoading ? (
                          <div className="flex items-center gap-2">
                            <LoadingSpinner />
                            جاري الحفظ...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" />
                            {isConnected ? "تحديث الإعدادات" : "ربط الحساب"}
                          </div>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Payment Status Info */}
            {isConnected && (
              <div
                className={`mt-6 p-4 border rounded-2xl ${
                  isActive
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  {isActive ? (
                    <Power className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                  ) : (
                    <PowerOff className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  )}
                  <div>
                    <h3
                      className={`font-semibold mb-2 ${
                        isActive
                          ? "text-green-900 dark:text-green-100"
                          : "text-amber-900 dark:text-amber-100"
                      }`}
                    >
                      {isActive ? "الدفع مُفعل" : "الدفع معطل"}
                    </h3>
                    <ul
                      className={`text-sm space-y-1 ${
                        isActive
                          ? "text-green-700 dark:text-green-300"
                          : "text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {isActive ? (
                        <>
                          <li>• العملاء يمكنهم الدفع عبر شارجيلي</li>
                          <li>• ستتم معالجة جميع المدفوعات تلقائياً</li>
                          <li>• ستحصل على إشعارات بالمدفوعات الجديدة</li>
                        </>
                      ) : (
                        <>
                          <li>• لن يتمكن العملاء من الدفع عبر شارجيلي</li>
                          <li>• لن تتم معالجة أي مدفوعات</li>
                          <li>• يمكنك تفعيله مرة أخرى في أي وقت</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Security Info */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    معلومات الأمان
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• جميع المفاتيح محمية بتشفير AES-256</li>
                    <li>• المفاتيح محفوظة بشكل آمن في قاعدة البيانات</li>
                    <li>• اتصال آمن مع خوادم شارجيلي عبر HTTPS</li>
                    <li>• يمكنك تعطيل الدفع مؤقتاً دون فقدان الإعدادات</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Steps Panel */}
          <div className="lg:col-span-1">
            <Card className="top-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  الخطوات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                      احصل على المفاتيح
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      اذهب إلى لوحة تحكم شارجيلي واحصل على مفاتيح الـ API
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                      أدخل المفاتيح
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      انسخ والصق المفاتيح في الحقول المطلوبة
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                      احفظ الإعدادات
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      اضغط حفظ التغييرات لإكمال عملية الربط
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-sm">
                    4
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                      فعّل الدفع
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      استخدم المفتاح لتفعيل أو تعطيل الدفع
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() =>
                    window.open("https://pay.chargily.com/dashboard", "_blank")
                  }
                >
                  <ExternalLink className="w-4 h-4 ml-2" />
                  فتح لوحة تحكم شارجيلي
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChargilyConnector;
