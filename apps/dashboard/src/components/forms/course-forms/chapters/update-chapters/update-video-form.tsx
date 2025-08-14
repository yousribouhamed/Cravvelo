"use client";

import { z } from "@/src/lib/zod-error-map";
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
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";
import { VideoPlayer } from "@/src/components/models/video-player";
import { Module } from "@/src/types";
import { NewVideoUploader } from "@/src/components/uploaders/NewVideoUploader";

const updateVedioSchema = z.object({
  title: z.string({ required_error: "يرجى ملئ الحقل" }).min(2).max(50),
  content: z.any(),
  fileUrl: z.string({ required_error: "يرجى ملئ الحقل" }),
});

interface UpdateVedioFormProps {
  material: Module;
}

function UpdateVedioForm({ material }: UpdateVedioFormProps) {
  const router = useRouter();
  const path = usePathname();
  const chapterID = getValueFromUrl(path, 4);
  const [open, setOpen] = React.useState<boolean>(false);

  const delete_mutation = trpc.deleteMaterial.useMutation({
    onSuccess: () => {
      maketoast.success("تم حذف المادة بنجاح");
      router.back();
    },
    onError: (error) => {
      maketoast.error("فشل في حذف المادة");
      console.error(error);
    },
  });

  const mutation = trpc.updateModuleVideo.useMutation({
    onSuccess: (data) => {
      maketoast.success("تم تحديث الفيديو بنجاح");
      console.log("Update successful:", data);

      // Optional: Redirect back after successful update
      setTimeout(() => {
        router.back();
      }, 1000);
    },
    onError: (error) => {
      maketoast.error("فشل في تحديث الفيديو");
      console.error("Update error:", error);
    },
  });

  const form = useForm<z.infer<typeof updateVedioSchema>>({
    mode: "onChange",
    resolver: zodResolver(updateVedioSchema),
    defaultValues: {
      title: material.title,
      fileUrl: material.fileUrl,
      content: material?.content ? JSON.parse(material.content) : {},
    },
  });

  async function onSubmit(values: z.infer<typeof updateVedioSchema>) {
    try {
      // Validate required fields
      if (!values.fileUrl || values.fileUrl.trim() === "") {
        maketoast.error("يرجى إضافة ملف فيديو");
        return;
      }

      if (!chapterID) {
        maketoast.error("معرف الفصل غير موجود");
        return;
      }

      if (!material.id) {
        maketoast.error("معرف الوحدة غير موجود");
        return;
      }

      console.log("Submitting update with values:", values);
      console.log("Material ID:", material.id);
      console.log("Chapter ID:", chapterID);

      // Call the mutation with proper parameters
      await mutation.mutateAsync({
        chapterID: chapterID,
        moduleId: material.id,
        newVideoId: values.fileUrl,
        title: values.title,
        content: JSON.stringify(values.content || {}),
        // Optional: include duration if you have it
        // duration: material.duration
      });
    } catch (error) {
      console.error("Submit error:", error);
      // Error is already handled in mutation onError
    }
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
                        disabled={mutation.isLoading}
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
                      تحديث ملف الفيديو{" "}
                      <span className="text-red-600 text-xl">*</span>
                    </FormLabel>
                    <FormControl>
                      <NewVideoUploader
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
                      {/* Placeholder for content editor */}
                      <div className="min-h-[100px] p-4 border rounded-md bg-gray-50">
                        <p className="text-sm text-gray-500">
                          محرر المحتوى سيتم إضافته هنا
                        </p>
                        {/* <PlateEditor
                          value={form.watch("content")}
                          onChange={field.onChange}
                        /> */}
                      </div>
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
                disabled={mutation.isLoading || delete_mutation.isLoading}
                type="submit"
                form="update-video"
                className="w-full flex items-center gap-x-2"
                size="lg"
              >
                {mutation.isLoading ? <LoadingSpinner /> : null}
                {mutation.isLoading ? "جاري التحديث..." : "حفظ التغييرات"}
              </Button>

              <Button
                disabled={delete_mutation.isLoading || mutation.isLoading}
                onClick={async () => {
                  console.log("Deleting material with params:");
                  console.log("FileUrl:", material.fileUrl);
                  console.log("ChapterID:", chapterID);

                  if (!chapterID) {
                    maketoast.error("معرف الفصل غير موجود");
                    return;
                  }

                  await delete_mutation.mutateAsync({
                    oldFileUrl: material.fileUrl,
                    chapterID,
                    fileUrl: form.watch("fileUrl"),
                  });
                }}
                type="button"
                className="w-full flex items-center gap-x-2 bg-red-500 hover:bg-red-900 transition-all duration-300"
                size="lg"
              >
                {delete_mutation.isLoading ? <LoadingSpinner /> : null}
                {delete_mutation.isLoading ? "جاري الحذف..." : "حذف هذه المادة"}
              </Button>

              <Button
                onClick={() => router.back()}
                className="w-full"
                variant="secondary"
                size="lg"
                disabled={mutation.isLoading || delete_mutation.isLoading}
              >
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
