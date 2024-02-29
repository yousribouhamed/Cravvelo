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
import VedioUploader from "@/src/components/uploaders/VedioUploader";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { PlateEditor } from "@/src/components/reich-text-editor/rich-text-editor";
import { maketoast } from "@/src/components/toasts";
import VideoPlayer from "@/src/components/models/video-player";
import { Module } from "@/src/types";

const updateVedioSchema = z.object({
  title: z.string().min(2).max(50),
  content: z.any(),
  fileUrl: z.string(),
});

interface UpdateVedioFormProps {
  material: Module;
}

function UpdateVedioForm({ material }: UpdateVedioFormProps) {
  const router = useRouter();
  const path = usePathname();
  const chapterID = getValueFromUrl(path, 4);

  // const fileUrl = getValueFromUrl(path, 5);

  const [open, setOpen] = React.useState<boolean>(false);

  const mutation = trpc.updateMaterial.useMutation({
    onSuccess: () => {
      maketoast.success();
      router.back();
    },
    onError: (error) => {
      maketoast.error();
      console.error(error);
    },
  });

  const delete_mutation = trpc.deleteMaterial.useMutation({
    onSuccess: () => {
      maketoast.success();
      router.back();
    },
    onError: (error) => {
      maketoast.error();
      console.error(error);
      console.log("here is an error");
    },
  });

  const form = useForm<z.infer<typeof updateVedioSchema>>({
    mode: "onChange",
    resolver: zodResolver(updateVedioSchema),
    defaultValues: {
      title: material.title,
      fileUrl: material.fileUrl,
      content: JSON.parse(material?.content),
    },
  });

  async function onSubmit(values: z.infer<typeof updateVedioSchema>) {
    if (!values.fileUrl || values.fileUrl === "") {
      console.log("here it is the values inside the if");
      console.log(values);
      return;
    }
    await mutation.mutateAsync({
      chapterID,
      oldFileUrl: material.fileUrl,
      content: JSON.stringify(values.content),
      fileUrl: values.fileUrl,
      title: values.title,
    });

    console.log("here it is the values inside the mutation");
    console.log(values);
  }

  return (
    <>
      <VideoPlayer
        isOpen={open}
        setIsOpen={setOpen}
        videoId={form?.watch("fileUrl") ?? ""}
      />

      <div className="w-full grid grid-cols-3 gap-x-8 ">
        <div className="col-span-2 w-full h-full">
          <Form {...form}>
            <form
              id="update-video"
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
                      <Input
                        placeholder="تعلم كل ما يتعلق بتربية الكناري"
                        {...field}
                      />
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
                      <VedioUploader
                        initialVideoId={form.watch("fileUrl")}
                        open={open}
                        setOpen={setOpen}
                        onChange={field?.onChange}
                      />
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
                      وصف الفيديو
                      <span className="text-red-600 text-xl">*</span>
                    </FormLabel>
                    <FormControl>
                      <PlateEditor
                        value={form.watch("content")}
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
                form="update-video"
                className="w-full flex items-center gap-x-2"
                size="lg"
              >
                {mutation.isLoading ? <LoadingSpinner /> : null}
                حفظ التغييرات
              </Button>
              <Button
                disabled={delete_mutation.isLoading}
                onClick={async () => {
                  console.log("here are the params");
                  console.log(material.fileUrl, chapterID);
                  await delete_mutation.mutateAsync({
                    oldFileUrl: material.fileUrl,
                    chapterID,
                    fileUrl: form.watch("fileUrl"),
                  });

                  console.log("funtion completed");
                }}
                type="button"
                className="w-full flex items-center gap-x-2 bg-red-500"
                size="lg"
              >
                {delete_mutation.isLoading ? <LoadingSpinner /> : null}
                حذف هذه المادة
              </Button>
              <Button
                onClick={() => router.back()}
                className="w-full"
                variant="secondary"
                size="lg"
              >
                {" "}
                العودة الى باني الدورة
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default UpdateVedioForm;
