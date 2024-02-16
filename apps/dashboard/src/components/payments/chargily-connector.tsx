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

type Inputs = z.infer<typeof ChargilyConnectSchema>;

const ChargilyConnector: FC = ({}) => {
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
      chargilyPrivateKey: "",
      chargilyPublicKey: "",
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
    <Card className="w-full h-full  my-8 rounded-2xl">
      <CardHeader>
        <CardTitle>chargily </CardTitle>
        <CardDescription>
          منصة لمعالجة الدفع تمكن الشركات من قبول المدفوعات عبر الإنترنت وإدارة
          المعاملات المالية بشكل آمن وفعال.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="chargilyPublicKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المفتاح العام الخاص ب شارجيلي</FormLabel>
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
                  <FormLabel>المفتاح الخاص الخاص ب شارجيلي</FormLabel>
                  <FormControl>
                    <Input placeholder="kwuyydnnn" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={mutation.isLoading}
              type="submit"
              className=" flex bg-violet-500 hover:bg-violet-600 items-center gap-x-2"
              size="lg"
            >
              {mutation.isLoading ? <LoadingSpinner /> : null}
              حفظ التغييرات
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChargilyConnector;
