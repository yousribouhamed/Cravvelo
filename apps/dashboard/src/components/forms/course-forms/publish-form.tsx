"use client";

import { z } from "@/src/lib/zod-error-map";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@ui/components/ui/button";
import { Form, FormLabel } from "@ui/components/ui/form";
import { Card, CardContent } from "@ui/components/ui/card";
import * as React from "react";
import { trpc } from "@/src/app/_trpc/client";
import { maketoast } from "../../toasts";
import { usePathname, useRouter } from "next/navigation";
import { getValueFromUrl } from "@/src/lib/utils";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { Chapter, Course } from "database";
import Image from "next/image";
import { useCurrency } from "@/src/hooks/use-currency";
import { CoursePreviewCard } from "./course-preview-card";

export type CourseWithPricingForPublish = Course & {
  CoursePricingPlans?: Array<{
    isDefault: boolean;
    PricingPlan: {
      price: number | null;
      compareAtPrice: number | null;
      pricingType: string;
      accessDuration: string | null;
      accessDurationDays: number | null;
      currency?: string;
    };
  }>;
  _count?: { Sale: number };
};

interface PublishCourseFormProps {
  course: CourseWithPricingForPublish;
  chapters: Chapter[];
}

function getLevelLabel(level: string | null, tLevel: (key: string) => string): string {
  if (!level) return "—";
  switch (level) {
    case "BEGINNER":
      return tLevel("beginner");
    case "INTERMEDIATE":
      return tLevel("intermediate");
    case "ADVANCED":
      return tLevel("advanced");
    default:
      return level;
  }
}

function PublishCourseForm({ course, chapters }: PublishCourseFormProps) {
  const t = useTranslations("courses.publishCourse");
  const tLevel = useTranslations("courses.courseSettings.levels");
  const { formatPrice } = useCurrency();
  const router = useRouter();
  const path = usePathname();

  const defaultPlan = course.CoursePricingPlans?.find((p) => p.isDefault)?.PricingPlan;
  const isFree = defaultPlan?.pricingType === "FREE" || (defaultPlan?.price ?? 0) === 0;
  const accessLabel =
    defaultPlan?.pricingType === "ONE_TIME" && defaultPlan?.accessDuration === "LIMITED" && defaultPlan?.accessDurationDays
      ? t("limitedDays", { days: defaultPlan.accessDurationDays })
      : defaultPlan?.pricingType === "ONE_TIME"
        ? t("unlimited")
        : null;
  const courseID = getValueFromUrl(path, 2);

  const [selectedItem, setSelectedItem] = React.useState<
    "DRAFT" | "PUBLISHED" | "PUBLISED" | "EARLY_ACCESS" | "PRIVATE"
  >("PUBLISHED");

  const addTextSchema = z.object({});

  const selectionButtoms = [
    {
      title: t("selectionButtons.draft"),
      description: t("selectionButtons.draftDescription"),
      value: "DRAFT",
    },
    {
      title: t("selectionButtons.availableToAll"),
      description: t("selectionButtons.availableToAllDescription"),
      value: "PUBLISHED",
    },
  ];

  const form = useForm<z.infer<typeof addTextSchema>>({
    resolver: zodResolver(addTextSchema),
  });

  const mutation = trpc.course.launchCourse.useMutation({
    onSuccess: () => {
      maketoast.success();
      router.push(`/courses`);
    },
    onError: () => {
      maketoast.error();
    },
  });

  async function onSubmit() {
    await mutation.mutateAsync({
      courseId: courseID,
      status: selectedItem,
    });
  }

  return (
    <div className="w-full h-fit grid grid-cols-2 md:grid-cols-3 mt-4 gap-x-8">
      <div className="col-span-2 w-full min-h-full h-fit pb-6">
        <Form {...form}>
          <form
            id="add-text"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormLabel className="text-xl block font-bold text-foreground">
              {t("publishCourse")}
            </FormLabel>
            <FormLabel className="text-md block text-muted-foreground">
              Finalize and publish your course
            </FormLabel>

            {/* Course summary */}
            <Card className="bg-card border-border">
              <CardContent className="p-4 space-y-3">
                <FormLabel className="text-sm font-semibold text-foreground">
                  {t("courseSummary")}
                </FormLabel>
                <div className="flex gap-4 flex-wrap items-start">
                  {course.thumbnailUrl ? (
                    <div className="relative w-24 h-16 rounded-md overflow-hidden border border-border shrink-0">
                      <Image
                        src={course.thumbnailUrl}
                        alt={course.title ?? ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-16 rounded-md bg-muted border border-border shrink-0" />
                  )}
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <span><strong className="text-foreground">{t("level")}:</strong> {getLevelLabel(course.level, tLevel)}</span>
                    <span><strong className="text-foreground">{t("chaptersCount")}:</strong> {chapters.length}</span>
                    <span>
                      <strong className="text-foreground">{t("pricing")}:</strong>{" "}
                      {isFree ? t("free") : `${formatPrice(defaultPlan?.price ?? 0)} ${defaultPlan?.currency ?? "DZD"}`}
                    </span>
                    {accessLabel && (
                      <span><strong className="text-foreground">{t("accessDuration")}:</strong> {accessLabel}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <CoursePreviewCard course={course} />
          </form>
        </Form>
      </div>
      <div className="col-span-1 w-full h-fit self-start hidden md:block">
        <Card className="sticky top-24">
          <CardContent className="w-full h-fit flex flex-col p-6 space-y-4">
            <div className="space-y-2">
              {selectionButtoms.map((item) => (
                <Button
                  key={item.value}
                  type="button"
                  onClick={() => setSelectedItem(item.value as "DRAFT" | "PUBLISHED")}
                  variant="secondary"
                  size="lg"
                  className={`bg-card flex items-start justify-start flex-col gap-y-1 text-lg border border-border text-foreground min-h-[80px] w-full ${
                    selectedItem === item.value ? "border-primary border-2" : ""
                  }`}
                >
                  <span className="text-md font-bold text-start w-full">
                    {item.title}
                  </span>
                  <p className="text-muted-foreground text-sm text-start w-full">
                    {item.description}
                  </p>
                </Button>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <Button
                disabled={mutation.isLoading}
                type="submit"
                form="add-text"
                className="w-full flex items-center gap-x-2"
                size="lg"
              >
                {mutation.isLoading ? <LoadingSpinner /> : null}
                {t("publishCourse")}
              </Button>
              <Button
                onClick={() => router.back()}
                className="w-full"
                variant="secondary"
                type="button"
                size="lg"
              >
                {t("cancelAndGoBack")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PublishCourseForm;
