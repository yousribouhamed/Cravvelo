"use client";

import * as z from "zod";
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
import Tiptap from "../../tiptap";
import { usePathname, useRouter } from "next/navigation";
import { getValueFromUrl } from "@/src/lib/utils";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { Textarea } from "@ui/components/ui/textarea";
import { JadaraUploadDropzone } from "../../upload-dropzone";

const addProductConentNameSchema = z.object({
  name: z.string().min(2).max(50),
  breifDescription: z.any(),
  description: z.string(),
  fileUrl: z.string(),
  imageUrl: z.string(),
});

function AddTextForm() {
  const router = useRouter();
  const path = usePathname();
  const chapterID = getValueFromUrl(path, 4);

  const mutation = trpc.createModule.useMutation({
    onSuccess: () => {},
    onError: () => {},
  });

  const form = useForm<z.infer<typeof addProductConentNameSchema>>({
    mode: "onChange",
    resolver: zodResolver(addProductConentNameSchema),
  });

  async function onSubmit(values: z.infer<typeof addProductConentNameSchema>) {}

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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    اسم المنتج <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="اسم المنتج" {...field} />
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
                    إضافة ملف pdf{" "}
                    <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <JadaraUploadDropzone onChnage={field.onChange} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="breifDescription"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>
                    وصف مختصر <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      rows={3}
                      className="min-h-[100px]"
                      placeholder="أدخل ملخصًا للدورة هنا"
                      value={field.value}
                      onChange={field.onChange}
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
                <FormItem className="w-full ">
                  <FormLabel>
                    وصف المنتج الخاص بك{" "}
                    <span className="text-red-600 text-xl">*</span>
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
  );
}

export default AddTextForm;
