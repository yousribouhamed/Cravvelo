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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
import { Checkbox } from "@ui/components/ui/checkbox";

const formSchema = z.object({
  name: z
    .string({ required_error: "يرجى ملء الحقل" })
    .min(2, { message: "الاسم يجب أن يحتوي على حرفين على الأقل" })
    .max(50, { message: "الاسم طويل جداً" }),
  email: z
    .string({ required_error: "يرجى ملء الحقل" })
    .email({ message: "البريد الإلكتروني غير صحيح" }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 10, {
      message: "رقم الهاتف يجب أن يحتوي على 10 أرقام على الأقل",
    }),
  subject: z
    .string({ required_error: "يرجى اختيار موضوع الرسالة" })
    .min(1, { message: "يرجى اختيار موضوع الرسالة" }),
  message: z
    .string({ required_error: "يرجى ملء الحقل" })
    .min(10, { message: "الرسالة يجب أن تحتوي على 10 أحرف على الأقل" })
    .max(500, { message: "الرسالة طويلة جداً" }),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "يرجى اختيار أولوية الرسالة",
  }),
  newsletter: z.boolean().default(false),
  terms: z.boolean().refine((val) => val === true, {
    message: "يجب الموافقة على الشروط والأحكام",
  }),
});

import type { FC } from "react";
import { sendInquiryEmail } from "@/src/actions/email.action";
import toast from "react-hot-toast";
import React from "react";
import { LoadingSpinner } from "../../../../../../../packages/ui/icons/loading-spinner";

const ContactUsForm: FC = () => {
  const [loading, setIsLoading] = React.useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      subject: "",
      message: "",
      priority: "medium",
      newsletter: false,
      terms: false,
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

      toast.success("تم إرسال رسالتك بنجاح! سنرد عليك في أقرب وقت ممكن", {
        icon: "✅",
        style: {
          borderRadius: "10px",
          background: "#10b981",
          color: "#fff",
        },
        duration: 5000,
      });

      // Reset form after successful submission
      form.reset();
    } catch (err) {
      toast.error("فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى", {
        icon: "❌",
        style: {
          borderRadius: "10px",
          background: "#ef4444",
          color: "#fff",
        },
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full h-fit min-h-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  الاسم الكامل <span className="text-red-500 text-xl">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="عبدالله أحمد"
                    {...field}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
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
                  البريد الإلكتروني{" "}
                  <span className="text-red-500 text-xl">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@gmail.com"
                    {...field}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الهاتف (اختياري)</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+966 50 123 4567"
                    {...field}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormDescription>
                  يمكنك إضافة رقم هاتفك للتواصل السريع
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  أولوية الرسالة <span className="text-red-500 text-xl">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                      <SelectValue placeholder="اختر أولوية الرسالة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">منخفضة</SelectItem>
                    <SelectItem value="medium">متوسطة</SelectItem>
                    <SelectItem value="high">عالية</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                موضوع الرسالة <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                    <SelectValue placeholder="اختر موضوع الرسالة" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="general">استفسار عام</SelectItem>
                  <SelectItem value="technical">دعم تقني</SelectItem>
                  <SelectItem value="billing">الفواتير والدفع</SelectItem>
                  <SelectItem value="partnership">شراكة</SelectItem>
                  <SelectItem value="complaint">شكوى</SelectItem>
                  <SelectItem value="suggestion">اقتراح</SelectItem>
                </SelectContent>
              </Select>
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
                الرسالة <span className="text-red-500 text-xl">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="لا تتردد في الاتصال بنا إذا كان لديك أي نوع من الاستفسار أو تحتاج إلى مساعدة..."
                  className="min-h-[150px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {field.value?.length || 0}/500 حرف
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="newsletter"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>أريد الاشتراك في النشرة الإخبارية</FormLabel>
                  <FormDescription>
                    احصل على آخر الأخبار والتحديثات عبر البريد الإلكتروني
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    أوافق على{" "}
                    <a href="/terms" className="text-primary hover:underline">
                      الشروط والأحكام
                    </a>{" "}
                    و{" "}
                    <a href="/privacy" className="text-primary hover:underline">
                      سياسة الخصوصية
                    </a>{" "}
                    <span className="text-red-500 text-xl">*</span>
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="w-full flex items-center justify-center pt-4">
          <Button
            className="flex items-center justify-center bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-200 min-w-[120px]"
            type="submit"
            size="lg"
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : "إرسال الرسالة"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactUsForm;
