"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "@/src/lib/zod-error-map";
import { Button } from "@ui/components/ui/button";
import React from "react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { checkEmailSchema } from "@/src/lib/validators/auth";
import { catchClerkError } from "@/src/lib/utils";
import { maketoast } from "../toasts";
import {
  Mail,
  Shield,
  ArrowLeft,
  KeyRound,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Inputs = z.infer<typeof checkEmailSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const { isLoaded, signIn } = useSignIn();
  const [isLoading, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");

  const form = useForm<Inputs>({
    resolver: zodResolver(checkEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: Inputs) {
    if (!isLoaded) return;

    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const firstFactor = await signIn.create({
          strategy: "reset_password_email_code",
          identifier: data.email,
        });

        if (firstFactor.status === "needs_first_factor") {
          setSuccess("تم إرسال رمز التحقق بنجاح إلى بريدك الإلكتروني.");

          setTimeout(() => {
            router.push(`/sign-in/reset-password/step2?email=${data.email}`);
            maketoast.success();
          }, 1500);
        }
      } catch (err) {
        setError(
          "حدث خطأ أثناء إرسال رمز التحقق. يرجى التأكد من صحة البريد الإلكتروني والمحاولة مرة أخرى."
        );
        catchClerkError(err);
      }
    });
  }

  return (
    <Card className="w-full max-w-lg shadow border">
      <CardHeader className="space-y-4 pb-2">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Image
              src="/Cravvelo_Logo-01.svg"
              alt="Cravvelo Logo"
              width={180}
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>
          <div className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              استعادة كلمة المرور
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-50 text-sm leading-relaxed">
              أدخِل عنوان بريدك الإلكتروني وسنرسل لك رمز التحقق لإعادة تعيين
              كلمة المرور.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 space-x-reverse p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="flex items-center space-x-2 space-x-reverse p-3 bg-green-50 border border-green-200 rounded-md">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">{success}</span>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-50 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    البريد الإلكتروني
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخِل عنوان البريد الإلكتروني"
                      className="h-11 border focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Information Box */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <KeyRound className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <FormDescription className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                  تأكّد من صحة البريد الإلكتروني، إذ سيتم إرسال رمز التحقق
                  المكون من 6 أرقام لإعادة تعيين كلمة المرور.
                </FormDescription>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11"
              loading={isLoading}
            >
              إرسال رمز التحقق
            </Button>
          </form>
        </Form>

        {/* Back to Sign In Link */}
        <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-900">
          <Link
            href="/sign-in"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors inline-flex items-center gap-2"
          >
            العودة إلى تسجيل الدخول
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
