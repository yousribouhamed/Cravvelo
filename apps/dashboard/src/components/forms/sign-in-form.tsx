"use client";

import React from "react";
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
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import Image from "next/image";

type Inputs = z.infer<typeof authSchemaLogin>;
export function SignInForm() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(authSchemaLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof authSchemaLogin>) {
    if (!isLoaded) {
      return;
    }

    try {
      setIsLoading(true);
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(`/auth-callback`);
      } else {
        /*Investigate why the login hasn't completed */
        console.log(result);
      }
    } catch (err) {
      console.log(err);
      catchClerkError(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-[480px] pt-4 min-h-[501.39px] h-fit ">
      <CardHeader>
        <div className="flex items-center justify-between ">
          <CardTitle>مرحبًا بعودتك!</CardTitle>
          <div>
            <Image
              src="/Cravvelo_Logo-01.svg"
              alt="logo"
              width={160}
              height={60}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <OAuthSignIn />

        <Form {...form}>
          <form
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخِل عنوان البريد الإلكتروني"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="أدخِل كلمة المرور" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full h-[20px] flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" className="ml-2" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  تذكَّر بياناتي
                </label>
              </div>
              <Link href={"/sign-in/reset-password"}>
                <span className="text-[#3B82F6]">هل نسيت كلمة مرورك؟</span>
              </Link>
            </div>
            <Button
              data-ripple-light="true"
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full text-white font-bold bg-primary rounded-xl flex items-center justify-center gap-x-4"
            >
              تسجيل الدخول
              {isLoading && <LoadingSpinner />}
            </Button>
          </form>
        </Form>
        <div className="w-full my-4 h-[20px] flex justify-center">
          <span>
            ليس لديك حساب؟{" "}
            <Link href={"/sign-up"}>
              <span className="text-primary">أنشئ حساب الآن</span>
            </Link>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
