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
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@ui/lib/utils";

export default function UninstallAppModal({ appId }: { appId: string }) {
  const t = useTranslations("apps");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const isRTL = locale === "ar";
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
      maketoast.successWithText({ text: t("appUninstalled") });
    },
    onError: (error: any) => {
      maketoast.errorWithText({
        text: error?.message || t("uninstallFailed"),
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          {t("uninstall")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader dir={isRTL ? "rtl" : "ltr"}>
          <DialogTitle className={cn(isRTL ? "text-right" : "text-left")}>
            {t("uninstallApp")}
          </DialogTitle>
          <DialogDescription
            dir={isRTL ? "rtl" : "ltr"}
            className={cn(isRTL ? "text-right" : "text-left")}
          >
            {t("uninstallAppDescription")}
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
            variant="destructive"
          >
            {t("uninstallApp")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
