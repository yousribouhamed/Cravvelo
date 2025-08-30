"use client";

import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@ui/components/ui/dialog";
import { installApp } from "../actions/apps.actions";
import { useState } from "react";
import { maketoast } from "@/src/components/toasts";

export default function InstallAppModal({ appId }: { appId: string }) {
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      return await installApp({ appId });
    },
    onSuccess: () => {
      setOpen(false);
      maketoast.successWithText({ text: "تم تثبيت التطبيق بنجاح" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">إضافة</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader dir="ltr">
          <DialogTitle className="text-right">تثبيت التطبيق</DialogTitle>
          <DialogDescription dir="ltr" className="text-right">
            هل أنت متأكد أنك تريد تثبيت هذا التطبيق؟ سيتم إنشاء فاتورة وربط
            عملية الدفع الخاصة به بحسابك.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={mutation.isLoading}
          >
            إلغاء
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isLoading}
            loading={mutation.isLoading}
          >
            تثبيت
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
