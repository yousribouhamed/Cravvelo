"use client";

import * as z from "zod";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { trpc } from "@/src/app/_trpc/client";
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
import { Card, CardContent } from "@ui/components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import { getValueFromUrl } from "@/src/lib/utils";

import { JadaraVoiceUpLoader } from "../../upload-voice";
import VedioUploader from "../../uploaders/VedioUploader";
import Tiptap from "../../tiptap";

const addVedioSchema = z.object({
  title: z.string().min(2).max(50),
  content: z.any(),
  fileUrl: z.string(),
});

function AddVedioForm() {
  const router = useRouter();
  const path = usePathname();
  const chapterID = getValueFromUrl(path, 4);

  const mutation = trpc.createModule.useMutation({
    onSuccess: () => {},
    onError: () => {},
  });

  const form = useForm<z.infer<typeof addVedioSchema>>({
    mode: "onChange",
    resolver: zodResolver(addVedioSchema),
    defaultValues: {
      title: "",
      fileUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof addVedioSchema>) {
    console.log("here it is file url");
    console.log(values);
    await mutation.mutateAsync({
      chapterID: chapterID,
      content: "",
      fileType: "VEDIO",
      fileUrl: values.fileUrl,
      title: values.title,
    });
  }

  return (
    <div className="w-full grid grid-cols-3 gap-x-8 ">
      <div className="col-span-2 w-full h-full">
        <Form {...form}>
          <form
            id="add-text"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    عنوان مقطع الفيديو{" "}
                    <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    إضافة ملف فيديو{" "}
                    <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <VedioUploader onChange={field.onChange} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>
                    فيديو الوصف <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <Tiptap
                      description={field.name}
                      onChnage={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <div className="col-span-1 w-full h-full ">
        <Card>
          <CardContent className="w-full h-fit flex flex-col p-6  space-y-4">
            <Button
              disabled={mutation.isLoading}
              type="submit"
              form="add-text"
              className="w-full"
              size="lg"
            >
              {" "}
              حفظ والمتابعة
            </Button>
            <Button
              onClick={() => router.back()}
              className="w-full"
              variant="secondary"
              size="lg"
            >
              {" "}
              إلغاء والعودة
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AddVedioForm;
