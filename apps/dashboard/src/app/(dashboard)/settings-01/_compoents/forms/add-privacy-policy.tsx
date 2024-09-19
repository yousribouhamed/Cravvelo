"use client";

import type { FC } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/ui/card";
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
import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";
import { PlateEditor } from "@/src/components/reich-text-editor/rich-text-editor";

const formSchema = z.object({
  policy: z.any(),
});

interface AddPrivicyPolicyProps {
  policy: any;
}

const AddPrivicyPolicy: FC<AddPrivicyPolicyProps> = ({ policy }) => {
  const mutation = trpc.addPolicy.useMutation({
    onSuccess: () => {
      maketoast.success();
    },
    onError: () => {
      maketoast.error();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      policy: policy ? JSON.parse(policy as string) : defaultPolicy,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await mutation.mutateAsync({
      policy: data.policy,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border rounded-xl shadow-none">
          <CardHeader>
            <CardTitle>سياسة الأكاديمية</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="policy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    اقرأ هذا القالب وانقر فوق &quot;حفظ&quot; لتنقذ نفسك
                    وعملائك.
                  </FormLabel>
                  <FormControl>
                    <PlateEditor
                      value={form.getValues("policy")}
                      onChnage={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              className=" flex items-center gap-x-2"
              disabled={mutation.isLoading}
              type="submit"
            >
              {mutation.isLoading ? <LoadingSpinner /> : null}
              تاكيد
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default AddPrivicyPolicy;

const defaultPolicy = [
  {
    type: "p",
    children: [
      {
        text: "سياسة الاستخدام والخصوصية",
        bold: true,
      },
    ],
    id: "le74b",
  },
  {
    type: "h3",
    children: [
      {
        text: "سياسة الاستخدام",
      },
    ],
    id: "d4tuc",
  },
  {
    type: "h4",
    children: [
      {
        text: "١. قبول الشروط",
      },
    ],
    id: "8vniq",
  },
  {
    type: "p",
    children: [
      {
        text: "بدخولك إلى موقعنا واستخدام خدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يجب عليك التوقف عن استخدام الموقع والخدمات.",
      },
    ],
    id: "epu7q",
  },
  {
    type: "h4",
    children: [
      {
        text: "٢. تعديل الشروط",
      },
    ],
    id: "o5tnk",
  },
  {
    type: "p",
    children: [
      {
        text: "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعارك بأي تغييرات عبر البريد الإلكتروني أو عن طريق إشعار على الموقع. يعتبر استمرارك في استخدام الموقع بعد نشر التغييرات موافقة منك على الشروط المعدلة.",
      },
    ],
    id: "d9l6q",
  },
  {
    type: "h4",
    children: [
      {
        text: "٣. استخدام الموقع",
      },
    ],
    id: "7b2s5",
  },
  {
    type: "p",
    listStyleType: "",
    indent: 0,
    children: [
      {
        text: "يجب استخدام الموقع لأغراض قانونية فقط.",
      },
    ],
    id: "wv6ow",
  },
  {
    type: "p",
    listStyleType: "",
    indent: 0,
    children: [
      {
        text: "لا يجوز لك استخدام الموقع لنقل أو نشر أي مواد غير قانونية، مسيئة، أو مسيئة بأي شكل.",
      },
    ],
    id: "ymatf",
  },
  {
    type: "p",
    listStyleType: "",
    indent: 0,
    children: [
      {
        text: "نحن نحتفظ بالحق في تعليق أو إنهاء حسابك إذا تبين لنا أنك انتهكت هذه الشروط.",
      },
    ],
    id: "4ziq0",
  },
  {
    type: "h3",
    children: [
      {
        text: "سياسة الخصوصية",
      },
    ],
    id: "ziw80",
  },
  {
    type: "h4",
    children: [
      {
        text: "١. جمع المعلومات",
      },
    ],
    id: "zvus2",
  },
  {
    type: "p",
    children: [
      {
        text: "نقوم بجمع المعلومات الشخصية التي تقدمها لنا عند التسجيل في الموقع، شراء المنتجات، أو استخدام الخدمات. تشمل هذه المعلومات على سبيل المثال لا الحصر: الاسم، عنوان البريد الإلكتروني، العنوان البريدي، معلومات الدفع.",
      },
    ],
    id: "41s8v",
  },
  {
    type: "h4",
    children: [
      {
        text: "٢. استخدام المعلومات",
      },
    ],
    id: "6oo0n",
  },
  {
    type: "p",
    children: [
      {
        text: "نستخدم المعلومات التي نجمعها من أجل:",
      },
    ],
    id: "e2d5q",
  },
  {
    type: "p",
    listStyleType: "",
    indent: 0,
    children: [
      {
        text: "معالجة طلباتك وإدارة حسابك.",
      },
    ],
    id: "aqf2u",
  },
  {
    type: "p",
    listStyleType: "",
    indent: 0,
    children: [
      {
        text: "تحسين خدماتنا وتخصيص تجربتك.",
      },
    ],
    id: "h8i9p",
  },
  {
    type: "p",
    listStyleType: "",
    indent: 0,
    children: [
      {
        text: "إرسال الإشعارات والعروض الخاصة.",
      },
    ],
    id: "rjddi",
  },
  {
    type: "h4",
    children: [
      {
        text: "٣. مشاركة المعلومات",
      },
    ],
    id: "0u8jw",
  },
  {
    type: "p",
    listStyleType: "",
    indent: 0,
    children: [
      {
        text: "لا نقوم ببيع أو تأجير معلوماتك الشخصية لأطراف ثالثة.",
      },
    ],
    id: "siamo",
  },
  {
    type: "p",
    listStyleType: "",
    indent: 0,
    children: [
      {
        text: "قد نشارك معلوماتك مع الأطراف الثالثة الموثوقة التي تساعدنا في تشغيل الموقع وتقديم الخدمات، بشرط أن توافق هذه الأطراف على الحفاظ على سرية المعلومات.",
      },
    ],
    id: "nu2pi",
  },
  {
    type: "p",
    listStyleType: "",
    indent: 0,
    children: [
      {
        text: "قد نكشف عن معلوماتك إذا طُلب منا ذلك بموجب القانون أو للامتثال لأوامر قضائية.",
      },
    ],
    id: "9rfrh",
  },
  {
    type: "h4",
    children: [
      {
        text: "٤. حماية المعلومات",
      },
    ],
    id: "8o767",
  },
  {
    type: "p",
    children: [
      {
        text: "نلتزم بحماية معلوماتك الشخصية من الوصول غير المصرح به أو التعديل أو الكشف. نستخدم مجموعة متنوعة من الإجراءات الأمنية، بما في ذلك التشفير والجدران النارية، لضمان حماية بياناتك.",
      },
    ],
    id: "4gmnx",
  },
  {
    type: "h4",
    children: [
      {
        text: "٥. حقوقك",
      },
    ],
    id: "gkiy6",
  },
  {
    type: "p",
    children: [
      {
        text: "لديك الحق في:",
      },
    ],
    id: "r4gn9",
  },
  {
    type: "p",
    listStyleType: "",
    indent: 0,
    children: [
      {
        text: "الوصول إلى المعلومات الشخصية التي نحتفظ بها عنك.",
      },
    ],
    id: "47dy2",
  },
  {
    type: "p",
    listStyleType: "",
    indent: 0,
    children: [
      {
        text: "طلب تحديث أو تصحيح المعلومات غير الدقيقة.",
      },
    ],
    id: "wov9p",
  },
  {
    type: "p",
    listStyleType: "",
    indent: 0,
    children: [
      {
        text: "طلب حذف المعلومات الشخصية، مع مراعاة بعض الاستثناءات القانونية.",
      },
    ],
    id: "02pg5",
  },
  {
    type: "h4",
    children: [
      {
        text: "",
      },
    ],
    id: "kzsgu",
  },
  {
    type: "p",
    children: [
      {
        text: "",
      },
    ],
    id: "6w98o",
  },
];
