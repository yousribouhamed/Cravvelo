"use client";

import type { FC } from "react";
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
import { Button } from "@ui/components/ui/button";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ChargilyConnectSchema } from "@/src/lib/validators/payments";
import { Input } from "@ui/components/ui/input";
import { trpc } from "@/src/app/_trpc/client";
import React from "react";
import { maketoast } from "../toasts";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import Image from "next/image";
import { PaymentsConnect } from "database";

type Inputs = z.infer<typeof ChargilyConnectSchema>;

interface PaymentMethodsConnectorsProps {
  data: PaymentsConnect;
}

const ChargilyConnector: FC<PaymentMethodsConnectorsProps> = ({ data }) => {
  const router = useRouter();

  const mutation = trpc.create_user_chargily.useMutation({
    onSuccess: () => {
      maketoast.success(), router.back();
    },
    onError: () => {
      maketoast.error();
    },
  });

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(ChargilyConnectSchema),
    defaultValues: {
      chargilyPrivateKey: data?.chargiySecretKey ? data?.chargiySecretKey : "",
      chargilyPublicKey: data?.chargilyPublicKey ? data?.chargilyPublicKey : "",
    },
  });

  function onSubmit(data: Inputs) {
    console.log(data);
    console.log("here it is the data");
    mutation.mutate({
      private_key: data.chargilyPrivateKey,
      public_key: data.chargilyPublicKey,
    });
  }

  return (
    <Card className="w-full h-[800px]  my-8 rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-start gap-x-2">
          <Image
            src="/chargily.jpg"
            alt="chargily image"
            width={50}
            height={50}
            className="object-fill rounded-xl"
          />
          <CardTitle> الاتصال ب chargily</CardTitle>
        </div>

        <CardDescription className="my-2">
          منصة لمعالجة الدفع تمكن الشركات من قبول المدفوعات عبر الإنترنت وإدارة
          المعاملات المالية بشكل آمن وفعال.
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full h-fit relative ">
        <div className="w-[50px] h-[50px] rounded-[50%] bg-violet-500 flex items-center justify-center absolute top-1 right-4">
          <span className="text-white font-bold">1</span>
        </div>
        <div className="w-2 border-l-4 border-violet-500 h-[450px] absolute  top-2 right-8" />
        <div className="w-[50px] h-[50px] rounded-[50%] bg-violet-500 flex items-center justify-center absolute top-[300px] right-4">
          <span className="text-white font-bold">2</span>
        </div>
        <div className="w-[50px] h-[50px] rounded-[50%] bg-violet-500 flex items-center justify-center absolute top-[450px] right-4">
          <span className="text-white font-bold">3</span>
        </div>
        <div className="w-full h-fit mr-[100px]">
          <h2 className="text-lg font-bold">الخطوة الاولى</h2>
          <p className="text-md ">
            انتقل إلى لوحة تحكم chargily حيث يمكنك العثور على مفتاحك العام
            والخاص، وقم بنسخهما والموضوع السابق هنا
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2 my-4 max-w-sm"
              id="chargily-form"
            >
              <FormField
                control={form.control}
                name="chargilyPublicKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> المفتاح العام </FormLabel>
                    <FormControl>
                      <Input placeholder="ieebr4umff" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chargilyPrivateKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المفتاح الخاص </FormLabel>
                    <FormControl>
                      <Input placeholder="kwuyydnnn" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <div className="my-4 mt-16">
            <h2 className="text-lg font-bold">الخطوة الثانية</h2>
            <p className="text-md ">
              قم بنسخ الرابط ادناه و قم بوضعه في خانة خطافات الويب في لوحة تحكم
              شارجيلي
            </p>
          </div>
          <div className="w-full h-[50px] flex items-center justify-start my-4">
            <div className="w-fit flex items-center justify-start gap-x-4 max-w-xl border rounded-xl p-2">
              <span className="text-xs font-bold ">
                https://jadir.vercel.app/api/webhooks/chargily/client
              </span>

              <Button
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(
                    "https://jadir.vercel.app/api/webhooks/chargily/client"
                  );
                  maketoast.info();
                }}
                variant="ghost"
              >
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.5 12V14.25C10.5 14.664 10.164 15 9.75 15H3.25C3.05109 15 2.86032 14.921 2.71967 14.7803C2.57902 14.6397 2.5 14.4489 2.5 14.25V5.75C2.5 5.336 2.836 5 3.25 5H4.5C4.83505 4.99977 5.16954 5.02742 5.5 5.08267M10.5 12H12.75C13.164 12 13.5 11.664 13.5 11.25V8C13.5 5.02667 11.338 2.55933 8.5 2.08267C8.16954 2.02742 7.83505 1.99977 7.5 2H6.25C5.836 2 5.5 2.336 5.5 2.75V5.08267M10.5 12H6.25C6.05109 12 5.86032 11.921 5.71967 11.7803C5.57902 11.6397 5.5 11.4489 5.5 11.25V5.08267M13.5 9.5V8.25C13.5 7.65326 13.2629 7.08097 12.841 6.65901C12.419 6.23705 11.8467 6 11.25 6H10.25C10.0511 6 9.86032 5.92098 9.71967 5.78033C9.57902 5.63968 9.5 5.44891 9.5 5.25V4.25C9.5 3.95453 9.4418 3.66195 9.32873 3.38896C9.21566 3.11598 9.04992 2.86794 8.84099 2.65901C8.63206 2.45008 8.38402 2.28435 8.11104 2.17127C7.83806 2.0582 7.54547 2 7.25 2H6.5"
                    stroke="black"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </Button>
            </div>
          </div>
          <div className="my-4 mt-10">
            <h2 className="text-lg font-bold">الخطوة الثالثة</h2>
            <p className="text-md ">قم بحفظ التغيرات</p>
          </div>
          <Button
            disabled={mutation.isLoading}
            type="submit"
            className=" flex rounded-xl bg-violet-500 hover:bg-violet-600 items-center gap-x-2 my-4"
            size="lg"
            form="chargily-form"
          >
            {mutation.isLoading ? <LoadingSpinner /> : null}
            حفظ التغييرات
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChargilyConnector;
