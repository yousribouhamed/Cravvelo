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
import { FAVE_ICON_AR, FAVE_ICON_EN } from "@cravvelo/i18n";
const formSchema = z.object({
  logoUrl: z.string(),
});

interface FavIconFormProps {
  logoUrl: string | null;
  lang: string;
}

const FavIconForm: FC<FavIconFormProps> = ({ logoUrl, lang }) => {
  const FAVE_ICON = lang === "en" ? FAVE_ICON_EN : FAVE_ICON_AR;
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
            <CardTitle> {FAVE_ICON.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{FAVE_ICON.desc}</FormLabel>
                  <FormControl>
                    <ImageUploaderS3
                      fileUrl={form.watch("logoUrl")}
                      onChnage={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>{FAVE_ICON.warn}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter
            className={`w-full h-[70px] flex items-center ${
              lang === "en" ? "justify-end" : "justify-start"
            } `}
          >
            <Button
              className=" flex items-center gap-x-2"
              disabled={!form.formState.isDirty || mutation.isLoading}
              type="submit"
            >
              {mutation.isLoading ? <LoadingSpinner /> : null}
              {lang === "en" ? "save" : "تاكيد"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default FavIconForm;
