"use client";

import { z } from "zod";

import { Button } from "ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "ui/components/ui/form";
import { Input } from "ui/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export function SignInForm() {
  const mutation = trpc.SignInAsAdmin.useMutation({
    onSuccess: () => {
      console.log("you are loged in");
    },
    onError: () => {
      console.log("you are loged out");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate({
      email: values.email,
      password: values.password,
    });
  }

  return (
    <div className="w-[400px] h-fit  bg-white border rounded-xl p-4 flex flex-col ">
      <div className="w-full h-[100px] flex items-center justify-between">
        <h1 className="text-xl font-bold">حساب المدير</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>البريد الالكتروني للمستخدم</FormLabel>
                <FormControl>
                  <Input placeholder="example@gmail.com" {...field} />
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
                <FormLabel>كلمة السر السرية</FormLabel>
                <FormControl>
                  <Input placeholder="*****" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="lg"
            disabled={mutation.isLoading}
            className="w-full text-white font-bold bg-primary rounded-xl flex items-center justify-center gap-x-4"
          >
            {mutation.isLoading && <LoadingSpinner />}
            تسجيل الدخول
          </Button>
        </form>
      </Form>
    </div>
  );
}
