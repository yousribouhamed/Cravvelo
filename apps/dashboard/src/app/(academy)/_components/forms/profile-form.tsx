"use client";

import React, { useRef, type FC } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { Button } from "@ui/components/ui/button";
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
import { FileDialog } from "../uploaders/file-dialog";
import { LoadingButton } from "@/src/components/loading-button";
import { isArrayOfFile } from "../../lib";
import { useUploadThing } from "@/src/lib/uploadthing";
import { update_profile } from "../../_actions/auth";

const formSchema = z.object({
  full_name: z.string().min(2).max(50),
  bio: z.string(),
  images: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false;
      if (val.some((file) => !(file instanceof File))) return false;
      return true;
    }, "Must be an array of File")
    .optional()
    .nullable()
    .default(null),
});

interface ProfileFormProps {}

const ProfileForm: FC = ({}) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = React.useState<FileWithPreview[] | null>(null);

  const [isPending, startTransition] = React.useTransition();

  const { isUploading, startUpload } = useUploadThing("profileImage");

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      bio: "",
      images: [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isArrayOfFile(values.images)) {
        console.log("uploading... ");
        await startUpload(values.images)
          .then((res) => {
            const formattedImages = res?.map((image) => ({
              id: image.key,
              name: image.key.split("_")[1] ?? image.key,
              url: image.url,
            }));
            return formattedImages ?? null;
          })
          .then((images) => {
            console.log("these are the images ");
            console.log(images);
          })
          .catch((err) => console.error(err));
      }
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="w-full h-fit min-h-[500px] bg-white shadow border rounded-xl max-w-2xl p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم الكامل</FormLabel>
                <div className="flex items-center gap-x-4">
                  <Avatar>
                    <AvatarImage
                      src={files && files.length > 0 ? files[0].preview : ""}
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <FormControl>
                    <FormControl>
                      <FileDialog
                        setValue={form.setValue}
                        name="images"
                        maxFiles={1}
                        maxSize={1024 * 1024 * 4}
                        files={files}
                        setFiles={setFiles}
                        isUploading={isUploading}
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormControl>
                </div>
                <FormDescription>
                  هذا هو اسم العرض العام الخاص بك.
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
                <FormLabel>الاسم الكامل</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
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
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>سيتم عرض هذا لمدربك</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full h-[50px] flex items-center justify-end">
            <LoadingButton className="bg-blue-500 rounded-xl " type="submit">
              Submit
            </LoadingButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
