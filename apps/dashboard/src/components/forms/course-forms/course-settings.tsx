"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "@/src/lib/zod-error-map";
import { Card, CardContent } from "@ui/components/ui/card";
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
import { Input } from "@ui/components/ui/input";
import { useRouter } from "next/navigation";
import { Textarea } from "@ui/components/ui/textarea";
import { trpc } from "@/src/app/_trpc/client";
import { maketoast } from "../../toasts";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { Course } from "database";
import { CravveloEditor } from "@cravvelo/editor";
import React from "react";
import { VideoPlayer } from "../../models/video-player";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";
import { ImageUploaderS3 } from "../../uploaders/image-uploader";

const youtubeUrlRegex =
  /^(https:\/\/www\.youtube\.com\/watch\?v=|https:\/\/youtu\.be\/)[\w-]+(&\S*)?(\?\S*)?$/;

interface ComponentProps {
  course: Course;
}

const formSchema = z.object({
  courseResume: z.string({ required_error: "يرجى ملئ الحقل" }),
  courseDescription: z.any(),
  sound: z.string(),
  seoDescription: z.string({ required_error: "يرجى ملئ الحقل" }),
  seoTitle: z.string({ required_error: "يرجى ملئ الحقل" }),
  thumnailUrl: z.string({ required_error: "يرجى ملئ الحقل" }),
  title: z.string({ required_error: "يرجى ملئ الحقل" }),
  youtubeUrl: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return youtubeUrlRegex.test(val);
      },
      { message: "يرجى إدخال رابط يوتيوب صالح" }
    ),
  courseRequirements: z.string({ required_error: "يرجى ملئ الحقل" }),
  courseWhatYouWillLearn: z.string({ required_error: "يرجى ملئ الحقل" }),
  level: z.string({ required_error: "يرجى ملئ الحقل" }),
  preview_video: z.string().optional(),
});

const parseJSONSafely = (jsonString: string | null | undefined) => {
  if (!jsonString) {
    return [
      {
        id: "1",
        type: "p",
        children: [{ text: "" }],
      },
    ];
  }

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to parse courseDescription JSON:", error);
    return [
      {
        id: "1",
        type: "p",
        children: [{ text: "" }],
      },
    ];
  }
};

export function CourseSettingsForm({ course }: ComponentProps) {
  if (!course) {
    return <div>Course not found</div>;
  }

  const router = useRouter();

  const [open, setOpen] = React.useState<boolean>(false);

  const [isEditingSeoContent, setIsEditingSeoContent] =
    React.useState<boolean>(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseResume: course.courseResume ?? "",
      title: course.title ?? "",
      thumnailUrl: course.thumbnailUrl ?? "",
      youtubeUrl: course.youtubeUrl ?? "",
      seoDescription: course.seoDescription ?? "",
      seoTitle: course.seoTitle ?? "",
      courseRequirements: course.courseRequirements ?? "",
      courseWhatYouWillLearn: course.courseWhatYouWillLearn ?? "",
      level: course.level ?? "",
      sound: course.sound ?? "",
      courseDescription: parseJSONSafely(
        course.courseDescription as unknown as string
      ),
      preview_video: course.preview_video ?? "",
    },
  });

  const mutation = trpc.updateCourseSettings.useMutation({
    onSuccess: () => {
      maketoast.success();
      router.push(`/courses/${course.id}/pricing`);
    },
    onError: (err) => {
      console.error(err);
      maketoast.error();
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate({
      courseDescription: values.courseDescription,
      courseId: course.id,
      courseResume: values.courseResume,
      courseUrl: "",
      courseRequirements: values.courseRequirements,
      courseWhatYouWillLearn: values.courseWhatYouWillLearn,
      seoDescription: values?.seoDescription,
      seoTitle: values.seoTitle,
      thumnailUrl: values.thumnailUrl,
      title: values.title,
      youtubeUrl: values.youtubeUrl,
      level: values.level,
      sound: values.sound,
      preview_video: values.preview_video,
    });
  }

  return (
    <>
      <VideoPlayer
        isOpen={open}
        setIsOpen={setOpen}
        videoId={form?.watch("youtubeUrl") ?? ""}
      />

      <div className="w-full  h-fit grid grid-cols-2 md:grid-cols-3 mt-4 gap-x-8 ">
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
                ادر اعدادات دورتك التدريبية بما في ذالك عنوانها و رابطها و
                الخصائص و اسماء المدرين و امكانية الوصول اليها و العديد من
                المميزات الاخرى{" "}
              </FormLabel>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      عنوان الدورة{" "}
                      <span className="text-red-600 text-xl">*</span>
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
                      <ImageUploaderS3
                        fileUrl={form.watch("thumnailUrl")}
                        onChnage={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="preview_video"
                render={({ field }) => (
                  <FormItem className="w-full ">
                    <FormLabel>الفيديو الدعائي </FormLabel>

                    <FormControl>
                      <NewVideoUploader
                        open={open}
                        setOpen={setOpen}
                        onChange={field?.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="youtubeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      أو يمكنك إضافة عنوان URL لفيديو يوتيوب
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://youtu.be/" {...field} />
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
                      ملخص الدورة{" "}
                      <span className="text-red-600 text-xl">*</span>
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
                      <CravveloEditor
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
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مستوى الدورة</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="حدد مستوى لعرضه" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem
                          value="BEGINNER"
                          className="flex items-center justify-end"
                        >
                          مبتدئ
                        </SelectItem>
                        <SelectItem
                          className="flex items-center justify-end"
                          value="INTERMEDIATE"
                        >
                          متوسط
                        </SelectItem>
                        <SelectItem
                          className="flex items-center justify-end"
                          value="ADVANCED"
                        >
                          متقدم
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      هذا الحقل خاص بتحديد الفئة المستهدفة لهذه الدورات
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sound"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الصوت في الدورة</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="حدد صوت لعرضه" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem
                          value="ARABIC"
                          className="flex items-center justify-end"
                        >
                          عربي
                        </SelectItem>
                        <SelectItem
                          className="flex items-center justify-end"
                          value="FRENSH"
                        >
                          فرنسي
                        </SelectItem>
                        <SelectItem
                          className="flex items-center justify-end"
                          value="ENGLISH"
                        >
                          انجليزي
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      هذا الحقل خاص بتحديد الفئة المستهدفة لهذه الدورات
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Card>
                <CardContent className="w-full h-fit flex justify-start flex-col items-start p-6 gap-x-4 ">
                  {!isEditingSeoContent && (
                    <>
                      <div className="w-full h-[20px] mb-4 flex items-center justify-between">
                        <p>قائمة محرك البحث</p>
                        <Button
                          onClick={() => setIsEditingSeoContent(true)}
                          variant="ghost"
                          type="button"
                        >
                          تعديل
                        </Button>
                      </div>
                      <h1 className="text-indigo-600 text-xl font-bold text-start">
                        دورتك الرائعة عند محرك البحث
                      </h1>
                      <p className="text-gray-600 text-md text-start">
                        كل واحد منا يعيش معتمدًا وملتزمًا بمعرفتنا الفردية
                        ووعينا. كل هذا هو ما نسميه الواقع. ومع ذلك، فإن المعرفة
                        والوعي كلاهما ملتبسان. قد تكون حقيقة شخص ما وهمًا لشخص
                        آخر. نحن جميعا نعيش داخل الأوهام الخاصة بنا
                      </p>
                    </>
                  )}

                  {isEditingSeoContent && (
                    <div className="space-y-4 w-full h-fit min-h-full">
                      <FormField
                        control={form.control}
                        name="seoTitle"
                        render={({ field }) => (
                          <FormItem className="w-full ">
                            <FormLabel>عنوان الموقع عند محرك البحث</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="   دورتك الرائعة عند محرك البحث"
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
                            <FormLabel>أضف وصفًا للموقع</FormLabel>
                            <FormControl>
                              <Textarea
                                id="description"
                                rows={3}
                                className="min-h-[100px]"
                                placeholder="    كل واحد منا يعيش معتمدًا وملتزمًا بمعرفتنا الفردية ووعينا.
                              كل هذا هو ما نسميه الواقع. ومع ذلك، فإن المعرفة والوعي
                              كلاهما ملتبسان. قد تكون حقيقة شخص ما وهمًا لشخص آخر. نحن
                              جميعا نعيش داخل الأوهام الخاصة بنا"
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

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
        <div className="col-span-1 w-full h-full hidden md:block ">
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
                type="button"
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
