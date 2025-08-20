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
import { usePathname, useRouter } from "next/navigation";
import { getValueFromUrl } from "@/src/lib/utils";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";
import { CravveloEditor } from "@cravvelo/editor";
import { useEffect } from "react";

const updateTextSchema = z.object({
  title: z.string().min(2).max(50),
  content: z.string().min(1, "المحتوى مطلوب"),
  duration: z.number().optional().default(0),
});

function UpdateTextModuleForm() {
  const router = useRouter();
  const path = usePathname();
  const chapterID = getValueFromUrl(path, 4);
  const moduleId = getValueFromUrl(path, 6); // Assuming module ID is at position 6 in URL

  // Fetch existing module data
  const { data: moduleData, isLoading: isLoadingModule } =
    trpc.getTextModule.useQuery(
      {
        chapterID,
        moduleId,
      },
      {
        enabled: !!chapterID && !!moduleId,
      }
    );

  const updateMutation = trpc.updateTextModule.useMutation({
    onSuccess: (data) => {
      maketoast.success("تم تحديث الدرس بنجاح");
      router.back();
    },
    onError: (error) => {
      maketoast.error("فشل في تحديث الدرس");
      console.error(error);
    },
  });

  const form = useForm<z.infer<typeof updateTextSchema>>({
    mode: "onChange",
    resolver: zodResolver(updateTextSchema),
    defaultValues: {
      title: "",
      content: "",
      duration: 0,
    },
  });

  // Populate form when module data is loaded
  useEffect(() => {
    if (moduleData?.module) {
      const module = moduleData.module;
      form.reset({
        title: module.title || "",
        content: module.content || "",
        duration: module.duration || 0,
      });
    }
  }, [moduleData, form]);

  async function onSubmit(values: z.infer<typeof updateTextSchema>) {
    if (!chapterID || !moduleId) {
      maketoast.error("معرف الفصل أو الوحدة مفقود");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        chapterID,
        moduleId,
        title: values.title,
        content: values.content,
        duration: values.duration,
      });
    } catch (error) {
      console.error("Error updating module:", error);
    }
  }

  // Show loading spinner while fetching module data
  if (isLoadingModule) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
        <span className="mr-2">جاري تحميل بيانات الدرس...</span>
      </div>
    );
  }

  // Show error if module not found
  if (!moduleData?.module) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-600">الدرس غير موجود</h2>
        <p className="text-gray-600 mt-2">لم يتم العثور على الدرس المطلوب</p>
        <Button onClick={() => router.back()} className="mt-4">
          العودة
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-3 gap-x-8">
      <div className="col-span-2 w-full h-full">
        <Form {...form}>
          <form
            id="update-text"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    عنوان النص <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="لماذا لون البحر ازرق" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    مدة القراءة المتوقعة (بالدقائق)
                    <span className="text-sm text-gray-500 mr-2">
                      (اختياري - سيتم حسابه تلقائياً إذا تُرك فارغاً)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="5"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || 0)
                      }
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
                <FormItem className="w-full">
                  <FormLabel>
                    محتوى الدرس <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <CravveloEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>

      <div className="col-span-1 w-full h-full">
        <Card>
          <CardContent className="w-full h-fit flex flex-col p-6 space-y-4">
            <Button
              disabled={updateMutation.isLoading}
              type="submit"
              form="update-text"
              className="w-full flex items-center gap-x-2"
              size="lg"
            >
              {updateMutation.isLoading ? <LoadingSpinner /> : null}
              حفظ التحديثات
            </Button>
            <Button
              onClick={() => router.back()}
              className="w-full"
              variant="secondary"
              size="lg"
              disabled={updateMutation.isLoading}
            >
              إلغاء والعودة
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UpdateTextModuleForm;
