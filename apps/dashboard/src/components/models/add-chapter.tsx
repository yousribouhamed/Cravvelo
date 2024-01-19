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
import { getCookie, getValueFromUrl } from "@/src/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import React from "react";
import { Icons } from "../Icons";

interface Props {
  refetch: () => Promise<any>;
  chaptersNumber: number;
}

const AddChapter: FC<Props> = ({ refetch, chaptersNumber }) => {
  const router = useRouter();
  const path = usePathname();
  const courseID = getValueFromUrl(path, 2);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLaoding, setIsLoading] = React.useState(false);

  const mutation = trpc.createChapter.useMutation({
    onSuccess: async ({}) => {
      // router.push(`/courses/${courseId}`);
      await refetch();
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
    setIsLoading(true);
    await mutation
      .mutateAsync({
        title: data.title,
        courseId: courseID,
        orderNumber: chaptersNumber + 1,
      })
      .then(() => {
        setIsLoading(false);
        setIsOpen(false);
      });
  }

  return (
    <Dialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-2xl h-14">
          <svg
            width="25"
            height="25"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.7962 34.996C7.27536 28.2559 8.26372 18.3164 15.0038 12.7956C21.7439 7.27465 31.6833 8.26307 37.2042 15.0031C42.7251 21.7433 41.7368 31.6826 34.9966 37.2035C28.2566 42.7244 18.3171 41.7361 12.7962 34.996Z"
              fill="#FFFAFA"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M25.001 16.445C25.9023 16.445 26.6329 17.1757 26.6329 18.077L26.6329 31.9245C26.6329 32.8258 25.9023 33.5564 25.001 33.5564C24.0997 33.5564 23.369 32.8258 23.369 31.9245L23.369 18.077C23.369 17.1757 24.0997 16.445 25.001 16.445Z"
              fill="#43766C"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M33.5567 25.0007C33.5567 25.902 32.826 26.6327 31.9247 26.6327H18.0772C17.1759 26.6327 16.4453 25.902 16.4453 25.0007C16.4453 24.0994 17.1759 23.3688 18.0772 23.3688H31.9247C32.826 23.3688 33.5567 24.0994 33.5567 25.0007Z"
              fill="#43766C"
            />
          </svg>
          اضافة قسم جديد للدورة
        </Button>
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
                    <FormLabel> عنوان الفصل *</FormLabel>
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

export default AddChapter;
