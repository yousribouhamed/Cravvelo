"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { PasswordInput } from "@/src/components/password-input";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { authSchemaLogin } from "@/src/lib/validators/auth";
import { catchClerkError } from "@/src/lib/utils";
import { sign_in_as_student } from "../../actions/auth";
import { LoadingSpinner } from "@ui/icons/loading-spinner";

type Inputs = z.infer<typeof authSchemaLogin>;

interface AcademySifnIpFormProps {
  accountId: string;
}

export function AcademySignIpForm({ accountId }: AcademySifnIpFormProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(authSchemaLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(data: z.infer<typeof authSchemaLogin>) {
    try {
      setIsLoading(true);
      await sign_in_as_student({
        email: data.email,
        password: data.password,
      });
      router.push("/student-library");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-[480px] pt-4 min-h-[501.39px] h-fit ">
      <CardHeader>
        <CardTitle>مرحبًا بعودتك!</CardTitle>
      </CardHeader>
      <CardContent>
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
              className="w-full text-white font-bold bg-blue-500"
            >
              {isLoading ? <LoadingSpinner /> : null}
              تسجيل الدخول
            </Button>
          </form>
        </Form>
        <div className="w-full my-4 h-[20px] flex justify-center">
          <span>
            ليس لديك حساب؟{" "}
            <Link href={"/auth-academy/sign-up"}>
              <span className="text-blue-500">أنشئ حساب الآن</span>
            </Link>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
