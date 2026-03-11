"use client";

import React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@ui/components/ui/dialog";
import { Button } from "@ui/components/ui/button";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

interface UpgradePlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function UpgradePlanModal({
  open,
  onOpenChange,
  title,
  description,
}: UpgradePlanModalProps) {
  const t = useTranslations("subscription.usage");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {title ?? t("storageLimitModalTitle")}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            {description ?? t("storageLimitModalDescription")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Close
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/settings/subscription#plans" onClick={() => onOpenChange(false)}>
              {t("upgradePlan")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
