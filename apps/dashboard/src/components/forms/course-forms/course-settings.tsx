"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent } from "@ui/components/ui/card";
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
import { usePathname, useRouter } from "next/navigation";
import { getValueFromUrl } from "@/src/lib/utils";
import { Textarea } from "@ui/components/ui/textarea";
import { trpc } from "@/src/app/_trpc/client";
import { maketoast } from "../../toasts";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { ImageUploader } from "../../uploaders/ImageUploader";
import { Course } from "database";
import { PlateEditor } from "../../reich-text-editor/rich-text-editor";

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
  courseRequirements: z.string(),
  courseWhatYouWillLearn: z.string(),
});

export function CourseSettingsForm({ course }: ComponentProps) {
  const router = useRouter();
  const path = usePathname();
  const courseID = getValueFromUrl(path, 2);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseResume: course.courseResume,
      courseUrl: course.courseUrl,
      title: course.title,
      thumnailUrl: course.thumnailUrl,
      youtubeUrl: course.youtubeUrl,
      seoDescription: course.seoDescription,
      seoTitle: course.seoTitle,
      courseRequirements: course.courseRequirements,
      courseWhatYouWillLearn: course.courseRequirements,
    },
  });

  const mutation = trpc.updateCourseSettings.useMutation({
    onSuccess: () => {
      maketoast.success();
      router.push(`/courses/${courseID}/pricing`);
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
      seoDescription: values?.seoDescription,
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
            <FormLabel className="text-xl  block font-bold text-black">
              اعدادات عامة
            </FormLabel>
            <FormLabel className="text-md block  text-gray-600">
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
                    <Input placeholder=" ادخل عنوان الدورة هنا" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full h-0.5 bg-gray-500 " />
            <FormLabel className="text-xl  block font-bold text-black">
              تفاصيل الدورة{" "}
            </FormLabel>
            <FormLabel className="text-md block  text-gray-600">
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
                      fileUrl={course.thumnailUrl}
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
                  <FormLabel>الفيديو الدعائي (youtube رابط ) </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل رابط الفيديو الدعائي هنا"
                      {...field}
                    />
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
                      id="courseResume"
                      rows={3}
                      className="min-h-[100px]"
                      placeholder="أدخل ملخصًا للدورة هنا"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courseWhatYouWillLearn"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>ماذا يتعلم الناس في الدورة</FormLabel>
                  <FormControl>
                    <Textarea
                      id="what they will learn"
                      rows={3}
                      className="min-h-[100px]"
                      placeholder="أدخل ملخصًا للدورة هنا"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courseRequirements"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>متطلبات حضور الدورة</FormLabel>
                  <FormControl>
                    <Textarea
                      id="course requirements"
                      rows={3}
                      className="min-h-[100px]"
                      placeholder="أدخل ملخصًا للدورة هنا"
                      {...field}
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
                    <PlateEditor
                      value={
                        course.courseDescription
                          ? JSON.parse(course.courseDescription as string)
                          : [
                              {
                                id: "1",
                                type: "p",
                                children: [{ text: "Hello, World!" }],
                              },
                            ]
                      }
                      onChnage={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Card>
              <CardContent className="w-full h-fit flex justify-start flex-col items-start p-6 gap-x-4 ">
                <div className="w-full h-[20px] mb-4 flex items-center justify-between">
                  <p>قائمة محرك البحث</p>
                  <Button variant="ghost">تعديل</Button>
                </div>
                <h1 className="text-indigo-600 text-xl font-bold text-start">
                  دورتك الرائعة عند محرك البحث
                </h1>
                <p className="text-gray-600 text-md text-start">
                  كل واحد منا يعيش معتمدًا وملتزمًا بمعرفتنا الفردية ووعينا. كل
                  هذا هو ما نسميه الواقع. ومع ذلك، فإن المعرفة والوعي كلاهما
                  ملتبسان. قد تكون حقيقة شخص ما وهمًا لشخص آخر. نحن جميعا نعيش
                  داخل الأوهام الخاصة بنا
                </p>
              </CardContent>
            </Card>

            <FormField
              control={form.control}
              name="seoTitle"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel>
                    عنوان الموقع عند محرك البحث
                    <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="       عوان الموقع عند محرك البحث"
                      {...field}
                    />
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
                    أضف وصفًا للموقع
                    <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      rows={3}
                      className="min-h-[100px]"
                      placeholder="اضف وصفا للموقع"
                      value={field.value}
                      onChange={field.onChange}
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
                >
                  {" "}
                  إلغاء والعودة
                </Button>
                <Button
                  disabled={mutation.isLoading}
                  type="submit"
                  form="add-text"
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
