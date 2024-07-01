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
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { PlateEditor } from "../../reich-text-editor/rich-text-editor";
import { maketoast } from "../../toasts";
import VideoPlayer from "../../models/video-player";
import { NewVideoUploader } from "../../uploaders/NewVideoUploader";
import { getValueFromUrl } from "@/src/lib/utils";

const addVedioSchema = z.object({
  title: z.string({ required_error: "يرجى ملئ الحقل" }).min(2).max(50),
  content: z.any(),
  fileUrl: z.string({ required_error: "يرجى ملئ الحقل" }),
});

function AddVedioForm() {
  const router = useRouter();
  const path = usePathname();
  const chapterID = getValueFromUrl(path, 4);

  const [open, setOpen] = React.useState<boolean>(false);

  const [videoSize, setVideoSize] = React.useState<number>(0);

  const mutation = trpc.createModule.useMutation({
    onSuccess: () => {
      maketoast.success();
      router.back();
    },
    onError: (error) => {
      maketoast.error();
      console.error(error);
    },
  });

  React.useEffect(() => {
    console.log({ chapterID });
    console.log({ videoSize });
  }, []);

  const form = useForm<z.infer<typeof addVedioSchema>>({
    mode: "onChange",
    resolver: zodResolver(addVedioSchema),
    defaultValues: {
      title: "",
      fileUrl: "",
      content: [
        {
          id: "1",
          type: "p",
          children: [{ text: "" }],
        },
      ],
    },
  });

  async function onSubmit(values: z.infer<typeof addVedioSchema>) {
    // video length
    // colect number of modules
    if (!values.fileUrl || values.fileUrl === "") {
      console.log("here it is the values inside the if");
      console.log(values);
      return;
    }

    await mutation.mutateAsync({
      chapterID: chapterID,
      content: JSON.stringify(values.content),
      fileType: "VEDIO",
      fileUrl: values.fileUrl,
      title: values.title,
      length: videoSize,
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
              id="add-video"
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
                        placeholder="مثال : دورة في التصميم الجرافيكي للمبتدئين"
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
                      <NewVideoUploader
                        open={open}
                        setOpen={setOpen}
                        onChange={field?.onChange}
                        setVideoSize={setVideoSize}
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
                    <FormLabel>وصف الفيديو</FormLabel>
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
              <Card>
                <CardContent className="w-full h-fit flex justify-end items-center p-6 gap-x-4 ">
                  <Button
                    onClick={() => router.back()}
                    className=" rounded-xl"
                    variant="secondary"
                    type="button"
                  >
                    {" "}
                    إلغاء والعودة
                  </Button>
                  <Button
                    disabled={mutation.isLoading}
                    type="submit"
                    className=" flex items-center gap-x-2 rounded-xl"
                  >
                    {mutation.isLoading ? <LoadingSpinner /> : null}
                    حفظ والمتابعة
                  </Button>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
        <div className="col-span-1 w-full h-full ">
          <Card>
            <CardContent className="w-full h-fit flex flex-col p-6  space-y-4">
              <Button
                disabled={mutation.isLoading}
                type="submit"
                form="add-video"
                className="w-full flex items-center gap-x-2"
                size="lg"
              >
                {mutation.isLoading ? <LoadingSpinner /> : null}
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
    </>
  );
}

export default AddVedioForm;
