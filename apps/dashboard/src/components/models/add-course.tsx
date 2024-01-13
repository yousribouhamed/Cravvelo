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
import React from "react";
import { Icons } from "../Icons";

interface AddCourseAbdullahProps {}

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
    const cookie = getCookie("academiaId");
    setIsLoading(true);
    await mutation
      .mutateAsync({
        title: data.title,
        academiaId: cookie,
      })
      .then(() => {
        setIsLoading(false);
      });
  }

  return (
    <Dialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <DialogTrigger asChild>
        <Button>أنشئ دورة جديدة</Button>
      </DialogTrigger>
      <DialogContent title="إضافة دورة جديدة">
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
                <Button type="submit">
                  {isLaoding && (
                    <Icons.spinner
                      className="ml-2 h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  )}
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
