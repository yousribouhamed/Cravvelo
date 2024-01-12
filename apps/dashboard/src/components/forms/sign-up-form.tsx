"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@ui/components/ui/button";
import { Checkbox } from "@ui/components/ui/checkbox";
import { toast } from "@ui/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
import { useSignUp } from "@clerk/nextjs";
import React from "react";
// import { catchClerkError } from "@/lib/utils"
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

import { Icons } from "../Icons";
import { catchClerkError, catchError } from "@/src/lib/utils";

type Inputs = z.infer<typeof authSchema>;

export function SignUpForm() {
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(data: z.infer<typeof authSchema>) {
    if (!isLoaded) return;

    startTransition(async () => {
      try {
        setIsLoading(true);
        await signUp.create({
          emailAddress: data.email,
          password: data.password,
          // firstName: data.firstName,
        });

        // Send email verification code
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        router.push("/sign-up/verify-email");

        toast.success("Check your email", {
          description: "We sent you a 6-digit verification code",
        });
      } catch (err) {
        catchClerkError(err);
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    });
  }

  return (
    <Card className="w-[480px] pt-4 min-h-[501.39px] h-fit ">
      <CardHeader>
        <CardTitle>إنشاء حساب جديد</CardTitle>
        <CardDescription>
          إنشاء حساب جديد استمتع بتجربة مجانية لمدة 14 يومًا، بدون بطاقة بنكية
          أو مصاريف خفية.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم</FormLabel>
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
              <FormDescription>
                بالضغط على زر “أنشئ حسابك مجانًا” أنت توافق على الشروط والأحكام
                في مساق.
              </FormDescription>
            </div>
            <Button
              data-ripple-light="true"
              type="submit"
              disabled={isLoading}
              size="lg"
              className="w-full text-white font-bold bg-[#43766C]"
            >
              أنشئ حسابك مجانًا
              {isLoading && (
                <Icons.spinner
                  className="ml-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
            </Button>
          </form>
        </Form>
        <div className="w-full my-4 h-[20px] flex justify-center">
          <span>
            هل لديك حساب؟{" "}
            <Link href={"/sign-up"}>
              <span className="text-[#43766C]">سجّل الدخول.</span>
            </Link>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
