"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@ui/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";

import { Input } from "@ui/components/ui/input";
import { PasswordInput } from "@/src/components/password-input";
import Link from "next/link";
import { create_student } from "../../_actions/auth";
import { useRouter } from "next/navigation";
import React from "react";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";

const formSchema = z.object({
  full_name: z.string(),
  email: z.string().email({
    message: "يرجى إدخال عنوان بريد إلكتروني صالح",
  }),
  password: z
    .string()
    .min(7, {
      message: "يجب أن تتكون كلمة المرور من 7 أحرف على الأقل",
    })
    .max(100),
});

interface AcademySifnUpFormProps {
  accountId: string;
}

export function AcademySifnUpForm({ accountId }: AcademySifnUpFormProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const user = await create_student({
        accountId,
        email: values.email,
        full_name: values.full_name,
        password: values.password,
      });

      maketoast.successWithText({ text: "لقد تم إنشاء حسابك" });

      router.push("/auth-academy/sign-in");
      // TODO :: make a toast telling the student that new account has been created
    } catch (err) {
      console.error(err);
      maketoast.error();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-[480px] pt-4 my-6 min-h-[501.39px] h-fit ">
      <CardHeader>
        <CardTitle>إنشاء حساب جديد</CardTitle>
        <CardDescription>
          قم بالتسجيل للطلاب في الأكاديمية لتتمكن من مشاهدة الدورات
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الكامل</FormLabel>
                  <FormControl>
                    <Input
                      className="focus:border-blue-500"
                      placeholder="الرجاء ادخال اسمك القانوني"
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
                      className="focus:border-blue-500"
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
                    <PasswordInput
                      className="focus:border-blue-500"
                      placeholder="أدخِل كلمة المرور"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full h-[20px] flex justify-between items-center">
              <FormDescription>
                بالضغط على زر “أنشئ حسابك مجانًا” أنت توافق على الشروط والأحكام
                الاكاديمية
              </FormDescription>
            </div>

            <Button
              data-ripple-light="true"
              disabled={isLoading}
              type="submit"
              size="lg"
              className="w-full text-white flex items-center justify-center gap-x-2 font-bold bg-primary hover:bg-blue-600  disabled:pointer-events-none disabled:opacity-50"
            >
              {isLoading ? <LoadingSpinner /> : null}
              أنشئ حسابك مجانًا
            </Button>
          </form>
        </Form>
        <div className="w-full my-4 h-[20px] flex justify-center">
          <span>
            هل لديك حساب؟{" "}
            <Link href={"/auth-academy/sign-in"}>
              <span className="text-blue-500">سجّل الدخول.</span>
            </Link>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
