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
import { getCookie } from "@/src/lib/utils";
import { useRouter } from "next/navigation";
import * as React from "react";
import { maketoast } from "../toasts";
import PlanExceededPopup from "./pyment-plan-exceeded";

const AddCourse: FC = ({}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPlanExceededOpen, setIsPlanExceededOpen] = React.useState(false);
  const [isLaoding, setIsLoading] = React.useState(false);
  const mutation = trpc.createCourse.useMutation({
    onSuccess: ({ courseId, planExceeded, success }) => {
      if (planExceeded) {
        setIsPlanExceededOpen(true);
        return;
      }
      if (success) {
        router.push(`/courses/${courseId}/chapters`);
        maketoast.successWithText({ text: "تم انشاء الدورة بنجاح" });
      }
    },
    onError: () => {
      maketoast.error();
      setIsOpen(false);
    },
  });

  const form = useForm<z.infer<typeof addCourseSchema>>({
    resolver: zodResolver(addCourseSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(data: z.infer<typeof addCourseSchema>) {
    const cookie = getCookie("accountId");
    setIsLoading(true);
    await mutation
      .mutateAsync({
        title: data.title,
        accountId: cookie,
      })
      .then(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <PlanExceededPopup
        isOpen={isPlanExceededOpen}
        setIsOpen={setIsPlanExceededOpen}
      />
      <Dialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
        <DialogTrigger asChild>
          <Button className=" rounded-xl border flex items-center gap-x-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.8575 3.61523V14.0404M14.0701 8.82784H3.6449"
                stroke="white"
                stroke-width="1.04252"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span className="text-xs md:text-base">أنشئ دورة جديدة</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg" title="إضافة دورة جديدة">
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
                      <FormLabel>عنوان الدورة *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل عنوان الدورة الجديدة، مثال: دورة تصميم تجربة المستخدم"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="w-full h-[50px] flex items-center justify-end gap-x-4">
                  <Button data-ripple-light="true" variant="ghost">
                    إلغاء
                  </Button>
                  <Button
                    data-ripple-light="true"
                    className=" flex items-center gap-x-2"
                    disabled={isLaoding}
                    type="submit"
                  >
                    {mutation.isLoading ? <LoadingSpinner /> : null}
                    إضافة جديد
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
