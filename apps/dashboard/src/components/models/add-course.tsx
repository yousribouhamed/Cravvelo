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
import type { User } from "@clerk/nextjs/server";
import * as React from "react";

const AddCourse: FC = ({}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLaoding, setIsLoading] = React.useState(false);
  const mutation = trpc.createCourse.useMutation({
    onSuccess: ({ courseId }) => {
      router.push(`/courses/${courseId}`);
    },
    onError: () => {},
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof addCourseSchema>>({
    resolver: zodResolver(addCourseSchema),
    defaultValues: {
      title: "",
    },
  });

  // 2. Define a submit handler.
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
    <Dialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <DialogTrigger asChild>
        <Button className=" rounded-xl border flex items-center gap-x-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
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
          أنشئ دورة جديدة
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg" title="إضافة دورة جديدة">
        <div className="w-full px-4 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Button variant="ghost">إلغاء</Button>
                <Button
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
  );
};

export default AddCourse;
