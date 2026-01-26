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
import { installApp } from "../actions/apps.actions";
import { useState } from "react";
import { maketoast } from "@/src/components/toasts";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@ui/lib/utils";

export default function InstallAppModal({ appId }: { appId: string }) {
  const t = useTranslations("apps");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return await installApp({ appId });
    },
    onSuccess: () => {
      setOpen(false);
      // Invalidate installedApps query to update sidebar immediately
      queryClient.invalidateQueries({ queryKey: ["installedApps"] });
      maketoast.successWithText({ text: t("appInstalled") });
    },
    onError: (error: any) => {
      maketoast.errorWithText({
        text: error?.message || t("installFailed"),
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">{t("install")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader dir={isRTL ? "rtl" : "ltr"}>
          <DialogTitle className={cn(isRTL ? "text-right" : "text-left")}>
            {t("installApp")}
          </DialogTitle>
          <DialogDescription
            dir={isRTL ? "rtl" : "ltr"}
            className={cn(isRTL ? "text-right" : "text-left")}
          >
            {t("installAppDescription")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={mutation.isPending}
          >
            {tCommon("cancel")}
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            loading={mutation.isPending}
          >
            {t("installApp")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
