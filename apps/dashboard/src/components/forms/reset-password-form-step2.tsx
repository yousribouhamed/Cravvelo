"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "@/src/lib/zod-error-map";
import { Button } from "@ui/components/ui/button";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
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
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { resetPasswordSchema } from "@/src/lib/validators/auth";
import { catchClerkError } from "@/src/lib/utils";
import { PasswordInput } from "../password-input";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "../toasts";

type Inputs = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordStep2Form() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [isPending, startTransition] = React.useTransition();

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      code: "",
    },
  });

  function onSubmit(data: Inputs) {
    if (!isLoaded) return;

    startTransition(async () => {
      try {
        const attemptFirstFactor = await signIn.attemptFirstFactor({
          strategy: "reset_password_email_code",
          code: data.code,
          password: data.password,
        });

        if (attemptFirstFactor.status === "needs_second_factor") {
          // TODO: implement 2FA (requires clerk pro plan)
        } else if (attemptFirstFactor.status === "complete") {
          await setActive({
            session: attemptFirstFactor.createdSessionId,
          });
          router.push(`${window.location.origin}/`);

          maketoast.successWithText({
            text: "تم إعادة تعيين كلمة المرور بنجاح.",
          });
        } else {
          console.error(attemptFirstFactor);
        }
      } catch (err) {
        catchClerkError(err);
      }
    });
  }
  return (
    <Card className="w-[480px] pt-4 min-h-[250px] h-fit ">
      <CardHeader>
        <CardTitle>غير كلمة المرور الخاصة بك</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الرمز</FormLabel>
                  <FormControl>
                    <Input placeholder="******" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormDescription>أدخل الرمز الذي أرسلناه لك</FormDescription>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور </FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="أدخِل كلمة المرور" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تأكيد كلمة المرور</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="أدخِل كلمة المرور" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isPending}
              data-ripple-light="true"
              type="submit"
              size="lg"
              className="w-full text-white font-bold bg-primary flex items-center justify-center gap-x-4 rounded-xl"
            >
              تغيير كلمة المرور
              {isPending && <LoadingSpinner />}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
