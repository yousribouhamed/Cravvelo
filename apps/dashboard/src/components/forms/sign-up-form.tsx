"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "@/src/lib/zod-error-map";
import { Button } from "@ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { useSignUp } from "@clerk/nextjs";
import React from "react";
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
import Link from "next/link";
import { PasswordInput } from "../password-input";
import { authSchema } from "@/src/lib/validators/auth";
import { useRouter } from "next/navigation";
import { catchClerkError, getCookie } from "@/src/lib/utils";
import { maketoast } from "../toasts";
import { User, Mail, Lock, Shield } from "lucide-react";
import Image from "next/image";

type Inputs = z.infer<typeof authSchema>;

export function SignUpForm() {
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");

  const form = useForm<Inputs>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      firstName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof authSchema>) {
    if (!isLoaded) return;

    setError("");
    setSuccess("");

    try {
      const cookie = getCookie("machine_id");
      if (cookie) {
        setError("يبدو أن لديك حساب بالفعل. يرجى تسجيل الدخول.");
        return;
      }

      setIsLoading(true);
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      // Send email verification code
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setSuccess(
        "تم إنشاء الحساب بنجاح! سيتم توجيهك لتأكيد البريد الإلكتروني."
      );

      // Add delay to show success message
      setTimeout(() => {
        router.push("/sign-up/verify-email");
        maketoast.successWithText({
          text: "لقد أرسلنا لك رمز التحقق المكون من 6 أرقام",
        });
      }, 1500);
    } catch (err) {
      setError("حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.");
      catchClerkError(err);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg shadow border ">
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
              إنشاء حساب جديد
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm leading-relaxed">
              انضم إلينا واستمتع بتجربة مجانية لمدة 14 يومًا، بدون بطاقة بنكية
              أو مصاريف خفية.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* First Name Field */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    الاسم الأول
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخِل اسمك الأول"
                      className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    كلمة المرور
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="أدخِل كلمة المرور"
                      className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Terms and Conditions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <FormDescription className="text-sm text-blue-800 leading-relaxed">
                  بالضغط على زر &ldquo;أنشئ حسابك مجانًا&rdquo; أنت توافق على{" "}
                  <Link
                    href="/terms"
                    className="text-blue-600 hover:text-blue-700 font-medium underline"
                  >
                    الشروط والأحكام
                  </Link>
                  و
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:text-blue-700 font-medium underline"
                  >
                    سياسة الخصوصية
                  </Link>
                  .
                </FormDescription>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className={"w-full h-11"}
              loading={isLoading}
            >
              أنشئ حسابك مجانًا
            </Button>
          </form>
        </Form>

        {/* Sign In Link */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-gray-600 text-sm">
            هل لديك حساب؟{" "}
            <Link
              href="/sign-in"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              سجّل الدخول
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
