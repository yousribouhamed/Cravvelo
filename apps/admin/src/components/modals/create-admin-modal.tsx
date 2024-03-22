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

import { trpc } from "@/src/app/_trpc/client";
import { useRouter } from "next/navigation";
import * as React from "react";
import { maketoast } from "../toasts";

export const CreateAdminModalSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

const CreateAdminModal: FC<{ refetch: () => Promise<any> }> = ({ refetch }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLaoding, setIsLoading] = React.useState(false);
  const mutation = trpc.createAdmin.useMutation({
    onSuccess: async () => {
      await refetch();
      maketoast.successWithText({ text: "تم انشاء الدورة بنجاح" });
      setIsOpen(false);
    },
    onError: () => {
      maketoast.error();
      setIsOpen(false);
    },
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof CreateAdminModalSchema>>({
    resolver: zodResolver(CreateAdminModalSchema),
  });

  // 2. Define a submit handler.
  async function onSubmit(data: z.infer<typeof CreateAdminModalSchema>) {
    setIsLoading(true);
    await mutation
      .mutateAsync({
        email: data.email,
        name: data.name,
        password: data.password,
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
          إنشاء حساب المسؤول
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg" title="إنشاء حساب مسؤول جديد">
        <div className="w-full px-4 pb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم المشرف</FormLabel>
                    <FormControl>
                      <Input placeholder="any name ...." {...field} />
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
                    <FormLabel>البريد الإلكتروني المشرف</FormLabel>
                    <FormControl>
                      <Input placeholder="abdullah@caravvelo.com" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كلمة سر المشرف</FormLabel>
                    <FormControl>
                      <Input placeholder="*****" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="w-full h-[50px] flex items-center justify-end gap-x-4">
                <Button
                  onClick={() => setIsOpen(false)}
                  type="button"
                  data-ripple-light="true"
                  variant="ghost"
                >
                  إلغاء
                </Button>
                <Button
                  data-ripple-light="true"
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

export default CreateAdminModal;
