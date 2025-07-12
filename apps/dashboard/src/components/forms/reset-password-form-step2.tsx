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
import { resetPasswordSchema } from "@/src/lib/validators/auth";
import { catchClerkError } from "@/src/lib/utils";
import { PasswordInput } from "../password-input";
import { maketoast } from "../toasts";
import { Mail, Shield, ArrowLeft, KeyRound, Lock, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Inputs = z.infer<typeof resetPasswordSchema>;

// OTP Input Component
const OTPInput = ({ value, onChange, disabled }: { value: string; onChange: (value: string) => void; disabled: boolean }) => {
  const [otp, setOtp] = React.useState<string[]>(new Array(6).fill(''));
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (value) {
      const otpArray = value.split('').slice(0, 6);
      while (otpArray.length < 6) {
        otpArray.push('');
      }
      setOtp(otpArray);
    }
  }, [value]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Update the form value
    onChange(newOtp.join(''));

    // Move to next input
    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    onChange(newOtp.join(''));
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(val => val === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-2" dir="ltr">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={el => inputRefs.current[index] = el}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
      ))}
    </div>
  );
};

export function ResetPasswordStep2Form() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");
  const [isResending, setIsResending] = React.useState<boolean>(false);

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      code: "",
    },
  });

  function onSubmit(data: Inputs) {
    if (!isLoaded) return;

    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const attemptFirstFactor = await signIn.attemptFirstFactor({
          strategy: "reset_password_email_code",
          code: data.code,
          password: data.password,
        });

        if (attemptFirstFactor.status === "needs_second_factor") {
          // TODO: implement 2FA (requires clerk pro plan)
          setError("يتطلب هذا الحساب تحقق إضافي. يرجى المحاولة مرة أخرى.");
        } else if (attemptFirstFactor.status === "complete") {
          await setActive({
            session: attemptFirstFactor.createdSessionId,
          });
          
          setSuccess("تم إعادة تعيين كلمة المرور بنجاح! سيتم توجيهك الآن...");
          
          setTimeout(() => {
            router.push(`${window.location.origin}/`);
            maketoast.successWithText({
              text: "تم إعادة تعيين كلمة المرور بنجاح.",
            });
          }, 1500);
        } else {
          console.error(attemptFirstFactor);
          setError("حدث خطأ أثناء إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى.");
        }
      } catch (err) {
        setError("الرمز غير صحيح أو منتهي الصلاحية. يرجى التحقق والمحاولة مرة أخرى.");
        catchClerkError(err);
      }
    });
  }

  // Handle resend verification code
  const handleResendCode = async () => {
    if (!isLoaded || !signIn) return;

    setIsResending(true);
    setError("");
    setSuccess("");

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: form.getValues("code") 
      });
      
      setSuccess("تم إرسال رمز جديد إلى بريدك الإلكتروني.");
      maketoast.successWithText({
        text: "تم إرسال رمز التحقق الجديد بنجاح",
      });
    } catch (err) {
      console.log(err);
      setError("فشل في إرسال رمز جديد. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsResending(false);
    }
  };

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
              إعادة تعيين كلمة المرور
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm leading-relaxed">
              أدخِل رمز التحقق الذي أرسلناه إلى بريدك الإلكتروني، ثم قم بإدخال كلمة المرور الجديدة.
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
            {/* OTP Input Fields */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    رمز التحقق
                  </FormLabel>
                  <FormControl>
                    <OTPInput
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Resend Code Section */}
            <div className="flex items-center justify-between">
              <p className="text-gray-600 text-sm">
                لم تستلم الرمز؟
              </p>
              <Button
                variant="ghost"
                onClick={handleResendCode}
                disabled={isResending}
                className="h-auto p-0 text-blue-600 hover:text-blue-700"
                loading={isResending}
              >
                <RefreshCw className="w-4 h-4 ml-1" />
                إرسال رمز جديد
              </Button>
            </div>

            {/* Password Fields */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    كلمة المرور الجديدة
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="أدخِل كلمة المرور الجديدة"
                      className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    تأكيد كلمة المرور
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="أعد إدخال كلمة المرور"
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
                  تأكد من أن كلمة المرور الجديدة قوية وتحتوي على أحرف كبيرة وصغيرة وأرقام ورموز.
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
              إعادة تعيين كلمة المرور
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