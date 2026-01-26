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
import { catchClerkError } from "@/src/lib/utils";
import { maketoast } from "../toasts";
import {
  User,
  Mail,
  Lock,
  Shield,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { OAuthAuth } from "../auth/oauth-auth";

type Inputs = z.infer<typeof authSchema>;

export function SignUpForm() {
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();
  const t = useTranslations("auth.signUp");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");

  const form = useForm<Inputs>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof authSchema>) {
    if (!isLoaded) return;

    setError("");
    setSuccess("");

    try {
      setIsLoading(true);

      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      // Send email verification code
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setSuccess(t("success"));

      // Add delay to show success message
      setTimeout(() => {
        router.push("/sign-up/verify-email");
        // maketoast.successWithText({
        //   text: "لقد أرسلنا لك رمز التحقق المكون من 6 أرقام",
        // });
        maketoast.success();
      }, 1500);
    } catch (err) {
      setError(t("error"));
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
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t("title")}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-50 text-sm leading-relaxed">
              {t("subtitle")}
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

        {/* OAuth Sign Up */}
        <OAuthAuth mode="signUp" />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-backgound dark:text-gray-50 text-gray-500 ">
              {t("or")}
            </span>
          </div>
        </div>

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
                    {t("emailLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("emailPlaceholder")}
                      className="h-11 border focus:border-blue-500 focus:ring-blue-500 transition-colors"
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
                  <FormLabel className="text-gray-700 dark:text-gray-50 font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    {t("passwordLabel")}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder={t("passwordPlaceholder")}
                      className="h-11 border focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Terms and Conditions */}
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <FormDescription className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                  {t("termsText")}{" "}
                  <Link
                    href="/terms"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium underline"
                  >
                    {t("termsLink")}
                  </Link>{" "}
                  {t("and")}{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium underline"
                  >
                    {t("privacyLink")}
                  </Link>
                  {t("period")}
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
              {t("submitButton")}
            </Button>
          </form>
        </Form>

        {/* Sign In Link */}
        <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-900">
          <p className="text-gray-600 dark:text-gray-100 text-sm">
            {t("hasAccount")}{" "}
            <Link
              href="/sign-in"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {t("signIn")}
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
