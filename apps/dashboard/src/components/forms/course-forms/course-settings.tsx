"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent } from "@ui/components/ui/card";
import { Button } from "@ui/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
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
import Tiptap from "../../tiptap";
import { usePathname, useRouter } from "next/navigation";
import { getValueFromUrl } from "@/src/lib/utils";
import { Textarea } from "@ui/components/ui/textarea";
import { trpc } from "@/src/app/_trpc/client";
import { maketoast } from "../../toasts";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { ImageUploader } from "../../uploaders/ImageUploader";
import { Course } from "database";

interface ComponentProps {
  course: Course;
}

const formSchema = z.object({
  courseResume: z.string(),
  courseDescription: z.any(),
  courseUrl: z.string(),
  seoDescription: z.string(),
  seoTitle: z.string(),
  thumnailUrl: z.string(),
  title: z.string(),
  youtubeUrl: z.string(),
});

export function CourseSettingsForm({ course }: ComponentProps) {
  const router = useRouter();
  const path = usePathname();
  const courseID = getValueFromUrl(path, 2);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseDescription: course.courseDescription,
      courseResume: course.courseResume,
      courseUrl: course.courseUrl,
      title: course.title,
      thumnailUrl: course.thumnailUrl,
      youtubeUrl: course.youtubeUrl,
      seoDescription: course.seoDescription,
      seoTitle: course.seoTitle,
    },
  });

  const mutation = trpc.updateCourseSettings.useMutation({
    onSuccess: () => {
      maketoast.success();
      router.push(`/courses/${courseID}/settings`);
    },
    onError: () => {
      maketoast.error();
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate({
      courseDescription: values.courseDescription,
      courseId: courseID,
      courseResume: values.courseResume,
      courseUrl: values.courseUrl,
      seoDescription: values.seoDescription,
      seoTitle: values.seoTitle,
      thumnailUrl: values.thumnailUrl,
      title: values.title,
      youtubeUrl: values.youtubeUrl,
    });
  }

  return (
    <div className="w-full  h-fit grid grid-cols-3 mt-4 gap-x-8 ">
      <div className="col-span-2 w-full min-h-full h-fit pb-6">
        <Form {...form}>
          <form
            id="add-text"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormLabel className="text-3xl  block font-bold text-black">
              اعدادات عامة
            </FormLabel>
            <FormLabel className="text-xl block  text-gray-600">
              ادر اعدادات دورتك التدريبية بما في ذالك عنوانها و رابطها و الخصائص
              و اسماء المدرين و امكانية الوصول اليها و العديد من المميزات الاخرى{" "}
            </FormLabel>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    عنوان الدورة <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="     عنوان الدورة " {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courseUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    رابط الدورة <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="رابط" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seoTitle"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>
                    المدرسين <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seoTitle"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>
                    الوقت المقدر لاكمال الدورة{" "}
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
              name="seoTitle"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>
                    تخصيص صفجة هبوط لدورة{" "}
                    <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full h-0.5 bg-gray-500 " />
            <FormLabel className="text-3xl  block font-bold text-black">
              تفاصيل الدورة{" "}
            </FormLabel>
            <FormLabel className="text-xl block  text-gray-600">
              من السهل تخصيص المظهر العام لدورتك عن طريق وضع صورة فريدة لها و
              اظافة وصف تعريفي يجذب الزوار عند زيارة صفحة الهبوط لدورة
            </FormLabel>

            <FormField
              control={form.control}
              name="thumnailUrl"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>
                    الصورة البارزة لدورة{" "}
                    <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <ImageUploader
                      fileUrl={field.name}
                      onChnage={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="youtubeUrl"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>
                    الفيديو الدعائي (youtube رابط ){" "}
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
              name="courseResume"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>
                    ملخص الدورة <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      rows={3}
                      className="min-h-[100px]"
                      placeholder="short sleeve shirts"
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
              name="courseDescription"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>
                    الوصف الكامل لدورة{" "}
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

            <FormField
              control={form.control}
              name="seoTitle"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>
                    ماذا يستفيد الطالب{" "}
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
              name="seoTitle"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>
                    ماهي متطلباات حضور الدورة{" "}
                    <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full h-0.5 bg-gray-500 " />
            <FormLabel className="text-3xl  block font-bold text-black">
              تهيئة محركات البحث seo{" "}
            </FormLabel>
            <FormLabel className="text-xl block  text-gray-600">
              من السهل تخصيص المظهر العام لدورتك عن طريق وضع صورة فريدة لها و
              اظافة وصف تعريفي يجذب الزوار عند زيارة صفحة الهبوط لدورة
            </FormLabel>

            <FormField
              control={form.control}
              name="seoTitle"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>
                    عوان الموقع عند محرك البحث
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
              name="seoDescription"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>
                    اضف وصفا للموقع
                    <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      rows={3}
                      className="min-h-[100px]"
                      placeholder="short sleeve shirts"
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
