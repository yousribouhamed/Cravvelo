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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ChargilyConnectSchema } from "@/src/lib/validators/payments";
import { Input } from "@ui/components/ui/input";
import { trpc } from "@/src/app/_trpc/client";
import React from "react";
import { maketoast } from "../toasts";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import Image from "next/image";
import { PaymentsConnect } from "database";
import {
  ExternalLink,
  Key,
  Shield,
  CheckCircle2,
  ArrowLeft,
  Lightbulb,
  AlertCircle,
} from "lucide-react";

type Inputs = z.infer<typeof ChargilyConnectSchema>;

interface PaymentMethodsConnectorsProps {
  data: PaymentsConnect;
}

const ChargilyConnector: FC<PaymentMethodsConnectorsProps> = ({ data }) => {
  const mutation = trpc.create_user_chargily.useMutation({
    onSuccess: () => {
      maketoast.success(),
        (window.location.href = "/settings/payments-methods");
    },
    onError: () => {
      maketoast.error();
    },
  });

  const form = useForm<Inputs>({
    resolver: zodResolver(ChargilyConnectSchema),
    defaultValues: {
      chargilyPrivateKey: data?.chargilySecretKey
        ? data?.chargilySecretKey
        : "",
      chargilyPublicKey: data?.chargilyPublicKey ? data?.chargilyPublicKey : "",
    },
  });

  function onSubmit(data: Inputs) {
    mutation.mutate({
      private_key: data?.chargilyPrivateKey,
      public_key: data?.chargilyPublicKey,
    });
  }

  const isConnected = data?.chargilyPublicKey && data?.chargilySecretKey;

  return (
    <div className="w-full min-h-screen   rtl my-8 " dir="rtl">
      {/* Header Section */}
      <div className="w-full mx-auto">
        {/* Status Card */}
        {isConnected ? (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-semibold text-green-800 dark:text-green-200">
                  تم الربط بنجاح
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  حسابك متصل مع شارجيلي ويمكنك الآن استقبال المدفوعات
                </p>
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
            <Card className="">
              <CardHeader className="pb-6">
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
                                <Input
                                  placeholder="live_pk_..."
                                  className="pr-12 py-3 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-violet-500 dark:focus:border-violet-400 rounded-xl text-left"
                                  style={{ direction: "ltr" }}
                                  {...field}
                                />
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
                                  className="pr-12 py-3 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-violet-500 dark:focus:border-violet-400 rounded-xl text-left"
                                  style={{ direction: "ltr" }}
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
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Steps Panel */}
          <div className="lg:col-span-1">
            <Card className="  top-4">
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
