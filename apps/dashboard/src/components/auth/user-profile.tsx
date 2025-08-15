"use client";

import React, { useRef, type FC } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
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
import { FileWithPreview } from "@/src/types";
import { LoadingButton } from "@/src/components/loading-button";
import { isArrayOfFile } from "@/src/app/(academy)/lib";
import { Textarea } from "@ui/components/ui/textarea";
import { trpc } from "@/src/app/_trpc/client";
import { maketoast } from "../toasts";
import { LoadingSpinner } from "@ui/icons/loading-spinner";

const formSchema = z.object({
  full_name: z.string().min(2).max(50),
  bio: z.string(),
  images: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false;
      if (val.some((file) => !(file instanceof File))) return false;
      return true;
    }, "يجب أن تكون مجموعة من الملفات")
    .optional()
    .nullable()
    .default(null),
});

interface Profile {
  full_name: string;
  bio: string;
  image: string;
}

const UserProfileForm: FC<Profile> = ({ bio, full_name, image }) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null);

  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name,
      bio,
      images: [image],
    },
  });

  const mutation = trpc.update_user_profile.useMutation({
    onSuccess: () => {
      maketoast.success();
    },
    onError: () => {
      maketoast.error();
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isArrayOfFile(values.images)) {
        console.log("uploading... ");
      }
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="w-full h-fit min-h-[500px] bg-white shadow border rounded-xl  p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>صورة شخصة</FormLabel>
                <div className="flex items-center gap-x-4">
                  <Avatar>
                    <AvatarImage
                      src={files && files.length > 0 ? files[0].preview : ""}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <FormControl>
                    <FormControl></FormControl>
                  </FormControl>
                </div>
                <FormDescription>
                  الصورة الشخصية الخاصة بك في الاكادمية
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسمك الكامل</FormLabel>
                <FormControl>
                  <Input placeholder="اسمك الكامل" {...field} />
                </FormControl>
                <FormDescription>
                  هذا هو اسم العرض العام الخاص بك.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>السيرة الذاتية</FormLabel>
                <FormControl>
                  <Textarea rows={3} className="min-h-[120px]" {...field} />
                </FormControl>
                <FormDescription>صف نفسك في 200 كلمة</FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full h-[50px] flex items-center justify-end">
            <LoadingButton
              onClick={() => mutation.mutate()}
              className="bg-primary rounded-xl "
              type="submit"
              disabled={mutation?.isLoading}
            >
              {mutation.isLoading ? <LoadingSpinner /> : null}
              حفظ التعديلات
            </LoadingButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserProfileForm;
