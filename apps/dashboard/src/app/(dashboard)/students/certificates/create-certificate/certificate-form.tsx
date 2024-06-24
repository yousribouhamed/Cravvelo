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
import CertificateViewer from "./certificate-viewer";
import { CERTIFICATE_VARIANTS } from "@/src/constants/data";
import Image from "next/image";

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

  const [certificateTheme, setCertificateTheme] = React.useState<string | null>(
    CERTIFICATE_VARIANTS[0].code
  );

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
      code: certificateTheme,
    });
  }

  const studentName = form.watch("studentName");

  const courseName = form.watch("courseName");

  return (
    <div className="w-full min-h-[400px] h-fit grid grid-cols-3 mt-8 py-2   gap-4">
      <div className="col-span-1 w-full h-full   ">
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
              <div className="w-full h-full flex flex-wrap gap-4 bg-white ">
                {CERTIFICATE_VARIANTS.map((item) => {
                  return (
                    <div
                      onClick={() => setCertificateTheme(item.code)}
                      key={item.code}
                      className={` flex hover:bg-white hover:shadow cursor-pointer p-2 transition-all duration-300 rounded-xl border w-[150px] h-[150px] flex-col gap-y-2 ${
                        item.code === certificateTheme
                          ? "border-2 border-blue-500 "
                          : ""
                      } `}
                    >
                      <div className="w-full h-[80%] relative  flex items-center justify-center">
                        <Image src={item.image} fill alt={item.name} />
                      </div>

                      <div className="w-full h-[20%] flex items-center justify-start border-t ">
                        <p className="text-sm text-black text-center">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
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
                          اسم الدورة{" "}
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
                    name="studentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          اسم الطالب{" "}
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
                  <div className="w-full h-[100px] bg-white shadow border flex items-center justify-end p-4">
                    <Button
                      disabled={mutation.isLoading}
                      type="submit"
                      className=" flex items-center gap-x-2 rounded-xl"
                    >
                      {mutation.isLoading ? <LoadingSpinner /> : null}
                      حفظ والمتابعة
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
      <div className="col-span-2 w-full h-full  ">
        <CertificateViewer courseName={courseName} student_name={studentName} />
      </div>
    </div>
  );
}

export default CertificateForm;
