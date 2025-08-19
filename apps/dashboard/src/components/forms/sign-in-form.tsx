"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "@/src/lib/zod-error-map";
import { Button } from "@ui/components/ui/button";
import { Checkbox } from "@ui/components/ui/checkbox";
import {
  Card,
  CardContent,
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
import { Input } from "@ui/components/ui/input";
import Link from "next/link";
import { PasswordInput } from "../password-input";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { authSchemaLogin } from "@/src/lib/validators/auth";
import { catchClerkError } from "@/src/lib/utils";
import { OAuthSignIn } from "../auth/oauth-signin";
import Image from "next/image";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

type Inputs = z.infer<typeof authSchemaLogin>;

const STORAGE_KEYS = {
  EMAIL: "cravvelo_email",
  REMEMBER: "cravvelo_remember",
  PASSWORD: "cravvelo_password",
} as const;

export function SignInForm() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [rememberMe, setRememberMe] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [success, setSuccess] = React.useState<string>("");

  const form = useForm<Inputs>({
    resolver: zodResolver(authSchemaLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem(STORAGE_KEYS.EMAIL);
      const savedRememberMe =
        localStorage.getItem(STORAGE_KEYS.REMEMBER) === "true";
      const savedPassword = localStorage.getItem(STORAGE_KEYS.PASSWORD);

      if (savedRememberMe && savedEmail) {
        form.setValue("email", savedEmail);
        setRememberMe(true);

        // Optional: restore password if you want (less secure)
        if (savedPassword) {
          form.setValue("password", savedPassword);
        }
      }
    } catch (error) {
      console.error("Error loading saved credentials:", error);
      // Clear potentially corrupted data
      localStorage.removeItem(STORAGE_KEYS.EMAIL);
      localStorage.removeItem(STORAGE_KEYS.REMEMBER);
      localStorage.removeItem(STORAGE_KEYS.PASSWORD);
    }
  }, [form]);

  // Save or clear credentials based on remember me state
  const handleCredentialStorage = (
    email: string,
    password: string,
    remember: boolean
  ) => {
    try {
      if (remember) {
        localStorage.setItem(STORAGE_KEYS.EMAIL, email);
        localStorage.setItem(STORAGE_KEYS.REMEMBER, "true");
        // Optional: save password (less secure, consider removing this)
        localStorage.setItem(STORAGE_KEYS.PASSWORD, password);
      } else {
        localStorage.removeItem(STORAGE_KEYS.EMAIL);
        localStorage.removeItem(STORAGE_KEYS.REMEMBER);
        localStorage.removeItem(STORAGE_KEYS.PASSWORD);
      }
    } catch (error) {
      console.error("Error saving credentials:", error);
    }
  };

  async function onSubmit(data: z.infer<typeof authSchemaLogin>) {
    if (!isLoaded) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      setIsLoading(true);
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

        // Save or clear credentials based on remember me checkbox
        handleCredentialStorage(data.email, data.password, rememberMe);

        setSuccess("تم تسجيل الدخول بنجاح!");

        // Add a slight delay to show success message
        setTimeout(() => {
          router.push(`/auth-callback`);
        }, 1000);
      } else {
        setError("فشل في تسجيل الدخول. يرجى المحاولة مرة أخرى.");
        console.log(result);
      }
    } catch (err) {
      console.log(err);
      setError("حدث خطأ أثناء تسجيل الدخول. يرجى التحقق من بياناتك.");
      catchClerkError(err);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle remember me checkbox change
  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);

    // If unchecked, immediately clear stored credentials
    if (!checked) {
      try {
        localStorage.removeItem(STORAGE_KEYS.EMAIL);
        localStorage.removeItem(STORAGE_KEYS.REMEMBER);
        localStorage.removeItem(STORAGE_KEYS.PASSWORD);
      } catch (error) {
        console.error("Error clearing credentials:", error);
      }
    }
  };

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
              مرحبًا بعودتك!
            </CardTitle>
            <p className="text-gray-600 text-sm">سجّل دخولك للوصول إلى حسابك</p>
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

        {/* OAuth Sign In */}
        <OAuthSignIn />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">أو</span>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
            className="space-y-5"
          >
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
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
                  <FormLabel className="text-gray-700 font-medium">
                    كلمة المرور
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <PasswordInput
                        placeholder="أدخِل كلمة المرور"
                        className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors "
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    handleRememberMeChange(checked === true)
                  }
                  className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm text-gray-700 cursor-pointer select-none"
                >
                  تذكَّر بياناتي
                </label>
              </div>
              <Link
                href="/sign-in/reset-password"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className={"w-full h-11"}
              loading={isLoading}
            >
              تسجيل الدخول
            </Button>
          </form>
        </Form>

        {/* Sign Up Link */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-gray-600 text-sm">
            ليس لديك حساب؟{" "}
            <Link
              href="/sign-up"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              أنشئ حساب الآن
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
