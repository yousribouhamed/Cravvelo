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

interface DeleteCourseModelProps {
  refetch: () => Promise<any>;
}

const DeleteCourseModel: FC<DeleteCourseModelProps> = ({ refetch }) => {
  const mounted = useMounted();

  const { id, open, setId, setIsOpen } = useOpenCourseDeleteAction();

  const mutation = trpc.deleteCourse.useMutation({
    onSuccess: async () => {
      await refetch();

      setIsOpen(false);
      maketoast.successWithText({ text: "تم حذف الدورة بنجاح" });
    },
    onError: () => {
      maketoast.error();
      console.error("حدث خطأ ما في نموذج حذف الفصل");
      setIsOpen(false);
    },
  });

  if (!mounted) return null;

  return (
    <AlertDialog open={open} onOpenChange={(val) => setIsOpen(val)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="w-full flex justify-start">
            هل أنت متأكد تمامًا من رغبتك في حذف هذا دورة؟
          </AlertDialogTitle>
          <AlertDialogDescription className="w-full my-4 flex justify-start">
            <div dir="rtl">
              <p className="text-start">
                {" "}
                لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف ملفك نهائيًا
                الحساب وإزالة بياناتك من خوادمنا.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className=" w-full flex justify-start gap-x-4">
          <AlertDialogCancel>الإلغاء</AlertDialogCancel>
          <Button
            className=" flex items-center gap-x-2"
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
            حذف دورة
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCourseModel;
