"use client";

import { z } from "@/src/lib/zod-error-map";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
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
import * as React from "react";
import { trpc } from "@/src/app/_trpc/client";
import { maketoast } from "../../toasts";
import { usePathname, useRouter } from "next/navigation";
import { getValueFromUrl } from "@/src/lib/utils";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { Chapter, Course } from "database";
// import CourseContent from "@/src/app/(academy)/_components/course-component/course-content";

interface PublishCourseFormProps {
  course: Course;
  chapters: Chapter[];
}

function PublishCourseForm({ course, chapters }: PublishCourseFormProps) {
  const t = useTranslations("courses.publishCourse");
  const router = useRouter();
  const path = usePathname();
  const courseID = getValueFromUrl(path, 2);

  const [selectedItem, setSelectedItem] = React.useState<
    "DRAFT" | "PUBLISED" | "EARLY_ACCESS" | "PRIVATE"
  >("PUBLISED");

  const addTextSchema = z.object({
    title: z.string({ required_error: t("validation.requiredField") }).min(2).max(50),
    content: z.any(),
  });

  const selectionButtoms = [
    {
      title: t("selectionButtons.draft"),
      description: t("selectionButtons.draftDescription"),
      value: "DRAFT",
    },
    {
      title: t("selectionButtons.availableToAll"),
      description: t("selectionButtons.availableToAllDescription"),
      value: "PUBLISHED",
    },
  ];

  const form = useForm<z.infer<typeof addTextSchema>>({
    mode: "onChange",
    resolver: zodResolver(addTextSchema),
    defaultValues: {
      title: course.title ?? "",
    },
  });

  const mutation = trpc.course.launchCourse.useMutation({
    onSuccess: () => {
      maketoast.success();
      router.push(`/courses`);
    },
    onError: () => {
      maketoast.error();
    },
  });

  async function onSubmit(values: z.infer<typeof addTextSchema>) {
    await mutation.mutateAsync({
      courseId: courseID,
      status: selectedItem,
    });
  }

  return (
    <div className="w-full h-fit grid grid-cols-2 md:grid-cols-3 mt-4 gap-x-8">
      <div className="col-span-2 w-full min-h-full h-fit pb-6">
        <Form {...form}>
          <form
            id="add-text"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormLabel className="text-xl block font-bold text-foreground">
              {t("publishCourse")}
            </FormLabel>
            <FormLabel className="text-md block text-muted-foreground">
              Finalize and publish your course
            </FormLabel>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("courseTitle")} <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={t("courseTitlePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Save Actions */}
            <Card>
              <CardContent className="w-full h-fit flex justify-end items-center p-6 gap-x-4">
                <Button
                  onClick={() => router.back()}
                  className="rounded-xl"
                  variant="secondary"
                  type="button"
                >
                  {t("cancelAndGoBack")}
                </Button>
                <Button
                  disabled={mutation.isLoading}
                  type="submit"
                  className="flex items-center gap-x-2 rounded-xl"
                >
                  {mutation.isLoading ? <LoadingSpinner /> : null}
                  {t("publishCourse")}
                </Button>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
      <div className="col-span-1 w-full h-full hidden md:block">
        <Card>
          <CardContent className="w-full h-fit flex flex-col p-6 space-y-4">
            <div className="space-y-2">
              {selectionButtoms.map((item) => (
                <Button
                  key={item.value}
                  type="button"
                  onClick={() => setSelectedItem(item.value as "DRAFT" | "PUBLISED")}
                  variant="secondary"
                  size="lg"
                  className={`bg-card flex items-start justify-start flex-col gap-y-1 text-lg border border-border text-foreground min-h-[80px] w-full ${
                    selectedItem === item.value ? "border-primary border-2" : ""
                  }`}
                >
                  <span className="text-md font-bold text-start w-full">
                    {item.title}
                  </span>
                  <p className="text-muted-foreground text-sm text-start w-full">
                    {item.description}
                  </p>
                </Button>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <Button
                disabled={mutation.isLoading}
                type="submit"
                form="add-text"
                className="w-full flex items-center gap-x-2"
                size="lg"
              >
                {mutation.isLoading ? <LoadingSpinner /> : null}
                {t("publishCourse")}
              </Button>
              <Button
                onClick={() => router.back()}
                className="w-full"
                variant="secondary"
                type="button"
                size="lg"
              >
                {t("cancelAndGoBack")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PublishCourseForm;
