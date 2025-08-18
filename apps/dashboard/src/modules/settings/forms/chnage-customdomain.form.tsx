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
import { Input } from "@ui/components/ui/input";
import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";

interface AddCustomDomain {
  customDomain: string | null;
}

const formSchema = z.object({
  cutomedomain: z.string(),
});

const AddCustomDomainForm: FC<AddCustomDomain> = ({ customDomain }) => {
  const mutation = trpc.setCustomDomain.useMutation({
    onSuccess: () => {
      maketoast.successWithText({ text: "domain has been chnaged" });
    },
    onError: (err) => {
      console.error(err);
      maketoast.error();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cutomedomain: customDomain ? customDomain : "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await mutation.mutateAsync({
      customdomain: data?.cutomedomain,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border h-full w-full rounded-xl shadow-none">
          <CardHeader>
            <CardTitle>مجال مخصص</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="cutomedomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>النطاق المخصص لموقعك.</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="yourdomain.com"
                      {...field}
                      className="flex-1 rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground mt-2">
                    أدخل النطاق الذي تريد استخدامه لموقعك (مثل: yourdomain.com).
                    اتركه فارغاً لإزالة النطاق المخصص الحالي.
                  </p>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              className="flex items-center gap-x-2"
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

export default AddCustomDomainForm;
