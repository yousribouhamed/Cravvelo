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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { verifyEmailSchema } from "@/src/lib/validators/auth";
import {
  Mail,
  Shield,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { maketoast } from "../toasts";
import { OTPInput } from "../otp-input";
import { useTranslations } from "next-intl";

export function VerifyEmail() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const t = useTranslations("auth.verifyEmail");
  const [isLoading, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");
  const [isResending, setIsResending] = React.useState<boolean>(false);
  const [timeLeft, setTimeLeft] = React.useState<number>(0);

  // Timer for resend button
  React.useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Form setup
  const form = useForm<z.infer<typeof verifyEmailSchema>>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
  });

  // Watch for form changes to auto-submit when complete
  const watchedCode = form.watch("code");
  React.useEffect(() => {
    if (watchedCode && watchedCode.length === 6 && !isLoading) {
      form.handleSubmit(onSubmit)();
    }
  }, [watchedCode, isLoading, form]);

  // Submit handler
  function onSubmit(data: z.infer<typeof verifyEmailSchema>) {
    if (!isLoaded) return;

    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code: data.code,
        });

        if (completeSignUp.status !== "complete") {
          console.log(JSON.stringify(completeSignUp, null, 2));
          setError(t("invalidCode"));
          form.setValue("code", ""); // Clear the form
          return;
        }

        if (completeSignUp.status === "complete") {
          await setActive({ session: completeSignUp.createdSessionId });
          setSuccess(t("success"));

          // maketoast.successWithText({
          //   text: "تم تأكيد البريد الإلكتروني بنجاح",
          // });
          maketoast.success();

          setTimeout(() => {
            router.push(`/auth-callback`);
          }, 1500);
        }
      } catch (err) {
        console.log(err);
        setError(t("error"));
        form.setValue("code", ""); // Clear the form
      }
    });
  }

  // Handle resend verification code
  const handleResendCode = async () => {
    if (!isLoaded || !signUp || timeLeft > 0) return;

    setIsResending(true);
    setError("");
    setSuccess("");

    try {
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setSuccess(t("resendSuccess"));
      setTimeLeft(60); // 60 seconds cooldown

      // maketoast.successWithText({
      //   text: "تم إرسال رمز التحقق الجديد بنجاح",
      // });

      maketoast.success();
    } catch (err) {
      console.log(err);
      setError(t("error"));
    } finally {
      setIsResending(false);
    }
  };

  // Get user's email from signUp
  const userEmail = signUp?.emailAddress;

  return (
    <Card className="w-full max-w-lg  border shadow ">
      <CardHeader className="space-y-4 pb-6">
        <div className="flex flex-col items-center space-y-6">
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
          <div className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("title")}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {t("subtitle")}
              {userEmail && (
                <span className="block font-medium text-gray-900 dark:text-white mt-1">
                  {userEmail}
                </span>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3">
              <p className="text-sm text-green-800 dark:text-green-300 leading-relaxed">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3">
              <p className="text-sm text-red-800 dark:text-red-300 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* OTP Input Fields */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-200 font-medium flex items-center gap-2 justify-center">
                    <Mail className="w-4 h-4" />
                    {t("codeLabel")}
                  </FormLabel>
                  <FormControl>
                    <OTPInput
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                      error={!!form.formState.errors.code}
                      className="mt-4"
                    />
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />

            {/* Auto-submit message */}
            {watchedCode && watchedCode.length < 6 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {t("autoVerifyMessage")}
              </p>
            )}

            {/* Manual Submit Button (hidden when auto-submitting) */}
            {(!watchedCode || watchedCode.length < 6) && (
              <Button
                type="submit"
                disabled={isLoading || !watchedCode || watchedCode.length < 6}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600"
                loading={isLoading}
              >
                {isLoading ? t("verifying") : t("submitButton")}
              </Button>
            )}
          </form>
        </Form>

        {/* Resend Code Section */}
        <div className="flex flex-col items-center space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-300 text-sm text-center">{t("didntReceiveCode")}</p>
          <Button
            variant="ghost"
            onClick={handleResendCode}
            disabled={isResending || timeLeft > 0}
            className="h-auto p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:text-gray-400 dark:disabled:text-gray-500"
          >
            {isResending ? (
              <RefreshCw className="w-4 h-4 ml-1 animate-spin" />
            ) : timeLeft > 0 ? (
              <Clock className="w-4 h-4 ml-1" />
            ) : (
              <RefreshCw className="w-4 h-4 ml-1" />
            )}
            {timeLeft > 0
              ? t("resendIn", { seconds: timeLeft })
              : isResending
              ? t("resending")
              : t("resendCode")}
          </Button>
        </div>

        {/* Back to Sign Up Link */}
        <div className="text-center pt-2">
          <Link
            href="/sign-up"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors inline-flex items-center gap-2 text-sm"
          >
            {t("backToSignUp")}
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
