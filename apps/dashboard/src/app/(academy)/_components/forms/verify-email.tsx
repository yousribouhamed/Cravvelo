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
import { verifyEmailSchema } from "@/src/lib/validators/auth";
import { sign_in_as_student, verifyEmailAction } from "../../_actions/auth";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";

type Inputs = z.infer<typeof verifyEmailSchema>;

interface AcademySifnIpFormProps {
  accountId: string;
  color: string;
}

export function AcademyVerifyEmailForm({
  accountId,
  color,
}: AcademySifnIpFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const router = useRouter();

  const form = useForm<Inputs>({
    resolver: zodResolver(verifyEmailSchema),
  });

  async function onSubmit(data: z.infer<typeof verifyEmailSchema>) {
    try {
      setIsLoading(true);

      const student = await verifyEmailAction({ code: data.code });

      maketoast.successWithText({ text: "تم تاكيد حسابك سجل دخولك الان" });

      router.push("/auth-academy/sign-in");
    } catch (err) {
      console.error(err);
      maketoast.error();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-[480px] pt-4 min-h-[200px] h-fit ">
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
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>شفرة</FormLabel>
                  <FormControl>
                    <Input
                      className="focus:border-orange-500"
                      placeholder="أدخل الرمز الذي أرسلناه إلى بريدك الإلكتروني"
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
                backgroundColor: color ?? "#FC6B00",
              }}
            >
              {isLoading ? <LoadingSpinner /> : null}
              التحقق من البريد الإلكتروني
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
