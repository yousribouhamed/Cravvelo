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
import { maketoast } from "@/src/components/toasts";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import {
  CheckCircle2,
  AlertCircle,
  Banknote,
  User,
  Building,
  Hash,
  FileText,
  Lightbulb,
  Power,
  PowerOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  connectP2p,
  updateP2p,
  toggleP2pStatus,
  disconnectP2p,
} from "../actions/p2p";
import { Input } from "@ui/components/ui/input";
import { Textarea } from "@ui/components/ui/textarea";
import React, { useState } from "react";

const P2PConnectSchema = z.object({
  bankDetails: z.string().min(2, "الرجاء إدخال تفاصيل البنك"),
  accountHolder: z.string().min(2, "الرجاء إدخال اسم صاحب الحساب"),
  bankName: z.string().min(2, "الرجاء إدخال اسم البنك"),
  accountNumber: z.string().min(4, "الرجاء إدخال رقم الحساب"),
  routingNumber: z.string().optional(),
  notes: z.string().optional(),
});

type Inputs = z.infer<typeof P2PConnectSchema>;

interface P2PConfigType extends Inputs {
  isActive?: boolean;
}

interface P2PConnectorProps {
  data: P2PConfigType | null;
  isAlreadyActive: boolean;
}

const P2PConnector: FC<P2PConnectorProps> = ({ data, isAlreadyActive }) => {
  const router = useRouter();
  const [isActive, setIsActive] = useState(isAlreadyActive ?? false);

  const mutation = useMutation({
    mutationFn: data ? updateP2p : connectP2p,
    onSuccess: () => {
      maketoast.success();
      router.push(`/settings/payments-methods`);
    },
    onError: () => {
      maketoast.error();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleP2pStatus,
    onSuccess: () => {
      setIsActive(!isActive);
      maketoast.success();
    },
    onError: () => {
      maketoast.error();
    },
  });

  const form = useForm<Inputs>({
    resolver: zodResolver(P2PConnectSchema),
    defaultValues: {
      bankDetails: data?.bankDetails || "",
      accountHolder: data?.accountHolder || "",
      bankName: data?.bankName || "",
      accountNumber: data?.accountNumber || "",
      routingNumber: data?.routingNumber || "",
      notes: data?.notes || "",
    },
  });

  function onSubmit(formData: Inputs) {
    mutation.mutate(formData);
  }

  const handleToggle = () => {
    if (data?.accountNumber && data?.bankName) {
      toggleMutation.mutate({ isActive: !isActive });
    }
  };

  const isConnected = !!data;

  return (
    <div className="w-full min-h-screen rtl my-8" dir="rtl">
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
                    {isActive ? "P2P مفعل ويعمل" : "P2P متصل ولكن معطل"}
                  </p>
                  <p
                    className={`text-sm ${
                      isActive
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {isActive
                      ? "يمكن للعملاء الآن إجراء تحويلات بنكية P2P"
                      : "الحساب البنكي متصل ولكن مُعطل مؤقتاً - لن تتم معالجة التحويلات"}
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
                  أدخل بيانات حسابك البنكي لإعداد التحويلات P2P
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
                      <Banknote className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                        إعداد التحويل البنكي (P2P)
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        أدخل بيانات حسابك البنكي لاستقبال الأموال
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
                    id="p2p-form"
                  >
                    {/* Account Holder */}
                    <FormField
                      control={form.control}
                      name="accountHolder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 dark:text-gray-100 font-semibold flex items-center gap-2">
                            <User className="w-4 h-4" />
                            اسم صاحب الحساب
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input placeholder="الاسم الكامل" {...field} />
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Bank Name */}
                    <FormField
                      control={form.control}
                      name="bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 dark:text-gray-100 font-semibold flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            اسم البنك
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="مثال: بنك الجزائر"
                                {...field}
                              />
                              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Account Number */}
                    <FormField
                      control={form.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 dark:text-gray-100 font-semibold flex items-center gap-2">
                            <Hash className="w-4 h-4" />
                            رقم الحساب
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="رقم الحساب البنكي"
                                {...field}
                              />
                              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Routing Number */}
                    <FormField
                      control={form.control}
                      name="routingNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 dark:text-gray-100 font-semibold">
                            رقم التوجيه (اختياري)
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Routing Number" {...field} />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            مطلوب للتحويلات الدولية أو بعض البنوك المحلية
                          </p>
                        </FormItem>
                      )}
                    />

                    {/* Bank Details */}
                    <FormField
                      control={form.control}
                      name="bankDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 dark:text-gray-100 font-semibold">
                            تفاصيل إضافية
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="اكتب تفاصيل إضافية عن البنك (مثل Swift, IBAN)"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Notes */}
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 dark:text-gray-100 font-semibold">
                            ملاحظات
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="ملاحظات إضافية للعملاء حول كيفية إجراء التحويل"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                      {isActive
                        ? "التحويل البنكي مُفعل"
                        : "التحويل البنكي معطل"}
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
                          <li>• العملاء يمكنهم رؤية بيانات الحساب البنكي</li>
                          <li>• سيتم عرض تعليمات التحويل للعملاء</li>
                          <li>• ستحتاج لتأكيد استلام التحويلات يدوياً</li>
                        </>
                      ) : (
                        <>
                          <li>• لن يتمكن العملاء من رؤية بيانات الحساب</li>
                          <li>• لن يتم عرض خيار التحويل البنكي</li>
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
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    معلومات الأمان والخصوصية
                  </h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• بيانات الحساب البنكي محفوظة بشكل آمن ومشفر</li>
                    <li>• لن يتم مشاركة المعلومات مع جهات خارجية</li>
                    <li>• تحقق من صحة البيانات قبل الحفظ</li>
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
                      أدخل بيانات الحساب
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      اسم صاحب الحساب، البنك، ورقم الحساب
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                      أضف التفاصيل
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      تفاصيل إضافية وملاحظات للعملاء
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
                      اضغط حفظ لإكمال عملية الربط
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold text-sm">
                    4
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                      فعّل التحويل
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      استخدم المفتاح لتفعيل أو تعطيل التحويل البنكي
                    </p>
                  </div>
                </div>

                {/* Important Note */}
                <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    <strong>ملاحظة مهمة:</strong> التحويلات البنكية P2P تتطلب
                    تأكيد يدوي من طرفك عند استلام الأموال.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default P2PConnector;
