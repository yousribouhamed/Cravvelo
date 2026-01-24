"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { uninstallApp } from "../actions/apps.actions";
import { useState } from "react";
import { maketoast } from "@/src/components/toasts";

export default function UninstallAppModal({ appId }: { appId: string }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return await uninstallApp({ appId });
    },
    onSuccess: () => {
      setOpen(false);
      // Invalidate installedApps query to update sidebar immediately
      queryClient.invalidateQueries({ queryKey: ["installedApps"] });
      maketoast.successWithText({ text: "تم إلغاء تثبيت التطبيق بنجاح" });
    },
    onError: (error: any) => {
      maketoast.errorWithText({
        text: error?.message || "فشل إلغاء تثبيت التطبيق",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          إلغاء التثبيت
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader dir="ltr">
          <DialogTitle className="text-right">إلغاء تثبيت التطبيق</DialogTitle>
          <DialogDescription dir="ltr" className="text-right">
            هل أنت متأكد أنك تريد إلغاء تثبيت هذا التطبيق؟ سيتم إلغاء الاشتراك
            وستفقد الوصول إلى جميع ميزات التطبيق.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={mutation.isPending}
          >
            إلغاء
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            loading={mutation.isPending}
            variant="destructive"
          >
            إلغاء التثبيت
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
