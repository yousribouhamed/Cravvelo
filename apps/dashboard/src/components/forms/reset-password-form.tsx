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
import { Mail, Shield, ArrowLeft, KeyRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Inputs = z.infer<typeof checkEmailSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const { isLoaded, signIn } = useSignIn();
  const [isPending, startTransition] = React.useTransition();
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
            router.push("/sign-in/reset-password/step2");
            maketoast.successWithText({
              text: "لقد أرسلنا لك رمز التحقق المكون من 6 أرقام.",
            });
          }, 1500);
        }
      } catch (err) {
        setError("حدث خطأ أثناء إرسال رمز التحقق. يرجى التأكد من صحة البريد الإلكتروني والمحاولة مرة أخرى.");
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
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              استعادة كلمة المرور
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm leading-relaxed">
              أدخِل عنوان بريدك الإلكتروني وسنرسل لك رمز التحقق لإعادة تعيين كلمة المرور.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-800 leading-relaxed">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800 leading-relaxed">
                {error}
              </p>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    البريد الإلكتروني
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخِل عنوان البريد الإلكتروني"
                      className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Information Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <KeyRound className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <FormDescription className="text-sm text-blue-800 leading-relaxed">
                  تأكّد من صحة البريد الإلكتروني، إذ سيتم إرسال رمز التحقق المكون من 6 أرقام لإعادة تعيين كلمة المرور.
                </FormDescription>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-11"
              loading={isPending}
            >
              إرسال رمز التحقق
            </Button>
          </form>
        </Form>

        {/* Back to Sign In Link */}
        <div className="text-center pt-4 border-t border-gray-100">
          <Link 
            href="/sign-in"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة إلى تسجيل الدخول
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}