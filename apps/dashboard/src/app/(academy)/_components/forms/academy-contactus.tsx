"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Textarea } from "@ui/components/ui/textarea";
import { Input } from "@ui/components/ui/input";

const formSchema = z.object({
  username: z.string({ required_error: "يرجى ملئ الحقل" }).min(2).max(50),
  email: z.string({ required_error: "يرجى ملئ الحقل" }).min(2).max(50),
  message: z.string({ required_error: "يرجى ملئ الحقل" }).min(2).max(50),
});

import type { FC } from "react";

interface ContactUsFormProps {
  color: string;
}

const ContactUsAcademiaForm: FC<ContactUsFormProps> = ({ color }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full h-fit min-h-full"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                الاسم الكامل <span className="text-red-500 text-xl ">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="عبدالله " {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                البريد الالكتروني{" "}
                <span className="text-red-500 text-xl ">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="example@gmail.com" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                الرسالة <span className="text-red-500 text-xl ">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="لا تتردد في الاتصال بنا إذا كان لديك أي نوع من الاستفسار"
                  className=" min-h-[150px]"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex items-center justify-end">
          <Button
            className=" flex items-center justify-center  text-white rounded-xl"
            type="submit"
            size="lg"
            style={{
              backgroundColor: color,
            }}
          >
             ارسال
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactUsAcademiaForm;
