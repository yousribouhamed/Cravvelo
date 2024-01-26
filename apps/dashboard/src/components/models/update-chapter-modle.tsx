"use client";

import { trpc } from "@/src/app/_trpc/client";
import { useMounted } from "@/src/hooks/use-mounted";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@ui/components/ui/dialog";
import type { FC } from "react";
import * as React from "react";
import { maketoast } from "../toasts";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { updateChapterSchema } from "@/src/lib/validators/course";

interface UpdateChapterProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => Promise<any>;
  chapterId: string | null;
  prevTitle: string;
}

const UpdateChapterModel: FC<UpdateChapterProps> = ({
  isOpen,
  setIsOpen,
  chapterId,
  refetch,
  prevTitle,
}) => {
  const mounted = useMounted();

  const mutation = trpc.updateChapterTitle.useMutation({
    onSuccess: async () => {
      await refetch();
      setIsOpen(false);
    },
    onError: () => {
      maketoast.error();
      console.error("something went wrong on the Update chapter model");
      setIsOpen(false);
    },
  });
  const form = useForm<z.infer<typeof updateChapterSchema>>({
    resolver: zodResolver(updateChapterSchema),
    defaultValues: {
      title: prevTitle,
    },
  });

  function onSubmit(data: z.infer<typeof updateChapterSchema>) {
    if (chapterId === null) {
      return;
    }
    mutation.mutate({
      title: data.title,
      chapterId: chapterId,
    });
  }

  if (!mounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <DialogContent className="max-w-lg" title="تحديث عنوان هذا الفصل">
        <div className="w-full px-4 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> الفصل *</FormLabel>
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
                <Button variant="ghost" onClick={() => setIsOpen(false)}>
                  إلغاء
                </Button>
                <Button
                  className=" flex items-center gap-x-2"
                  disabled={mutation.isLoading}
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

export default UpdateChapterModel;
