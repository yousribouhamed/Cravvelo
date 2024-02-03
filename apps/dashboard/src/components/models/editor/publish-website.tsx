"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
import { Input } from "@ui/components/ui/input";
import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@ui/components/ui/dialog";
import { Button } from "@ui/components/ui/button";
import { Textarea } from "@ui/components/ui/textarea";
import { trpc } from "@/src/app/_trpc/client";
import { WebSitePage } from "@/src/types";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { useWebSiteEditor } from "@/src/app/(editor)/editor-state";

const FormSchema = z.object({
  title: z.string(),
  description: z.string(),
  subdomain: z.string(),
});

interface publishWebsiteProps {}

const PublishWebsite: FC = () => {
  const { state } = useWebSiteEditor();
  const mutation = trpc.createWebSite.useMutation({
    onSuccess: (site) => {
      //TODO : close the model
      // do something cool

      console.log("here it is the site created");
      console.log(site);
    },
    onError: () => {
      // close the model
      // display some toast to alert the user that an error accourd
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    mutation.mutate({
      description: values.description,
      name: values.title,
      subdomain: values.subdomain,
      pages: state.editor.pages,
    });
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className=" text-white font-bold rounded-2xl bg-primary"
        >
          حفظ ونشر
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg " title="إنشاء موقع الويب الخاص بك">
        <Form {...form}>
          <form
            id="createwebsiteform"
            onSubmit={form.handleSubmit(onSubmit)}
            className=" space-y-6 p-4 w-full"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> اسم الأكاديمية</FormLabel>
                  <FormControl>
                    <Input
                      className="dark:bg-[#252525]"
                      placeholder="عنوان الموقع"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وصف موجز للموقع</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={2}
                      className="dark:bg-[#252525] h-[100px]"
                      placeholder="وصف موجز للموقع"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subdomain"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>حدد اسم المجال الخاص بك</FormLabel>
                  <Input placeholder="  حدد اسم المجال الخاص بك" {...field} />
                  <FormDescription>
                    لا تقلق كثيرًا بشأن ذلك، يمكنك إضافة نطاقك المخصص لاحقًا
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="p-4">
          <Button
            form="createwebsiteform"
            className=" flex items-center gap-x-2 font-bold rounded-xl"
            disabled={mutation.isLoading}
            type="submit"
          >
            {mutation.isLoading ? <LoadingSpinner /> : null}
            إطلاق موقع الويب الخاص بي
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PublishWebsite;
