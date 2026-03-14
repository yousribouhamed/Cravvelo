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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/components/ui/popover";

import { useRouter } from "next/navigation";
import { maketoast } from "@/src/components/toasts";
import { Student } from "database";
import { Input } from "@ui/components/ui/input";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import CertificateViewer from "./certificate-viewer";
import { CERTIFICATE_VARIANTS } from "@/src/constants/data";
import Image from "next/image";
import SunCertificateViewer from "./sun-certificate-viewer";
import DeerCertificateViewer from "./deer-certificate-viewer";
import { Check, ChevronsUpDown, Hammer } from "lucide-react";
import { useTranslations } from "next-intl";

const FormSchema = z.object({
  studentName: z.string().min(1),
  courseName: z.string().min(1),
  certificateName: z.string().min(1),
  studentId: z.string().min(1),
});

interface CertificateProps {
  stamp: string | null;
  students: Student[];
}

export default function CertificateForm({ students, stamp }: CertificateProps) {
  const router = useRouter();
  const t = useTranslations("certificates");
  const STUDENTS_PER_PAGE = 8;

  // this variable will determen what is going to be seen in the view of the screen
  const [isCertificateSeen, setIsCertificateSeen] =
    React.useState<boolean>(false);

  const [certificateTheme, setCertificateTheme] = React.useState<string>(
    CERTIFICATE_VARIANTS[0]?.code ?? "COLD_CERTIFICATE"
  );
  const [studentPickerOpen, setStudentPickerOpen] = React.useState(false);
  const [studentSearch, setStudentSearch] = React.useState("");
  const [studentPage, setStudentPage] = React.useState(1);

  React.useEffect(() => {
    CERTIFICATE_VARIANTS.forEach((variant) => {
      const img = new window.Image();
      img.src = variant.image;
    });
  }, []);

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
      certificateName: values.certificateName,
      courseName: values.courseName,
      studentId: values.studentId,
      studentName: values.studentName,
      code: certificateTheme,
    });
  }

  const studentName = form.watch("studentName");

  const courseName = form.watch("courseName");
  const selectedStudentId = form.watch("studentId");

  const filteredStudents = React.useMemo(() => {
    const query = studentSearch.trim().toLowerCase();
    if (!query) return students;
    return students.filter((student) =>
      student.full_name.toLowerCase().includes(query)
    );
  }, [students, studentSearch]);

  const totalStudentPages = Math.max(
    1,
    Math.ceil(filteredStudents.length / STUDENTS_PER_PAGE)
  );

  const paginatedStudents = React.useMemo(() => {
    const start = (studentPage - 1) * STUDENTS_PER_PAGE;
    return filteredStudents.slice(start, start + STUDENTS_PER_PAGE);
  }, [filteredStudents, studentPage, STUDENTS_PER_PAGE]);

  React.useEffect(() => {
    setStudentPage(1);
  }, [studentSearch]);

  React.useEffect(() => {
    setStudentPage((prev) => Math.min(prev, totalStudentPages));
  }, [totalStudentPages]);

  return (
    <div className="w-full min-h-[400px] h-fit grid grid-cols-1 lg:grid-cols-3 mt-8 py-2 gap-4">
      <div className="lg:col-span-1 w-full h-full order-2 lg:order-1">
        <div className="w-full h-full gap-x-8">
          <div className="w-full flex rounded-lg border border-border bg-card/50 p-1 mb-4">
            <Button
              onClick={() => setIsCertificateSeen(false)}
              variant="ghost"
              size="sm"
              className={`flex-1 rounded-md ${
                !isCertificateSeen
                  ? "bg-primary text-white shadow-sm hover:bg-primary/90 hover:text-white dark:text-primary-foreground dark:hover:text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("tabs.content")}
            </Button>
            <Button
              onClick={() => setIsCertificateSeen(true)}
              variant="ghost"
              size="sm"
              className={`flex-1 rounded-md ${
                isCertificateSeen
                  ? "bg-primary text-white shadow-sm hover:bg-primary/90 hover:text-white dark:text-primary-foreground dark:hover:text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("tabs.design")}
            </Button>
          </div>
          <div className="w-full h-full">
            {isCertificateSeen ? (
              <div className="w-full h-full flex flex-wrap gap-3 bg-card rounded-lg border border-border p-4">
                <p className="w-full text-sm text-muted-foreground mb-1">
                  {t("tabs.chooseTemplate")}
                </p>
                {CERTIFICATE_VARIANTS.map((item) => {
                  const variantKey = item.code === "DEAD_DEER" ? "deadDeer" 
                    : item.code === "PARTY_UNDER_SUN" ? "partyUnderSun" 
                    : "coldCertificate";
                  const isSelected = item.code === certificateTheme;
                  return (
                    <button
                      type="button"
                      onClick={() => setCertificateTheme(item.code)}
                      key={item.code}
                      className={`flex hover:bg-accent/50 cursor-pointer p-2 transition-all duration-200 rounded-lg border text-left w-[130px] h-[130px] sm:w-[150px] sm:h-[150px] flex-col gap-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                    >
                      <div className="w-full h-[78%] relative flex items-center justify-center rounded-md overflow-hidden bg-muted/30">
                        <Image src={item.image} fill alt={t(`variants.${variantKey}`)} className="object-contain" />
                      </div>
                      <p className="text-xs font-medium text-foreground text-center w-full truncate leading-tight">
                        {t(`variants.${variantKey}`)}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
              <Form {...(form as any)}>
                <form
                  id="add-certificate"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6 sm:space-y-8"
                >
                  <FormField
                    control={form.control as any}
                    name="certificateName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("form.certificateName")}{" "}
                          <span className="text-red-600 text-xl">{t("form.required")}</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("form.certificateNamePlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="courseName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("form.courseName")}{" "}
                          <span className="text-red-600 text-xl">{t("form.required")}</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("form.courseNamePlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="studentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("form.studentName")}{" "}
                          <span className="text-red-600 text-xl">{t("form.required")}</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("form.studentNamePlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control as any}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.selectStudent")}</FormLabel>
                        <Popover
                          open={studentPickerOpen}
                          onOpenChange={(open) => {
                            setStudentPickerOpen(open);
                            if (!open) setStudentSearch("");
                          }}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                role="combobox"
                                aria-expanded={studentPickerOpen}
                                className="w-full justify-between font-normal"
                              >
                                <span className="truncate text-left">
                                  {students.find((s) => s.id === field.value)
                                    ?.full_name || t("form.selectStudentPlaceholder")}
                                </span>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            align="start"
                            className="w-[var(--radix-popover-trigger-width)] p-0"
                          >
                            <div className="border-b p-2">
                              <Input
                                value={studentSearch}
                                onChange={(e) => setStudentSearch(e.target.value)}
                                placeholder={t("form.searchStudentPlaceholder")}
                                className="h-9"
                              />
                            </div>

                            <div className="max-h-64 overflow-y-auto p-1">
                              {paginatedStudents.length === 0 ? (
                                <p className="py-6 text-center text-sm text-muted-foreground">
                                  {t("form.noStudentsFound")}
                                </p>
                              ) : (
                                paginatedStudents.map((student) => {
                                  const isSelected = selectedStudentId === student.id;
                                  return (
                                    <button
                                      key={student.id}
                                      type="button"
                                      onClick={() => {
                                        field.onChange(student.id);
                                        form.setValue("studentName", student.full_name, {
                                          shouldValidate: true,
                                        });
                                        setStudentPickerOpen(false);
                                      }}
                                      className="w-full flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent text-left"
                                    >
                                      <span className="truncate">{student.full_name}</span>
                                      {isSelected ? (
                                        <Check className="h-4 w-4 text-primary" />
                                      ) : null}
                                    </button>
                                  );
                                })
                              )}
                            </div>

                            <div className="flex items-center justify-between border-t px-2 py-1.5">
                              <span className="text-xs text-muted-foreground">
                                {t("form.studentsCount", { count: filteredStudents.length })}
                              </span>
                              <div className="flex items-center gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2"
                                  onClick={() =>
                                    setStudentPage((prev) => Math.max(1, prev - 1))
                                  }
                                  disabled={studentPage === 1}
                                >
                                  {t("table.previous")}
                                </Button>
                                <span className="text-xs text-muted-foreground px-1">
                                  {studentPage}/{totalStudentPages}
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2"
                                  onClick={() =>
                                    setStudentPage((prev) =>
                                      Math.min(totalStudentPages, prev + 1)
                                    )
                                  }
                                  disabled={studentPage === totalStudentPages}
                                >
                                  {t("table.next")}
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="w-full min-h-[72px] flex items-center justify-end pt-4 mt-4 border-t border-border">
                    <Button
                      disabled={mutation.isLoading}
                      type="submit"
                      className="flex items-center gap-x-2 rounded-xl"
                    >
                      {mutation.isLoading ? (
                        <LoadingSpinner />
                      ) : (
                        <Hammer className="w-4 h-4" />
                      )}
                      {t("form.buildCertificate")}
                    </Button>
                  </div>
                </form>
              </Form>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="lg:col-span-2 w-full h-full order-1 lg:order-2 min-w-0 overflow-x-auto">
        {certificateTheme === "COLD_CERTIFICATE" ? (
          <CertificateViewer
            courseName={courseName}
            student_name={studentName}
            stamp={stamp}
          />
        ) : certificateTheme === "DEAD_DEER" ? (
          <DeerCertificateViewer
            courseName={courseName}
            student_name={studentName}
            stamp={stamp}
          />
        ) : (
          <SunCertificateViewer
            courseName={courseName}
            stamp={stamp}
            student_name={studentName}
          />
        )}
      </div>
    </div>
  );
}


