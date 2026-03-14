"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  User,
  BookOpen,
  Calendar,
  CalendarX,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
} from "lucide-react";
import { Certificate, CertificateStatus } from "../../types";
import { useTranslations } from "next-intl";

export function CertificateColumns(): ColumnDef<Certificate>[] {
  const t = useTranslations("profile.certificates");

  const statusMap: Record<
    CertificateStatus,
    {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
      icon: React.ComponentType<{ className?: string }>;
    }
  > = {
    PENDING: {
      label: t("status.PENDING"),
      variant: "secondary",
      icon: Clock,
    },
    ISSUED: {
      label: t("status.APPROVED"),
      variant: "default",
      icon: CheckCircle,
    },
    REVOKED: {
      label: t("status.REJECTED"),
      variant: "destructive",
      icon: XCircle,
    },
  };

  return [
    {
      accessorKey: "studentName",
      header: () => (
        <div className="flex items-center gap-2 font-semibold">
          <User className="h-4 w-4" />
          {t("columns.studentName")}
        </div>
      ),
      cell: ({ row }) => {
        const name = row.getValue("studentName") as string;
        return (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-medium">
              {name.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "courseName",
      header: () => (
        <div className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-4 w-4" />
          {t("columns.courseName")}
        </div>
      ),
      cell: ({ row }) => {
        const courseName = row.getValue("courseName") as string;
        return (
          <div className="max-w-[200px]">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {courseName}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "fileUrl",
      header: () => (
        <div className="flex items-center gap-2 font-semibold">
          <FileText className="h-4 w-4" />
          {t("columns.fileUrl")}
        </div>
      ),
      cell: ({ row }) => {
        const url = row.getValue("fileUrl") as string;

        if (!url) {
          return (
            <span className="text-gray-400 text-sm">{t("notAvailable")}</span>
          );
        }

        return (
          <Button
            size="sm"
            className="h-8 px-3 gap-1"
            onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
          >
            <ExternalLink className="h-3 w-3" />
            {t("actions.viewCertificate")}
          </Button>
        );
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="flex items-center gap-2 font-semibold">
          {t("columns.status")}
        </div>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as CertificateStatus;
        const { label, variant, icon: Icon } = statusMap[status];

        return (
          <Badge
            variant={variant}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium"
          >
            <Icon className="h-3 w-3" />
            {label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "issueDate",
      header: () => (
        <div className="flex items-center gap-2 font-semibold">
          <Calendar className="h-4 w-4" />
          {t("columns.issueDate")}
        </div>
      ),
      cell: ({ row }) => {
        const date = row.getValue("issueDate") as Date | null;

        if (!date) {
          return <span className="text-gray-400 text-sm">—</span>;
        }

        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {new Date(date).toLocaleDateString("ar-DZ", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(date).toLocaleDateString("en-US", {
                weekday: "short",
              })}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "expiryDate",
      header: () => (
        <div className="flex items-center gap-2 font-semibold">
          <CalendarX className="h-4 w-4" />
          {t("columns.expiryDate")}
        </div>
      ),
      cell: ({ row }) => {
        const date = row.getValue("expiryDate") as Date | null;

        if (!date) {
          return <span className="text-gray-400 text-sm">—</span>;
        }

        const isExpired = new Date(date) < new Date();
        const isExpiringSoon =
          new Date(date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        return (
          <div className="flex flex-col">
            <span
              className={`text-sm font-medium ${
                isExpired
                  ? "text-red-600"
                  : isExpiringSoon
                  ? "text-orange-600"
                  : "text-gray-900 dark:text-gray-100"
              }`}
            >
              {new Date(date).toLocaleDateString("ar-DZ", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            {isExpired && (
              <Badge variant="destructive" className="text-xs w-fit mt-1">
                {t("expired")}
              </Badge>
            )}
            {!isExpired && isExpiringSoon && (
              <Badge
                variant="outline"
                className="text-xs w-fit mt-1 text-orange-600 border-orange-200"
              >
                {t("expiringSoon")}
              </Badge>
            )}
          </div>
        );
      },
    },
  ];
}
