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
import { useRouter } from "next/navigation";
import { verifyEmailSchema } from "@/src/lib/validators/auth";
import {
  sendEmailAgain,
  sign_in_as_student,
  verifyEmailAction,
} from "../../_actions/auth";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";
import { verifyStudentEmail } from "@/src/lib/resend";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { academiatoast } from "../academia-toasts";

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

  const searchParams = useSearchParams();

  const form = useForm<Inputs>({
    resolver: zodResolver(verifyEmailSchema),
  });

  async function resendEmailAgain(email: string) {
    try {
      await sendEmailAgain({ email, accountId });
    } catch (err) {
      console.error(err);
    }
  }

  async function onSubmit(data: z.infer<typeof verifyEmailSchema>) {
    try {
      setIsLoading(true);

      await verifyEmailAction({ code: data.code });

      academiatoast.make({
        color,
        message: "تم تاكيد حسابك سجل دخولك الان",
        title: "نجاح",
        type: "SUCCESS",
      });

      router.push("/auth-academy/sign-in");
    } catch (err) {
      console.error(err);
      academiatoast.make({
        color,
        message: "حدث خطأ ما",
        title: "فشل",
        type: "ERROR",
      });
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
                      className="focus:border-black"
                      placeholder="أدخل الرمز الذي أرسلناه إلى بريدك الإلكتروني"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full my-4 h-[20px] gap-x-2 flex justify-center">
              <span>لم تتلقى بريد الكتروني ؟</span>
              <Button
                type="button"
                variant="link"
                className="text-sm "
                style={{
                  color: color ?? "#FC6B00",
                }}
                onClick={() => {
                  resendEmailAgain(searchParams.get("email")).then(() => {
                    maketoast.successWithText({
                      text: "email wa succesfully delived to you",
                    });
                  });
                }}
              >
                ارسل مجددا
              </Button>
            </div>
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
