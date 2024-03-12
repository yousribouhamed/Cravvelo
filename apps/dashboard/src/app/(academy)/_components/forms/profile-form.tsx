"use client";

import React, { ChangeEvent, useRef, type FC } from "react";
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
import { LoadingButton } from "@/src/components/loading-button";
import { Textarea } from "@ui/components/ui/textarea";
import { getOurSignedUrl } from "../../_actions/aws/s3";
import { computeSHA256 } from "@/src/lib/utils";
import { update_profile } from "../../_actions/auth";
import { maketoast } from "@/src/components/toasts";
import { Student } from "database";

const formSchema = z.object({
  full_name: z.string().min(2).max(50),
  bio: z.string(),
});

interface ProfileFormProps {
  studnet: Student;
}

const ProfileForm: FC<ProfileFormProps> = ({ studnet }) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const [loading, setLoading] = React.useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPreviewUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // const [isPending, startTransition] = React.useTransition();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: studnet.full_name,
      bio: studnet.bio,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("here it is the file");
    console.log(values);
    console.log(selectedFile);
    try {
      setLoading(true);
      if (selectedFile) {
        // get the checksum
        const checksum = await computeSHA256(selectedFile);
        // get the signed url
        const { success } = await getOurSignedUrl({
          checksum,
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
        });
        // upload it to aws

        console.log("this is from aws");
        console.log(success);

        if (!success || !success?.url) {
          console.log("there is no selected file");
          throw new Error("there is no selected file");
        }
        await fetch(success?.url, {
          method: "put",
          body: selectedFile,
          headers: {
            "content-type": selectedFile.type,
          },
        });

        // update the data on our app

        console.log("we are uploding the image url");

        await update_profile({
          bio: values.bio,
          full_name: values.full_name,
          imageUrl: success.url.split("?")[0],
        });
        setLoading(false);
        maketoast.successWithText({ text: "تم تحديث ملفك" });
      } else {
        // update the data on our app
        await update_profile({
          bio: values.bio,
          full_name: values.full_name,
          imageUrl: "",
        });
        setLoading(false);
        maketoast.successWithText({ text: "تم تحديث ملفك" });
      }
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="w-full h-fit min-h-[500px] bg-white shadow border rounded-xl max-w-2xl p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
          <div className="w-full  flex flex-col items-start justify-start p-4 gap-x-4">
            <h2>صورتك الشخصية</h2>
            <div className="flex items-center gap-x-4 w-[200px] ">
              <Avatar className="w-12 h-12 ring-primary   rounded-[50%]">
                <AvatarImage
                  src={
                    previewUrl
                      ? previewUrl
                      : studnet.photo_url ??
                        "https://st.depositphotos.com/2218212/2938/i/450/depositphotos_29387653-stock-photo-facebook-profile.jpg"
                  }
                />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>

              <div>
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="border-2 border-gray-300 rounded-md p-2 flex items-center space-x-2">
                    <span className="text-gray-500">اختر صورة</span>
                  </div>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم الكامل</FormLabel>
                <FormControl>
                  <Input placeholder="مثلا : عبدالله" {...field} />
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
                  <Textarea
                    className="min-h-[150px] h-fit"
                    placeholder="يمكنك كتابة اي شيئ هنا"
                    {...field}
                  />
                </FormControl>
                <FormDescription>سيتم عرض هذا لمدربك</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full h-[50px] flex items-center justify-end">
            <LoadingButton className="bg-primary rounded-lg " type="submit">
              {loading ? "loading" : "  حفظ التعديلات"}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
