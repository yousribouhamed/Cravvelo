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
import { getOurSignedUrl } from "../../(academy)/_actions/aws/s3";
import { computeSHA256 } from "@/src/lib/utils";
import { maketoast } from "@/src/components/toasts";
import { Account } from "database";
import { trpc } from "../../_trpc/client";

const formSchema = z.object({
  full_name: z.string().min(2).max(50),
  bio: z.string(),
  email: z.string(),
  phone: z.string(),
});

interface ProfileFormProps {
  account: Account;
}

const UserProfileForm: FC<ProfileFormProps> = ({ account }) => {
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: account.user_name,
      bio: account.user_bio,
      email: "",
      phone: account.phone ? account.phone?.toString() : "",
    },
  });

  const mutation = trpc.update_user_profile.useMutation({
    onSuccess: () => {
      maketoast.successWithText({ text: "تم تحديث ملفك الشخصي" });
    },
    onError: () => {
      maketoast.error();
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
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

        if (!success || !success?.url) {
          throw new Error("there is no selected file");
        }
        await fetch(success?.url, {
          method: "put",
          body: selectedFile,
          headers: {
            "content-type": selectedFile.type,
          },
        });

        await mutation.mutateAsync({
          avatarUrl: success.url.split("?")[0],
          user_bio: values.bio,
          user_name: values.full_name,
          phoneNumber: Number(values.phone),
        });
        setLoading(false);
      } else {
        await mutation.mutateAsync({
          avatarUrl: "",
          user_bio: values.bio,
          user_name: values.full_name,
          phoneNumber: Number(values.phone),
        });
        setLoading(false);
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
                      : account.avatarUrl ??
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel> رقم التليفون</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="مثلا : 053874666"
                    {...field}
                  />
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>البريد الإلكتروني الدعم الخاص بك</FormLabel>
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

                <FormDescription> قل شيئًا رائعًا </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full h-[50px] flex items-center justify-end">
            <LoadingButton
              pending={loading}
              className="bg-primary rounded-lg "
              type="submit"
            >
              حفظ التعديلات
            </LoadingButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserProfileForm;
