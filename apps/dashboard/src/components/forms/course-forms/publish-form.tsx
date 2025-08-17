"use client";

import { z } from "@/src/lib/zod-error-map";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

const addTextSchema = z.object({
  title: z.string({ required_error: "يرجى ملئ الحقل" }).min(2).max(50),
  content: z.any(),
});

const selectionButtoms = [
  {
    title: "مسودة",
    description: "سيتم عرضها لفريقك فقط",
    value: "DRAFT",
  },
  {
    title: "متاح للجميع",
    description: "سيكون مرئيًا للجميع",
    value: "PUBLISED",
  },
];

interface PublishCourseFormProps {
  course: Course;
  chapters: Chapter[];
}

function PublishCourseForm({ course, chapters }: PublishCourseFormProps) {
  const router = useRouter();
  const path = usePathname();
  const courseID = getValueFromUrl(path, 2);

  const [selectedItem, setSelectedItem] = React.useState<
    "DRAFT" | "PUBLISED" | "EARLY_ACCESS" | "PRIVATE"
  >("PUBLISED");
  const form = useForm<z.infer<typeof addTextSchema>>({
    mode: "onChange",
    resolver: zodResolver(addTextSchema),
    defaultValues: {
      title: course.title ?? "",
    },
  });

  const mutation = trpc.launchCourse.useMutation({
    onSuccess: () => {
      maketoast.success();
      // router.push(`/courses`);
      window.location.href = "/courses";
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
    <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-x-8 ">
      <div className="col-span-2 w-full h-full">
        <Form {...form}>
          <form
            id="add-text"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    عنوان الدورة <span className="text-red-600 text-xl">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="عنوان الدورة" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <div className="col-span-1 hidden md:block w-full h-full ">
        <Card>
          <CardContent className="w-full bg-[#F2F4F4]  h-fit flex flex-col pt-4  space-y-2">
            {selectionButtoms.map((item) => (
              <Button
                key={item.value}
                type="button"
                //@ts-expect-error
                onClick={() => setSelectedItem(item.value)}
                variant="secondary"
                size="lg"
                className={`bg-white flex items-start justify-center flex-col gap-x-4 text-lg border text-black h-16 ${
                  selectedItem === item.value ? "border-primary border-2" : ""
                }`}
              >
                <span className="text-md font-bold text-start">
                  {item.title}
                </span>
                <p className="text-gray-500 text-sm text-start my-1">
                  {item.description}
                </p>
              </Button>
            ))}

            <div className="space-y-4">
              <Button
                disabled={mutation.isLoading}
                type="submit"
                form="add-text"
                className="w-full flex items-center gap-x-2"
                size="lg"
              >
                {mutation.isLoading ? <LoadingSpinner /> : null}
                نشر الدورة
              </Button>
              <Button className="w-full" variant="secondary" size="lg">
                {" "}
                إلغاء والعودة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PublishCourseForm;
