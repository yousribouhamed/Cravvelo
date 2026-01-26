"use client";

import { trpc } from "@/src/app/_trpc/client";
import { useMounted } from "@/src/hooks/use-mounted";
import { useTranslations } from "next-intl";
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

interface DeleteChapterProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => Promise<any>;
  chapterId: string | null;
}

const DeleteChapter: FC<DeleteChapterProps> = ({
  isOpen,
  setIsOpen,
  chapterId,
  refetch,
}) => {
  const t = useTranslations("courses.deleteChapter");
  const mounted = useMounted();

  const mutation = trpc.deleteChapter.useMutation({
    onSuccess: async () => {
      await refetch();
      setIsOpen(false);
    },
    onError: () => {
      maketoast.error();
      console.error("something went wrong on the delete chapter model");
      setIsOpen(false);
    },
  });

  if (!mounted) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="w-full flex justify-start">
            {t("confirmTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription className="w-full my-4 flex justify-start">
            <div dir="rtl">
              <p className="text-start">
                {t("confirmDescription")}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className=" w-full flex justify-start gap-x-4">
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <Button
            className=" flex items-center gap-x-2"
            disabled={mutation.isLoading}
            onClick={() => {
              if (chapterId === null) {
                setIsOpen(false);
              }
              mutation.mutate({
                chapterId,
              });
            }}
          >
            {mutation.isLoading ? <LoadingSpinner /> : null}
            {t("delete")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteChapter;
