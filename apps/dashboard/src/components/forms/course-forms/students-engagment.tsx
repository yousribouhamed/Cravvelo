"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { trpc } from "@/src/app/_trpc/client";
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
import { Switch } from "@ui/components/ui/switch";
import { Input } from "@ui/components/ui/input";
import { Card, CardContent } from "@ui/components/ui/card";
import Tiptap from "../../tiptap";
import { usePathname, useRouter } from "next/navigation";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { getValueFromUrl } from "@/src/lib/utils";

const addTextSchema = z.object({
  title: z.string().min(2).max(50),
  content: z.any(),
});

function StudentEngagment() {
  const router = useRouter();
  const path = usePathname();
  const chapterID = getValueFromUrl(path, 4);

  const mutation = trpc.createModule.useMutation({
    onSuccess: () => {},
    onError: () => {},
  });

  const form = useForm<z.infer<typeof addTextSchema>>({
    mode: "onChange",
    resolver: zodResolver(addTextSchema),
    defaultValues: {
      title: "",
      content: JSON.stringify(""),
    },
  });

  async function onSubmit(values: z.infer<typeof addTextSchema>) {
    await mutation.mutateAsync({
      chapterID: chapterID,
      content: values.content,
      fileType: "TEXT",
      fileUrl: "",
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
            <FormLabel className="text-3xl  block font-bold text-black">
              الشهادات
            </FormLabel>
            <FormLabel className="text-xl block  text-gray-600">
              حدد اعدادات الشهادة في دورتك و متى يحق لطالب الحصول عليها
            </FormLabel>

            <div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex flex-row bg-white items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>تفعيل شهادة على الدورة</FormLabel>
                      </div>
                      <FormControl>
                        <div dir="ltr">
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 bg-white shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>يجب مشاهدة جميع مواد الدورة</FormLabel>
                      </div>
                      <FormControl>
                        <div dir="ltr">
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled
                            aria-readonly
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
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

export default StudentEngagment;
