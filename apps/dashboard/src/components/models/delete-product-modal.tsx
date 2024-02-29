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
import { useOpenProductDeleteAction } from "@/src/lib/zustand/delete-actions";

interface DeleteProductModelProps {
  refetch: () => Promise<any>;
}

const DeleteProductModel: FC<DeleteProductModelProps> = ({ refetch }) => {
  const mounted = useMounted();

  const { id, open, setId, setIsOpen } = useOpenProductDeleteAction();

  const mutation = trpc.deleteProduct.useMutation({
    onSuccess: async () => {
      await refetch();
      setIsOpen(false);
      maketoast.successWithText({ text: "تم حذف منتجك" });
    },
    onError: () => {
      maketoast.error();
      console.error("something went wrong on the delete chapter model");
      setIsOpen(false);
    },
  });

  if (!mounted) return null;

  return (
    <AlertDialog open={open} onOpenChange={(val) => setIsOpen(val)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="w-full flex justify-start">
            هل أنت متأكد تمامًا من رغبتك في حذف هذا منتج؟
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
                productId: id,
              });
            }}
          >
            {mutation.isLoading ? <LoadingSpinner /> : null}
            حذف منتج
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProductModel;
