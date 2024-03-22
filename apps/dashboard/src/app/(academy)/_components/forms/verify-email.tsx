"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@ui/components/ui/button";
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
import { useRouter, useSearchParams } from "next/navigation";
import { authSchemaLogin } from "@/src/lib/validators/auth";
import { sign_in_as_student } from "../../_actions/auth";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";

type Inputs = z.infer<typeof authSchemaLogin>;

interface AcademySifnIpFormProps {
  accountId: string;
  color: string;
}

export function AcademySignInForm({
  accountId,
  color,
}: AcademySifnIpFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const router = useRouter();

  const form = useForm<Inputs>({
    resolver: zodResolver(authSchemaLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof authSchemaLogin>) {
    try {
      setIsLoading(true);
      await sign_in_as_student({
        email: data.email,
        password: data.password,
        accountId,
      });

      maketoast.successWithText({ text: "تم تسجيل الدخول بنجاح" });
      window.location.reload();
      router.push("/auth-academy/sign-up/verify-email");
    } catch (err) {
      console.error(err);
      maketoast.error();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-[480px] pt-4 min-h-[401.39px] h-fit ">
      <CardHeader>
        <CardTitle>التحقق من البريد الإلكتروني</CardTitle>
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
                  <FormLabel>شفرة</FormLabel>
                  <FormControl>
                    <Input
                      className="focus:border-orange-500"
                      placeholder="أدخِل عنوان البريد الإلكتروني"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              data-ripple-light="true"
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-x-2 text-white font-bold   disabled:pointer-events-none disabled:opacity-50"
              style={{
                color: color ?? "#FC6B00",
              }}
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
              <span className="text-orange-500">أنشئ حساب الآن</span>
            </Link>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
