"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { useState, type FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@ui/components/ui/dialog";
import { Button } from "@ui/components/ui/button";
import { Textarea } from "@ui/components/ui/textarea";
import { trpc } from "@/src/app/_trpc/client";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "../../toasts";

const FormSchema = z.object({
  title: z.string(),
  description: z.string(),
  subdomain: z.string(),
});

const PublishWebsite: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const mutation = trpc.createWebSite.useMutation({
    onSuccess: (site) => {
      setIsOpen(false);
      window.location.reload();
    },
    onError: (err) => {
      console.log(err);
      setIsOpen(false);
      maketoast.errorWithTest({
        text: "لقد فشلنا في إنشاء موقع الويب الخاص بك",
      });
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    mutation.mutate({
      description: values.description,
      name: values.title,
      subdomain: values.subdomain,
    });
  }
  return (
    <Dialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className=" text-white font-bold rounded-xl bg-[#303030] px-4"
        >
          انشاء الاكاديمية
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg " title="إنشاء موقع الويب الخاص بك">
        <Form {...form}>
          <form
            id="createwebsiteform"
            onSubmit={form.handleSubmit(onSubmit)}
            className=" space-y-6 p-4 w-full"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> اسم الأكاديمية</FormLabel>
                  <FormControl>
                    <Input
                      className="dark:bg-[#252525]"
                      placeholder="عنوان الموقع"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وصف موجز للموقع</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      className="dark:bg-[#252525] min-h-[100px] h-fit"
                      placeholder="وصف موجز للموقع"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subdomain"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>حدد اسم المجال الخاص بك</FormLabel>
                  <div className="w-full h-14 border rounded-xl flex items-center p-2">
                    <div className="w-[150px] h-full flex items-center justify-center bg-gray-50">
                      <span>carvvelo.com.</span>
                    </div>
                    <Input
                      className="border-none "
                      placeholder="  حدد اسم المجال الخاص بك"
                      {...field}
                    />
                  </div>
                  <FormDescription>
                    لا تقلق كثيرًا بشأن ذلك، يمكنك إضافة نطاقك المخصص لاحقًا
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="p-4">
          <Button
            form="createwebsiteform"
            className=" flex items-center gap-x-2 font-bold rounded-xl"
            disabled={mutation.isLoading}
            type="submit"
          >
            {mutation.isLoading ? <LoadingSpinner /> : null}
            إطلاق موقع الويب الخاص بي
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PublishWebsite;
