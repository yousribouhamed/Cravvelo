"use client";

import { trpc } from "@/src/app/_trpc/client";
import { useMounted } from "@/src/hooks/use-mounted";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui/components/ui/alert-dialog";
import type { FC } from "react";
import * as React from "react";
import { maketoast } from "../toasts";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { Button } from "@ui/components/ui/button";
import { useOpenCourseDeleteAction } from "@/src/lib/zustand/delete-actions";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@ui/lib/utils";

interface DeleteCourseModelProps {
  refetch: () => Promise<any>;
}

const DeleteCourseModel: FC<DeleteCourseModelProps> = ({ refetch }) => {
  const t = useTranslations("modals");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const mounted = useMounted();

  const { id, open, setId, setIsOpen } = useOpenCourseDeleteAction();

  const mutation = trpc.deleteCourse.useMutation({
    onSuccess: async () => {
      await refetch();

      setIsOpen(false);
      maketoast.successWithText({ text: t("courseDeleted") });
    },
    onError: () => {
      maketoast.error();
      console.error(t("deleteError"));
      setIsOpen(false);
    },
  });

  if (!mounted) return null;

  return (
    <AlertDialog open={open} onOpenChange={(val) => setIsOpen(val)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={cn("w-full flex", isRTL ? "justify-start" : "justify-start")}>
            {t("deleteCourseConfirm")}
          </AlertDialogTitle>
          <AlertDialogDescription className={cn("w-full my-4 flex", isRTL ? "justify-start" : "justify-start")}>
            <div dir={isRTL ? "rtl" : "ltr"}>
              <p className={cn(isRTL ? "text-start" : "text-start")}>
                {t("deleteCourseDescription")}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={cn("w-full flex gap-x-4", isRTL ? "justify-start" : "justify-end")}>
          <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
          <Button
            className="flex items-center gap-x-2"
            disabled={mutation.isLoading}
            onClick={() => {
              if (id === null) {
                setIsOpen(false);
              }
              mutation.mutate({
                courseId: id,
              });
            }}
          >
            {mutation.isLoading ? <LoadingSpinner /> : null}
            {t("deleteCourse")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCourseModel;
