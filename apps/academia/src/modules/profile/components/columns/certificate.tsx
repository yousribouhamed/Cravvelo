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

const statusMap: Record<
  CertificateStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  PENDING: {
    label: "قيد المراجعة",
    variant: "secondary",
    icon: Clock,
  },
  APPROVED: {
    label: "مقبولة",
    variant: "default",
    icon: CheckCircle,
  },
  REJECTED: {
    label: "مرفوضة",
    variant: "destructive",
    icon: XCircle,
  },
};

export const CertificateColumns: ColumnDef<Certificate>[] = [
  {
    accessorKey: "studentName",
    header: ({ column }) => (
      <div className="flex items-center gap-2 font-semibold">
        <User className="h-4 w-4" />
        اسم الطالب
      </div>
    ),
    cell: ({ row }) => {
      const name = row.getValue("studentName") as string;
      return (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
            {name.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "courseName",
    header: ({ column }) => (
      <div className="flex items-center gap-2 font-semibold">
        <BookOpen className="h-4 w-4" />
        اسم الدورة
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
    header: ({ column }) => (
      <div className="flex items-center gap-2 font-semibold">
        <FileText className="h-4 w-4" />
        رابط الشهادة
      </div>
    ),
    cell: ({ row }) => {
      const url = row.getValue("fileUrl") as string;

      if (!url) {
        return <span className="text-gray-400 text-sm">غير متوفر</span>;
      }

      return (
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 hover:border-blue-300 transition-all duration-200"
          onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          عرض الشهادة
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <div className="flex items-center gap-2 font-semibold">الحالة</div>
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
    header: ({ column }) => (
      <div className="flex items-center gap-2 font-semibold">
        <Calendar className="h-4 w-4" />
        تاريخ الإصدار
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
    header: ({ column }) => (
      <div className="flex items-center gap-2 font-semibold">
        <CalendarX className="h-4 w-4" />
        تاريخ الانتهاء
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
              منتهية الصلاحية
            </Badge>
          )}
          {!isExpired && isExpiringSoon && (
            <Badge
              variant="outline"
              className="text-xs w-fit mt-1 text-orange-600 border-orange-200"
            >
              تنتهي قريباً
            </Badge>
          )}
        </div>
      );
    },
  },
];
