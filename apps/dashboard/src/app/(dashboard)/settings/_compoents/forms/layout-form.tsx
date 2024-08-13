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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { Textarea } from "@ui/components/ui/textarea";
import { maketoast } from "@/src/components/toasts";

interface DisableSalesFormProps {
  dCoursesHomeScreen: boolean;
  dDigitalProductsHomeScreen: boolean;
  itemsAlignment: boolean;
  enableSalesBanner: boolean;
}

const formSchema = z.object({
  dCoursesHomeScreen: z.boolean(),
  dDigitalProductsHomeScreen: z.boolean(),
  itemsAlignment: z.boolean(),
  enableSalesBanner: z.boolean(),
});

const WebsiteLayoutForm: FC<DisableSalesFormProps> = ({
  dCoursesHomeScreen,
  dDigitalProductsHomeScreen,
  enableSalesBanner,
  itemsAlignment,
}) => {
  const mutation = trpc.changeLayoutSettings.useMutation({
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
      dCoursesHomeScreen,
      dDigitalProductsHomeScreen,
      enableSalesBanner,
      itemsAlignment,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await mutation.mutateAsync({
      dCoursesHomeScreen: data.dCoursesHomeScreen,
      dDigitalProductsHomeScreen: data.dDigitalProductsHomeScreen,
      enableSalesBanner: data.enableSalesBanner,
      itemsAlignment: data.itemsAlignment,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border rounded-xl shadow-none">
          <CardHeader>
            <CardTitle>بعض الإعدادات العامة</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
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

export default WebsiteLayoutForm;
