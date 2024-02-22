"use client";

import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { trpc } from "@/src/app/_trpc/client";
import { Button } from "@ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@ui/components/ui/form";
import { Switch } from "@ui/components/ui/switch";
import { Card, CardContent } from "@ui/components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { getValueFromUrl } from "@/src/lib/utils";
import { maketoast } from "@/src/components/toasts";
import { Course } from "database";
import { Input } from "@ui/components/ui/input";

const FormSchema = z.object({
  allowComments: z.boolean(),
  cerrificate: z.boolean(),
});

interface StudentEngagmentProps {
  course: Course;
}

function CertificateForm() {
  const router = useRouter();
  const path = usePathname();

  // this variable will determen what is going to be seen in the view of the screen
  const [isCertificateSeen, setIsCertificateSeen] =
    React.useState<boolean>(false);

  const mutation = trpc.updateCourseStudentEngagment.useMutation({
    onSuccess: () => {
      maketoast.success();
      router.push(`/`);
    },
    onError: (err) => {
      maketoast.error();
      console.error(err);
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onChange",
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {}

  return (
    <div className="w-full h-fir gap-x-8 ">
      <div className="w-full h-[50px]  border bg-white mb-4">
        <Button
          onClick={() => setIsCertificateSeen(false)}
          variant="ghost"
          className={`${
            isCertificateSeen ? "" : "border-b-4 border-yellow-500 "
          } h-full rounded-[0] `}
        >
          المحتوى
        </Button>
        <Button
          onClick={() => setIsCertificateSeen(true)}
          variant="ghost"
          className={`${
            isCertificateSeen ? "border-b-4 border-yellow-500 " : ""
          } h-full rounded-[0] `}
        >
          التصميم
        </Button>
      </div>
      <div className="w-full h-full">
        {isCertificateSeen ? (
          <div className="w-full h-full flex flex-wrap gap-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div className="w-[130px] h-[80px] bg-white border-2 border-black rounded-xl "></div>
            ))}
          </div>
        ) : (
          <Form {...form}>
            <form
              id="add-certificate"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <div>
                <div className="space-y-4">
                  <div className="space-y-2 bg-white rounded-xl border p-3">
                    <FormField
                      control={form.control}
                      name="allowComments"
                      render={({ field }) => (
                        <FormItem className="flex flex-row bg-white items-center justify-between">
                          <div className="space-y-0.5">
                            <FormLabel>اسم الشهادة</FormLabel>
                          </div>
                          <FormControl>
                            <div dir="ltr">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="allowComments"
                      render={({ field }) => (
                        <FormItem className="flex flex-row bg-white items-center justify-between ">
                          <FormControl>
                            <Input className="w-full" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2 bg-white rounded-xl border p-3">
                    <FormField
                      control={form.control}
                      name="allowComments"
                      render={({ field }) => (
                        <FormItem className="flex flex-row  items-center justify-between rounded-lg">
                          <div className="space-y-0.5">
                            <FormLabel>العنوان الفرعي</FormLabel>
                          </div>
                          <FormControl>
                            <div dir="ltr">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="allowComments"
                      render={({ field }) => (
                        <FormItem className="flex flex-row bg-white items-center justify-between ">
                          <FormControl>
                            <Input className="w-full" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2 bg-white rounded-xl border p-3">
                    <FormField
                      control={form.control}
                      name="allowComments"
                      render={({ field }) => (
                        <FormItem className="flex flex-row  items-center justify-between rounded-lg">
                          <div className="space-y-0.5">
                            <FormLabel>نص ما فوق سبب منح الشهادة</FormLabel>
                          </div>
                          <FormControl>
                            <div dir="ltr">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="allowComments"
                      render={({ field }) => (
                        <FormItem className="flex flex-row bg-white items-center justify-between ">
                          <FormControl>
                            <Input className="w-full" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2 bg-white rounded-xl border p-3">
                    <FormField
                      control={form.control}
                      name="allowComments"
                      render={({ field }) => (
                        <FormItem className="flex flex-row  items-center justify-between rounded-lg">
                          <div className="space-y-0.5">
                            <FormLabel>نص ما فوق اسم المعلم</FormLabel>
                          </div>
                          <FormControl>
                            <div dir="ltr">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="allowComments"
                      render={({ field }) => (
                        <FormItem className="flex flex-row bg-white items-center justify-between ">
                          <FormControl>
                            <Input className="w-full" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2 bg-white rounded-xl border p-3">
                    <FormField
                      control={form.control}
                      name="allowComments"
                      render={({ field }) => (
                        <FormItem className="flex flex-row  items-center justify-between rounded-lg">
                          <div className="space-y-0.5">
                            <FormLabel>تاريخ اصدار الشهادة</FormLabel>
                          </div>
                          <FormControl>
                            <div dir="ltr">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="allowComments"
                      render={({ field }) => (
                        <FormItem className="flex flex-row bg-white items-center justify-between ">
                          <FormControl>
                            <Input className="w-full" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2 bg-white rounded-xl border p-3">
                    <FormField
                      control={form.control}
                      name="allowComments"
                      render={({ field }) => (
                        <FormItem className="flex flex-row  items-center justify-between rounded-lg">
                          <div className="space-y-0.5">
                            <FormLabel>رقم الشهادة التسلسلي</FormLabel>
                          </div>
                          <FormControl>
                            <div dir="ltr">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="allowComments"
                      render={({ field }) => (
                        <FormItem className="flex flex-row bg-white items-center justify-between ">
                          <FormControl>
                            <Input className="w-full" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-2 bg-white rounded-xl border p-3">
                    <FormField
                      control={form.control}
                      name="allowComments"
                      render={({ field }) => (
                        <FormItem className="flex flex-row  items-center justify-between rounded-lg">
                          <div className="space-y-0.5">
                            <FormLabel>رابط التحقق من الشهادة</FormLabel>
                          </div>
                          <FormControl>
                            <div dir="ltr">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="allowComments"
                      render={({ field }) => (
                        <FormItem className="flex flex-row bg-white items-center justify-between ">
                          <FormControl>
                            <Input className="w-full" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}

export default CertificateForm;
