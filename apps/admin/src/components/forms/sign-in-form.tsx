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

const formSchema = z.object({
  username: z.string().min(2).max(50),
});

export function SignInForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
            name="username"
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
            name="username"
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
          <Button size="lg" className="w-full " type="submit">
            تسجيل الدخول
          </Button>
        </form>
      </Form>
    </div>
  );
}
