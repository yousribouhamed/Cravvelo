"use client";

import { z } from "@/src/lib/zod-error-map";
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
} from "@ui/components/ui/form";
import { Switch } from "@ui/components/ui/switch";
import { Card, CardContent } from "@ui/components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "../../toasts";
import { Course } from "database";

const FormSchema = z.object({
  allowComments: z.boolean(),
  forceWatchAllCourse: z.boolean(),
  allowRating: z.boolean(),
  cerrificate: z.boolean(),
});

interface StudentEngagmentProps {
  course: Course;
}

function StudentEngagment({ course }: StudentEngagmentProps) {
  const router = useRouter();

  const mutation = trpc.updateCourseStudentEngagment.useMutation({
    onSuccess: () => {
      maketoast.success();
      router.push(`/courses/${course.id}/publishing`);
    },
    onError: (err) => {
      maketoast.error();
      console.error(err);
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
    defaultValues: {
      cerrificate: course.certificate,
      allowComments: course.allowComment,
      allowRating: course.allowRating,
      forceWatchAllCourse: course.forceWatchAllCourse,
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    await mutation.mutateAsync({
      allowComment: values.allowComments,
      certificate: values.cerrificate,
      courseId: course.id,
      allowRating: false,
      forceWatchAllCourse: false,
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
            <FormLabel className="text-xl  block font-bold text-black">
              الشهادات
            </FormLabel>
            <FormLabel className="text-md block  text-gray-600">
              حدد اعدادات الشهادة في دورتك و متى يحق لطالب الحصول عليها
            </FormLabel>

            <div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="cerrificate"
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

                <FormLabel className="text-xl  block font-bold text-black">
                  التفاعل مع المحتوى
                </FormLabel>
                <FormLabel className="text-md block  text-gray-600">
                  حدد ما يمكن للطالب القيام به اثناء الدورة
                </FormLabel>
                <FormField
                  control={form.control}
                  name="allowComments"
                  render={({ field }) => (
                    <FormItem className="flex flex-row bg-white items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>السماح بالتعليقات على هذه الدورة</FormLabel>
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
