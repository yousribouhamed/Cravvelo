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
  CardDescription,
  CardFooter,
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
import Link from "next/link";
import { PasswordInput } from "../password-input";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { checkEmailSchema, verifyEmailSchema } from "@/src/lib/validators/auth";
import { Icons } from "../my-icons";
import { toast } from "@ui/lib/utils";
import { catchClerkError } from "@/src/lib/utils";

type Inputs = z.infer<typeof checkEmailSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const { isLoaded, signIn } = useSignIn();
  const [isPending, startTransition] = React.useTransition();

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(checkEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: Inputs) {
    if (!isLoaded) return;

    startTransition(async () => {
      try {
        const firstFactor = await signIn.create({
          strategy: "reset_password_email_code",
          identifier: data.email,
        });

        if (firstFactor.status === "needs_first_factor") {
          router.push("/sign-in/reset-password/step2");
          toast.message("Check your email", {
            description: "We sent you a 6-digit verification code.",
          });
        }
      } catch (err) {
        catchClerkError(err);
      }
    });
  }

  return (
    <Card className="w-[480px] pt-4 min-h-[250px] h-fit ">
      <CardHeader>
        <CardTitle>نسيت كلمة المرور</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

            <FormDescription>
              تأكّد من صحة البريد الإلكتروني، إذ سيتم إرسال رابط استكمال عملية
              استعادة كلمة المرور عبره.
            </FormDescription>
            <Button
              disabled={isPending}
              data-ripple-light="true"
              type="submit"
              size="lg"
              className="w-full text-white font-bold bg-[#43766C]"
            >
              إرسال
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
