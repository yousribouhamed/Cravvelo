"use client";

import { trpc } from "@/src/app/_trpc/client";
import { openCourseDeleteOrSuspandAction } from "@/src/zustand/admin-state";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@ui/components/ui/alert-dialog";
import { Button } from "@ui/components/ui/button";
import { maketoast } from "../toasts";
import { LoadingSpinner } from "@ui/icons/loading-spinner";

export function ConfirmeDeleteOrSuspandAdmin() {
  const { open, id, setIsOpen, action } = openCourseDeleteOrSuspandAction();

  const suspandCourse = trpc.suspandCourse.useMutation({
    onSuccess: () => {
      maketoast.success();
      window.location.reload();
    },
    onError: () => {
      maketoast.error();
    },
  });
  const deleteCourse = trpc.deleteCourse.useMutation({
    onSuccess: () => {
      maketoast.success();
      window.location.reload();
    },
    onError: () => {
      maketoast.error();
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={(val) => setIsOpen(val)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد تماما؟</AlertDialogTitle>
          <AlertDialogDescription>
            لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف ملفك نهائيًا
            الحساب وإزالة بياناتك من خوادمنا.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="space-x-4">
          <AlertDialogCancel>تراجع</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className=" flex items-center gap-x-2"
              disabled={suspandCourse.isLoading || deleteCourse.isLoading}
              onClick={() => {
                if (id === null) {
                  setIsOpen(false);
                }
                if (action === "DELETE") {
                  deleteCourse.mutate({
                    id,
                  });

                  return;
                }
                if (action === "SUSPAND") {
                  deleteCourse.mutate({
                    id,
                  });

                  return;
                }
              }}
            >
              {suspandCourse.isLoading || deleteCourse.isLoading ? (
                <LoadingSpinner />
              ) : null}
              تاكيد{" "}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
