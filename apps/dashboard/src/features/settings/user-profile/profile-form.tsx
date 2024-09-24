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
import { getOurSignedUrl } from "@/src/app/(academy)/_actions/aws/s3";
import { computeSHA256 } from "@/src/lib/utils";
import { maketoast } from "@/src/components/toasts";
import { Account } from "database";
import { trpc } from "@/src/app/_trpc/client";

const formSchema = z.object({
  full_name: z.string().min(2).max(50),
  bio: z.string(),
  email: z.string(),
  phone: z.string(),
});

interface ProfileFormProps {
  account: Account;
  lang: string;
}

const UserProfileForm: FC<ProfileFormProps> = ({ account, lang }) => {
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
      email: account.support_email,
      phone: account.phone ? account.phone?.toString() : "",
    },
  });

  const mutation = trpc.update_user_profile.useMutation({
    onSuccess: () => {
      maketoast.successWithText({ text: "تم تحديث ملفك الشخصي" });
      window.location.reload();
    },
    onError: () => {
      maketoast.error();
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      if (selectedFile) {
        const checksum = await computeSHA256(selectedFile);

        const { success } = await getOurSignedUrl({
          checksum,
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
        });

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
          support_email: values.email,
          user_name: values.full_name,
          phoneNumber: Number(values.phone),
        });
        setLoading(false);
      } else {
        await mutation.mutateAsync({
          avatarUrl: "",
          user_bio: values.bio,
          user_name: values.full_name,
          support_email: values.email,
          phoneNumber: Number(values.phone),
        });
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="w-full mx-auto h-fit min-h-[200px] bg-white shadow border rounded-2xl  p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 "
          // dir={lang === "en" ? "ltr" : "rtl"}
        >
          <div className="w-full  flex flex-col items-start justify-start p-4 gap-x-4">
            <h2>your profile image</h2>
            <div className="flex items-center gap-x-4 w-full ">
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

              <div className="w-fit">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="border-2 border-gray-300 rounded-md p-2 flex items-center space-x-2">
                    <span className="text-gray-500">chose an image</span>
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
                <FormLabel>full name</FormLabel>
                <FormControl>
                  <Input placeholder="like abdullah" {...field} />
                </FormControl>
                <FormDescription>this is your display name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>phone number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="مثلا : 053874666"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>your support email</FormLabel>
                <FormControl>
                  <Input placeholder="مثلا : عبدالله" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>bio</FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-[150px] h-fit"
                    placeholder="يمكنك كتابة اي شيئ هنا"
                    {...field}
                  />
                </FormControl>

                <FormDescription>tell us more about you</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex items-center justify-end">
            <LoadingButton
              pending={loading}
              className="bg-primary rounded-2xl  "
              type="submit"
            >
              save
            </LoadingButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserProfileForm;
