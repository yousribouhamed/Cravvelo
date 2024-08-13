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
import { maketoast } from "@/src/components/toasts";

const formSchema = z.object({
  color: z.string(),
});

interface ChangeDomainFormProps {
  color: string | null;
}

const AddColorFrom: FC<ChangeDomainFormProps> = ({ color }) => {
  const mutation = trpc.addWebSiteColor.useMutation({
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
      color: color ? color : "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    mutation.mutate({
      color: data.color,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border rounded-xl shadow-none w-full ">
          <CardHeader>
            <CardTitle>اللون الرئيسي للاكادمية</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="color"
                      id="colorPicker"
                      name="colorPicker"
                      className="appearance-none  p-1 w-[50px]  text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    سيظهر هذا اللون في أكاديميتك
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

export default AddColorFrom;
