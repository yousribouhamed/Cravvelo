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

import { Icons } from "../my-icons";
import { catchClerkError, catchError, getCookie } from "@/src/lib/utils";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "../toasts";

type Inputs = z.infer<typeof authSchema>;

export function SignUpForm() {
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof authSchema>) {
    if (!isLoaded) return;

    try {
      const cookie = getCookie("machine_id");
      if (cookie) {
        maketoast.errorWithTest({
          text: "يا اخي انت تملك حساب بالفعل",
        });
      }
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

      maketoast.successWithText({
        text: "لقد أرسلنا لك رمز التحقق المكون من 6 أرقام",
      });
    } catch (err) {
      catchClerkError(err);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
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
              className="w-full text-white font-bold rounded-xl bg-primary flex items-center justify-center gap-x-4"
            >
              أنشئ حسابك مجانًا
              {isLoading && <LoadingSpinner />}
            </Button>
          </form>
        </Form>
        <div className="w-full my-4 h-[20px] flex justify-center">
          <span>
            هل لديك حساب؟{" "}
            <Link href={"/sign-in"}>
              <span className="text-primary">سجّل الدخول.</span>
            </Link>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
