"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@ui/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Textarea } from "@ui/components/ui/textarea";
import { Input } from "@ui/components/ui/input";

const formSchema = z.object({
  name: z.string({ required_error: "يرجى ملئ الحقل" }).min(2).max(50),
  email: z.string({ required_error: "يرجى ملئ الحقل" }).min(2).max(50),
  message: z.string({ required_error: "يرجى ملئ الحقل" }).min(2).max(50),
});

import type { FC } from "react";
import { sendInquiryEmail } from "@/src/actions/email.action";
import toast from "react-hot-toast";
import React from "react";
import { LoadingSpinner } from "../../../../../../../packages/ui/icons/loading-spinner";

const ContactUsForm: FC = ({}) => {
  const [loading, setIsLoading] = React.useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await sendInquiryEmail({
        email: values.email,
        message: values.message,
        name: values.name,
      });

      toast("تم ارسال رسالتك شكرا", {
        icon: "😅",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (err) {
      toast.error("فشلنا في ارسال الرسالة");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full h-fit min-h-full"
      >
        <FormField
          control={form.control}
          name="name"
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

        <div className="w-full flex items-center justify-center">
          <Button
            className=" flex items-center justify-center bg-primary text-white rounded-xl"
            type="submit"
            size="lg"
          >
            {loading ? <LoadingSpinner /> : " ارسال"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactUsForm;
