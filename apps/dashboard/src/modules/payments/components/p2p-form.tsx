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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { connectP2p, updateP2p } from "../actions/p2p";
import { Input } from "@ui/components/ui/input";
import { Textarea } from "@ui/components/ui/textarea";

const P2PConnectSchema = z.object({
  bankDetails: z.string().min(2, "الرجاء إدخال تفاصيل البنك"),
  accountHolder: z.string().min(2, "الرجاء إدخال اسم صاحب الحساب"),
  bankName: z.string().min(2, "الرجاء إدخال اسم البنك"),
  accountNumber: z.string().min(4, "الرجاء إدخال رقم الحساب"),
  routingNumber: z.string().optional(),
  notes: z.string().optional(),
});

type Inputs = z.infer<typeof P2PConnectSchema>;

interface P2PConnectorProps {
  data: Inputs | null;
}

const P2PConnector: FC<P2PConnectorProps> = ({ data }) => {
  const router = useRouter();

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

  const isConnected = !!data;

  return (
    <div className="w-full min-h-screen rtl my-8" dir="rtl">
      <div className="w-full mx-auto">
        {/* Status Card */}
        {isConnected ? (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-semibold text-green-800 dark:text-green-200">
                  تم ربط الحساب البنكي بنجاح
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  يمكنك الآن استقبال المدفوعات عبر التحويل البنكي P2P
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
                          <FormLabel className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            اسم صاحب الحساب
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="الاسم الكامل" {...field} />
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
                          <FormLabel className="flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            اسم البنك
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="مثال: بنك الجزائر" {...field} />
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
                          <FormLabel className="flex items-center gap-2">
                            <Hash className="w-4 h-4" />
                            رقم الحساب
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="رقم الحساب البنكي" {...field} />
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
                          <FormLabel>رقم التوجيه (اختياري)</FormLabel>
                          <FormControl>
                            <Input placeholder="Routing Number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Bank Details */}
                    <FormField
                      control={form.control}
                      name="bankDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>تفاصيل إضافية</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="اكتب تفاصيل إضافية عن البنك (مثل Swift, IBAN)"
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
                          <FormLabel>ملاحظات</FormLabel>
                          <FormControl>
                            <Textarea placeholder="ملاحظات إضافية" {...field} />
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
          </div>

          {/* Steps Panel */}
          <div className="lg:col-span-1">
            <Card className="top-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  الخطوات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <p>1. أدخل بيانات حسابك البنكي (الاسم، رقم الحساب، البنك).</p>
                <p>2. أضف أي تفاصيل أو ملاحظات مطلوبة للتحويل.</p>
                <p>3. اضغط حفظ لإكمال عملية الربط.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default P2PConnector;
