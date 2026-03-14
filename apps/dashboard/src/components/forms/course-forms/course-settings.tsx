"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "@/src/lib/zod-error-map";
import { useTranslations } from "next-intl";
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
import { NewVideoUploader } from "../../uploaders/NewVideoUploader";

interface ComponentProps {
  course: Course;
}

const getFormSchema = (t: (key: string) => string) => z.object({
  courseDescription: z.any(),
  sound: z.string(),
  seoDescription: z.string({ required_error: t("validation.requiredField") }),
  seoTitle: z.string({ required_error: t("validation.requiredField") }),
  thumnailUrl: z.string({ required_error: t("validation.requiredField") }),
  title: z.string({ required_error: t("validation.requiredField") }),
  level: z.string({ required_error: t("validation.requiredField") }),
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

  const t = useTranslations("courses.courseSettings");
  const router = useRouter();

  const [open, setOpen] = React.useState<boolean>(false);

  const [isEditingSeoContent, setIsEditingSeoContent] =
    React.useState<boolean>(false);

  const formSchema = getFormSchema(t);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course.title ?? "",
      thumnailUrl: course.thumbnailUrl ?? "",
      seoDescription: course.seoDescription ?? "",
      seoTitle: course.seoTitle ?? "",
      level: course.level ?? "",
      sound: course.sound ?? "",
      courseDescription: parseJSONSafely(
        course.courseDescription as unknown as string
      ),
      preview_video: course.preview_video ?? "",
    },
  });

  const mutation = trpc.course.updateCourseSettings.useMutation({
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
      courseUrl: "",
      seoDescription: values?.seoDescription,
      seoTitle: values.seoTitle,
      thumnailUrl: values.thumnailUrl,
      title: values.title,
      level: values.level,
      sound: values.sound,
      preview_video: values.preview_video || null,
    });
  }

  return (
    <>
      <VideoPlayer
        isOpen={open}
        setIsOpen={setOpen}
        videoId={form?.watch("preview_video") ?? ""}
      />

      <div className="w-full  h-fit grid grid-cols-2 md:grid-cols-3 mt-4 gap-x-8 ">
        <div className="col-span-2 w-full min-h-full h-fit pb-6">
          <Form {...form}>
            <form
              id="add-text"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormLabel className="text-xl  block font-bold text-foreground">
                {t("sections.generalSettings")}
              </FormLabel>
              <FormLabel className="text-md block  text-muted-foreground">
                {t("sections.generalDescription")}
              </FormLabel>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("fields.courseTitle")}{" "}
                      <span className="text-destructive text-xl">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={t("fields.courseTitlePlaceholder")} {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full h-0.5 bg-border" />
              <FormLabel className="text-xl block font-bold text-foreground">
                {t("sections.courseDetails")}
              </FormLabel>
              <FormLabel className="text-md block text-muted-foreground">
                {t("sections.courseDetailsDescription")}
              </FormLabel>

              <FormField
                control={form.control}
                name="thumnailUrl"
                render={({ field }) => (
                  <FormItem className="w-full ">
                    <FormLabel>
                      {t("fields.thumbnail")}{" "}
                      <span className="text-destructive text-xl">*</span>
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

              <FormField
                control={form.control}
                name="preview_video"
                render={({ field }) => (
                  <FormItem className="w-full ">
                    <FormLabel>{t("fields.previewVideo")}</FormLabel>
                    <FormControl>
                      <NewVideoUploader
                        open={open}
                        setOpen={setOpen}
                        onChange={field.onChange}
                        initialVideoId={field.value || undefined}
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
                      {t("fields.fullDescription")}{" "}
                      <span className="text-destructive text-xl">*</span>
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
                    <FormLabel>{t("fields.courseLevel")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("fields.courseLevelPlaceholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem
                          value="BEGINNER"
                          className="flex items-center justify-end"
                        >
                          {t("levels.beginner")}
                        </SelectItem>
                        <SelectItem
                          className="flex items-center justify-end"
                          value="INTERMEDIATE"
                        >
                          {t("levels.intermediate")}
                        </SelectItem>
                        <SelectItem
                          className="flex items-center justify-end"
                          value="ADVANCED"
                        >
                          {t("levels.advanced")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t("fields.courseLevelDescription")}
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
                    <FormLabel>{t("fields.courseSound")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("fields.courseSoundPlaceholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem
                          value="ARABIC"
                          className="flex items-center justify-end"
                        >
                          {t("sounds.arabic")}
                        </SelectItem>
                        <SelectItem
                          className="flex items-center justify-end"
                          value="FRENSH"
                        >
                          {t("sounds.french")}
                        </SelectItem>
                        <SelectItem
                          className="flex items-center justify-end"
                          value="ENGLISH"
                        >
                          {t("sounds.english")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t("fields.courseSoundDescription")}
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
                        <p>{t("seo.searchEngineList")}</p>
                        <Button
                          onClick={() => setIsEditingSeoContent(true)}
                          variant="ghost"
                          type="button"
                        >
                          {t("seo.edit")}
                        </Button>
                      </div>
                      <h1 className="text-indigo-600 dark:text-indigo-400 text-xl font-bold text-start">
                        {t("seo.yourCourseAtSearch")}
                      </h1>
                      <p className="text-muted-foreground text-md text-start">
                        {t("seo.seoDescriptionPlaceholder")}
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
                            <FormLabel>{t("seo.seoTitle")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("seo.seoTitlePlaceholder")}
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
                            <FormLabel>{t("seo.addDescription")}</FormLabel>
                            <FormControl>
                              <Textarea
                                id="description"
                                rows={3}
                                className="min-h-[100px]"
                                placeholder={t("seo.seoDescriptionPlaceholder")}
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

              <Card className="md:hidden">
                <CardContent className="w-full h-fit flex justify-end items-center p-6 gap-x-4 ">
                  <Button
                    onClick={() => router.back()}
                    className=" rounded-xl"
                    variant="secondary"
                    type="button"
                  >
                    {" "}
                    {t("cancelAndGoBack")}
                  </Button>
                  <Button
                    disabled={mutation.isLoading}
                    type="submit"
                    className=" flex items-center gap-x-2 rounded-xl"
                  >
                    {mutation.isLoading ? <LoadingSpinner /> : null}
                    {t("saveAndContinue")}
                  </Button>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
        <div className="col-span-1 w-full h-fit self-start hidden md:block">
          <Card className="sticky top-24">
            <CardContent className="w-full h-fit flex flex-col p-6  space-y-4">
              <Button
                disabled={mutation.isLoading}
                type="submit"
                form="add-text"
                className="w-full flex items-center gap-x-2"
                size="lg"
              >
                {mutation.isLoading ? <LoadingSpinner /> : null}
                {t("saveAndContinue")}
              </Button>
              <Button
                onClick={() => router.back()}
                className="w-full"
                variant="secondary"
                type="button"
                size="lg"
              >
                {" "}
                {t("cancelAndGoBack")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
