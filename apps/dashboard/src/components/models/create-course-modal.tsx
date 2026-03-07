"use client";

import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@ui/components/ui/dialog";
import { Button } from "@ui/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { addCourseSchema } from "@/src/lib/validators/course";
import { trpc } from "@/src/app/_trpc/client";
import { useRouter } from "next/navigation";
import * as React from "react";
import { maketoast } from "../toasts";
import { useTranslations } from "next-intl";

const AddCourse: FC = ({}) => {
  const router = useRouter();
  const t = useTranslations("courses");
  const tAddNew = useTranslations("addNew");
  const [isOpen, setIsOpen] = React.useState(false);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const mutation = trpc.course.createCourse.useMutation({
    onSuccess: ({ courseId, planExceeded, success }) => {
      if (success) {
        router.push(`/courses/${courseId}/chapters`);
        maketoast.successWithText({ text: tAddNew("courseCreated") });
        setIsOpen(false);
      }
    },
    onError: () => {
      maketoast.error();
      setIsOpen(false);
      setIsSubmitting(false);
    },
  });

  const form = useForm<z.infer<typeof addCourseSchema>>({
    resolver: zodResolver(addCourseSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(data: z.infer<typeof addCourseSchema>) {
    setIsSubmitting(true);
    try {
      await mutation.mutateAsync({
        title: data.title,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCancel = () => {
    form.reset();
    setIsOpen(false);
    setIsSubmitting(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="h-[50px] px-4 rounded-xl flex items-center gap-x-2"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current"
            >
              <path
                d="M8.8575 3.61523V14.0404M14.0701 8.82784H3.6449"
                strokeWidth="1.04252"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs md:text-base">{t("actions.addNew")}</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg" title={t("modal.title")}>
          <div className="w-full px-4 pb-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("modal.courseTitle")} *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("modal.courseTitlePlaceholder")}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="w-full h-[50px] flex items-center  flex-nowrap justify-end gap-x-1 md:gap-x-4">
                  <Button variant="ghost" type="button" onClick={handleCancel}>
                    {t("modal.cancel")}
                  </Button>
                  <Button
                    className=" flex items-center gap-x-2"
                    disabled={isSubmitting || mutation.isLoading}
                    type="submit"
                  >
                    {mutation.isLoading ? <LoadingSpinner /> : null}
                    {t("modal.add")}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddCourse;
