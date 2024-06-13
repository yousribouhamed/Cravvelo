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
  FormMessage,
} from "@ui/components/ui/form";
import { useRouter } from "next/navigation";
import { changeStudentpassword } from "../../_actions/auth";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";
import { PasswordInput } from "@/src/components/password-input";
import { academiatoast } from "../academia-toasts";

const formSchema = z.object({
  password: z
    .string()
    .min(7, {
      message: "يجب أن تتكون كلمة المرور من 7 أحرف على الأقل",
    })
    .max(100),
});

type Inputs = z.infer<typeof formSchema>;

interface AcademyResetPasswordFormStep2Props {
  accountId: string;
  color: string;
  studentId: string;
}

export function ResetPasswordFormStep2({
  accountId,
  studentId,
  color,
}: AcademyResetPasswordFormStep2Props) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const form = useForm<Inputs>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      await changeStudentpassword({ password: data.password, studentId });

      academiatoast.make({
        color,
        message: "تم تغير كلمة المرور",
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <PasswordInput
                      className="focus:border-black"
                      placeholder="أدخِل كلمة المرور"
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
              تغير كلمة المرور
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default ResetPasswordFormStep2;
