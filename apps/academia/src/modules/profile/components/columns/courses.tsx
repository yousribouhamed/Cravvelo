"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  BookOpen,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

type CourseSale = {
  id: string;
  orderNumber: number;
  amount: number;
  status: string;
  createdAt: Date;
  Course: {
    id: string;
    title: string;
    thumbnailUrl: string | null;
  } | null;
};

const statusMap: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  CREATED: {
    label: "تم الإنشاء",
    variant: "secondary",
    icon: Clock,
  },
  COMPLETED: {
    label: "مكتمل",
    variant: "default",
    icon: CheckCircle,
  },
  CANCELLED: {
    label: "ملغي",
    variant: "destructive",
    icon: XCircle,
  },
};

export const CourseColumns: ColumnDef<CourseSale>[] = [
  {
    accessorKey: "Course.title",
    header: () => (
      <div className="flex items-center gap-2 font-semibold">
        <BookOpen className="h-4 w-4" />
        اسم الدورة
      </div>
    ),
    cell: ({ row }) => {
      const course = row.original.Course;
      const thumbnailUrl = course?.thumbnailUrl;

      if (!course) {
        return (
          <span className="text-gray-400 text-sm">
            الدورة غير موجودة
          </span>
        );
      }

      return (
        <div className="flex items-center gap-3">
          {thumbnailUrl && (
            <div className="relative h-12 w-12 rounded-lg overflow-hidden border">
              <Image
                src={thumbnailUrl}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {course.title}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => (
      <div className="flex items-center gap-2 font-semibold">
        <DollarSign className="h-4 w-4" />
        المبلغ
      </div>
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return (
        <span className="font-medium">
          {amount.toLocaleString()} دج
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="flex items-center gap-2 font-semibold">الحالة</div>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusConfig =
        statusMap[status] ||
        statusMap.CREATED || {
          label: status,
          variant: "outline" as const,
          icon: Clock,
        };
      const { label, variant, icon: Icon } = statusConfig;

      return (
        <Badge
          variant={variant}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium w-fit"
        >
          <Icon className="h-3 w-3" />
          {label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <div className="flex items-center gap-2 font-semibold">
        <Calendar className="h-4 w-4" />
        تاريخ الشراء
      </div>
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;

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
];
