"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { useRouter } from "next/navigation";
import {
  restPasswordStep2,
  verifyEmailSchema,
} from "@/src/lib/validators/auth";
import { sendRestPasswordEmail } from "../../_actions/auth";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";

type Inputs = z.infer<typeof restPasswordStep2>;

interface AcademyRestPasswordStep1FormProps {
  accountId: string;
  color: string;
}

export function AcademyRestPasswordStep1Form({
  accountId,
  color,
}: AcademyRestPasswordStep1FormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isEmailSent, setIsEmailSent] = React.useState<boolean>(false);

  const router = useRouter();

  const form = useForm<Inputs>({
    resolver: zodResolver(restPasswordStep2),
  });

  async function onSubmit(data: z.infer<typeof restPasswordStep2>) {
    try {
      setIsLoading(true);
      await sendRestPasswordEmail({ accountId, email: data.email });

      setIsEmailSent(true);
      maketoast.successWithText({
        text: "تم ارسال البريد الالكتروني الى حسابك",
      });

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
        <CardTitle>اعادة تعيين كلمة المرور</CardTitle>
        <CardDescription>
          أدخل عنوان بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور
          الخاصة بك.
        </CardDescription>
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
                  <FormControl>
                    <Input
                      className="focus:border-black"
                      placeholder="example@email.com"
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
              ارسل الى هذا العنوان
            </Button>
          </form>
        </Form>
        {isEmailSent && (
          <div>
            <p>the email has been sent to yur inbox</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
