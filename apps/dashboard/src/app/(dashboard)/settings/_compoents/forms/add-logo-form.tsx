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

const formSchema = z.object({
  subdomain: z
    .string()
    .min(3, {
      message: "Username must be at least 2 characters.",
    })
    .max(32),
});

interface ChangeDomainFormProps {
  subdomain: string | null;
}

const AddLogoForm: FC<ChangeDomainFormProps> = ({ subdomain }) => {
  const mutation = trpc.chnageSubDmain.useMutation({
    onSuccess: () => {},
    onError: () => {},
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subdomain: subdomain ? subdomain : "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await mutation.mutateAsync({
      subdomain: data.subdomain,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border rounded-xl shadow-none">
          <CardHeader>
            <CardTitle>النطاق الفرعي</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="subdomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>النطاق الفرعي لموقعك.</FormLabel>
                  <FormControl>
                    <Input placeholder="app.vercel.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    يرجى استخدام 32 حرفًا كحد أقصى.
                  </FormDescription>
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

export default AddLogoForm;
