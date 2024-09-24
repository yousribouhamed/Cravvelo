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

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
});

interface AddSeoFormProps {
  title: string | null;
  description: string | null;
  lang: string;
}

const SeoForm: FC<AddSeoFormProps> = ({ description, title, lang }) => {
  const mutation = trpc.addWebSiteSeo.useMutation({
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
      title: title ? title : "",
      description: description ? description : "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await mutation.mutateAsync({
      title: data.title,
      description: data.description,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border rounded-2xl">
          <CardHeader>
            <CardTitle> عنوان علامة تبويب المتصفح</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>سيظهر هذا في محرك البحث.</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    استخدم شيئًا سيبحث عنه الناس
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> هنا حاول أن تصف أكاديميتك .</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-[140px]" />
                  </FormControl>
                  <FormDescription>
                    استخدم شيئًا سيبحث عنه الناس
                  </FormDescription>
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

export default SeoForm;
