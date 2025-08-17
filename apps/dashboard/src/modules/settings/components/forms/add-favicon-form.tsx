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

interface AddFavIconFormProps {
  logoUrl: string | null;
}

const AddFavIconForm: FC<AddFavIconFormProps> = ({ logoUrl }) => {
  const mutation = trpc.addFavIcon.useMutation({
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
      fav_icon_url: data.logoUrl,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border rounded-xl shadow-none">
          <CardHeader>
            <CardTitle> إضافة أيقونة علامة التبويب إلى الموقع</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    قم بإنشاء رمز علامة التبويب المجانية الخاصة بك مجانًا من هذا
                    الموقع https://favicon.io.
                  </FormLabel>
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
              disabled={mutation.isPending}
              type="submit"
            >
              {mutation.isPending ? <LoadingSpinner /> : null}
              تاكيد
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default AddFavIconForm;
