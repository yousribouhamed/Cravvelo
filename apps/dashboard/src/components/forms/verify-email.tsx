"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@ui/components/ui/button";
import { Checkbox } from "@ui/components/ui/checkbox";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import Link from "next/link";
import { PasswordInput } from "../password-input";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { verifyEmailSchema } from "@/src/lib/validators/auth";
import { Icons } from "../my-icons";

export function VerifyEmail() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [isPending, startTransition] = React.useTransition();

  // 1. Define your form.
  const form = useForm<z.infer<typeof verifyEmailSchema>>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      code: "",
    },
  });

  // 2. Define a data handler.
  function onSubmit(data: z.infer<typeof verifyEmailSchema>) {
    if (!isLoaded) return;

    startTransition(async () => {
      try {
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code: data.code,
        });
        if (completeSignUp.status !== "complete") {
          /*  investigate the response, to see if there was an error
             or if the user needs to complete more steps.*/
          console.log(JSON.stringify(completeSignUp, null, 2));
        }
        if (completeSignUp.status === "complete") {
          await setActive({ session: completeSignUp.createdSessionId });

          router.push(`/auth-callback`);
        }
      } catch (err) {
        console.log(err);
      }
    });
  }

  return (
    <Card className="w-[480px] pt-4 min-h-[250px] h-fit ">
      <CardHeader>
        <CardTitle>تأكيد البريد الالكتروني</CardTitle>
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

            <Button
              disabled={isPending}
              data-ripple-light="true"
              type="submit"
              size="lg"
              className="w-full text-white font-bold bg-[#43766C]"
            >
              تسجيل الدخول
              {isPending && (
                <Icons.spinner
                  className="ml-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
