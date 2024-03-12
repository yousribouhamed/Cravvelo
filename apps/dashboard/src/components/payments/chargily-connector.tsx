"use client";

import type { FC } from "react";
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
      private_key: data?.chargilyPrivateKey,
      public_key: data?.chargilyPublicKey,
    });
  }

  return (
    <Card className="w-full h-[600px]  my-8 rounded-2xl">
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
        <div className="w-2 border-l-4 border-violet-500 h-[330px] absolute  top-2 right-8" />
        <div className="w-[50px] h-[50px] rounded-[50%] bg-violet-500 flex items-center justify-center absolute top-[300px] right-4">
          <span className="text-white font-bold">2</span>
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

          <div className="my-4 mt-10">
            <h2 className="text-lg font-bold">الخطوة الثانية</h2>
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
