"use client";

import { useMounted } from "@/src/hooks/use-mounted";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@ui/components/ui/alert-dialog";
import type { FC } from "react";
import * as React from "react";
import { Button } from "@ui/components/ui/button";
import { useRouter } from "next/navigation";

interface DeleteChapterProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlanExceededPopup: FC<DeleteChapterProps> = ({ isOpen, setIsOpen }) => {
  const mounted = useMounted();

  const router = useRouter();

  if (!mounted) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="w-full flex justify-start">
            تم تجاوز خطة الدفع، يرجى الترقية إلى الخطة التالية لمواصلة هذا
            الإجراء
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className=" w-full flex justify-start gap-x-4">
          <AlertDialogCancel>الإلغاء</AlertDialogCancel>
          <Button
            className=" flex items-center gap-x-2"
            onClick={() => {
              router.push("/pricing");
              setIsOpen(false);
            }}
          >
            ترقية الباقة
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PlanExceededPopup;
