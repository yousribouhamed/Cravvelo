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
import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";
import { ImageUploaderS3 } from "@/src/components/uploaders/image-uploader";

const formSchema = z.object({
  logoUrl: z.string(),
});

interface AddLogoFormProps {
  logoUrl: string | null;
}

const AddLogoForm: FC<AddLogoFormProps> = ({ logoUrl }) => {
  const mutation = trpc.addWebSiteLogo.useMutation({
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
      logoUrl: logoUrl ? logoUrl : "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await mutation.mutateAsync({
      logo: data.logoUrl,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border rounded-xl shadow-none">
          <CardHeader>
            <CardTitle>شعار الاكادمية</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>إضافة شعار إلى موقع الويب الخاص بك.</FormLabel>
                  <FormControl>
                    <ImageUploaderS3
                      fileUrl={form.watch("logoUrl")}
                      onChnage={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    يُسمح فقط باستخدام png وjpg وsvgs
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
