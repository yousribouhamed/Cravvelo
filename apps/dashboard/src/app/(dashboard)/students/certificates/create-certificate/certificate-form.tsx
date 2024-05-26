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
  FormMessage,
} from "@ui/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/ui/select";

import { usePathname, useRouter } from "next/navigation";
import { maketoast } from "@/src/components/toasts";
import { Student } from "database";
import { Input } from "@ui/components/ui/input";
import { Card } from "@ui/lib/tremor";
import { CardContent } from "@ui/components/ui/card";
import { LoadingSpinner } from "@ui/icons/loading-spinner";

const FormSchema = z.object({
  studentName: z.string(),
  courseName: z.string(),
  cerrificateName: z.string(),
  studentId: z.string(),
});

interface CertificateProps {
  students: Student[];
}

function CertificateForm({ students }: CertificateProps) {
  const router = useRouter();
  const path = usePathname();

  // this variable will determen what is going to be seen in the view of the screen
  const [isCertificateSeen, setIsCertificateSeen] =
    React.useState<boolean>(false);

  const mutation = trpc.createCertificate.useMutation({
    onSuccess: () => {
      maketoast.success();
      router.push(`/students/certificates`);
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

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    await mutation.mutateAsync({
      cerrificateName: values.cerrificateName,
      courseName: values.courseName,
      studentId: values.studentId,
      studentName: values.studentName,
    });
  }

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
        {/* <Button
          onClick={() => setIsCertificateSeen(true)}
          variant="ghost"
          className={`${
            isCertificateSeen ? "border-b-4 border-yellow-500 " : ""
          } h-full rounded-[0] `}
        >
          التصميم
        </Button> */}
      </div>
      <div className="w-full h-full">
        {isCertificateSeen ? (
          <div className="w-full h-full flex flex-wrap gap-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item + item + "some"}
                className="w-[130px] h-[80px] bg-white border-2 border-black rounded-xl "
              ></div>
            ))}
          </div>
        ) : (
          <Form {...form}>
            <form
              id="add-certificate"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="cerrificateName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      اسم الشهادة{" "}
                      <span className="text-red-600 text-xl">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="اين تذهب الشمس عندما يحل الليل"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="courseName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      اسم الدورة <span className="text-red-600 text-xl">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="اين تذهب الشمس عندما يحل الليل"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      اسم الطالب <span className="text-red-600 text-xl">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="اين تذهب الشمس عندما يحل الليل"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الطالب المعني بالشهادة</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a student" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {students.map((item) => {
                          return (
                            <SelectItem key={item.id} value={item.id}>
                              {item.full_name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Card className="w-full h-fit border-t bg-white">
                <CardContent className="w-full h-fit flex justify-end items-center   ">
                  <Button
                    disabled={mutation.isLoading}
                    type="submit"
                    className=" flex items-center gap-x-2 rounded-xl"
                  >
                    {mutation.isLoading ? <LoadingSpinner /> : null}
                    حفظ والمتابعة
                  </Button>
                </CardContent>
              </Card>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}

export default CertificateForm;
