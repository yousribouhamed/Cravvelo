"use client";

import { trpc } from "@/src/app/_trpc/client";
import { useMounted } from "@/src/hooks/use-mounted";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@ui/components/ui/alert-dialog";
import type { FC } from "react";
import * as React from "react";
import { maketoast } from "../toasts";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { Button } from "@ui/components/ui/button";
import { useOpenCertificateDeleteAction } from "@/src/lib/zustand/delete-actions";
import { useTranslations } from "next-intl";

interface DeleteCertificateModelProps {
  refetch: () => Promise<any>;
}

const DeleteCertificateModel: FC<DeleteCertificateModelProps> = ({ refetch }) => {
  const mounted = useMounted();
  const t = useTranslations("certificates");

  const { id, open, setId, setIsOpen } = useOpenCertificateDeleteAction();

  const mutation = trpc.deleteCertificate.useMutation({
    onSuccess: async () => {
      await refetch();

      setIsOpen(false);
      maketoast.successWithText({ text: t("deleteModal.success") });
    },
    onError: () => {
      maketoast.error();
      setIsOpen(false);
    },
  });

  if (!mounted) return null;

  return (
    <AlertDialog open={open} onOpenChange={(val) => setIsOpen(val)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="w-full flex justify-start">
            {t("deleteModal.title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="w-full my-4 flex justify-start">
            <p className="text-start">
              {t("deleteModal.description")}
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className=" w-full flex justify-start gap-x-4">
          <AlertDialogCancel>{t("deleteModal.cancel")}</AlertDialogCancel>
          <Button
            className=" flex items-center gap-x-2"
            disabled={mutation.isLoading}
            onClick={() => {
              if (id === null) {
                setIsOpen(false);
              }
              mutation.mutate({
                id: id,
              });
            }}
          >
            {mutation.isLoading ? <LoadingSpinner /> : null}
            {t("deleteModal.confirm")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCertificateModel;
