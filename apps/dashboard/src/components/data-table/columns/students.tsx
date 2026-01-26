"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@ui/components/ui/checkbox";
import { Student } from "database";
import { DataTableColumnHeader } from "../table-helpers/data-table-head";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { maketoast } from "../../toasts";
import { Button } from "@ui/components/ui/button";
import { MoreHorizontal, Info, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Badge } from "@ui/components/ui/badge";
import { useTheme } from "next-themes";

// Date formatter
const formatDate = (date: Date, locale: string) => {
  const localeMap: Record<string, string> = {
    ar: "ar-DZ",
    en: "en-US",
  };
  const dateLocale = localeMap[locale] || "en-US";
  return new Intl.DateTimeFormat(dateLocale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

// Status badge component
const StatusCell = ({ isActive }: { isActive: boolean }) => {
  const t = useTranslations("students");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Badge
      variant="outline"
      className={
        isActive
          ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800"
          : "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
      }
    >
      {isActive ? t("filters.active") : t("filters.inactive")}
    </Badge>
  );
};

// Email verified badge component
const EmailVerifiedCell = ({ emailVerified }: { emailVerified: boolean }) => {
  const t = useTranslations("students");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Badge
      variant="outline"
      className={
        emailVerified
          ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-800"
          : "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
      }
    >
      {emailVerified ? (
        <div className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          {t("filters.verified")}
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          {t("filters.notVerified")}
        </div>
      )}
    </Badge>
  );
};

export const useStudentsColumns = (): ColumnDef<Student & { _count?: { Sales: number; Certificates: number } }>[] => {
  const t = useTranslations("students");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       //@ts-ignore
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="!mr-4"
  //     />
  //   ),

  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="!mr-4"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
    {
      accessorKey: "photo_url",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.student")} />
      ),
    cell: ({ row }) => {
      return (
        <div className="w-[40px] h-[40px] flex items-center justify-between ">
          <Avatar>
            <AvatarImage src={row.original.photo_url ?? "/avatar.png"} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },
    {
      accessorKey: "full_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.fullName")} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-y-2 justify-center items-start ">
            <p className="font-bold text-[15px] text-foreground">{row.original?.full_name}</p>
          </div>
        );
      },
    },

    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.email")} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-y-2 justify-center items-start ">
            <p className="font-bold text-[15px] text-foreground">{row.original?.email}</p>
          </div>
        );
      },
    },

    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.phone")} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-y-2 justify-center items-start ">
            <p className="font-bold text-xs text-foreground">
              {row.original?.phone ?? t("columns.notAvailable")}
            </p>
          </div>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.createdAt")} />
      ),
      cell: ({ row }) => {
        const createdAt = row.original.createdAt;
        if (!createdAt) {
          return <span className="text-muted-foreground text-sm">-</span>;
        }
        return (
          <div className="text-sm text-muted-foreground">
            {formatDate(createdAt, locale)}
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.status")} />
      ),
      cell: ({ row }) => {
        return <StatusCell isActive={row.original.isActive ?? true} />;
      },
      filterFn: (row, id, value) => {
        const rowValue = String(row.getValue(id) as boolean);
        const filterValues = Array.isArray(value) ? value : [value];
        if (filterValues.length === 0) return true;
        return filterValues.some((val) => {
          const boolVal = String(val === "true" || val === true);
          return rowValue === boolVal;
        });
      },
    },
    {
      id: "purchases",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.purchases")} />
      ),
      cell: ({ row }) => {
        const count = (row.original as any)._count?.Sales ?? 0;
        return (
          <div className="text-sm text-foreground font-medium">
            {count}
          </div>
        );
      },
    },
    {
      id: "certificates",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.certificates")} />
      ),
      cell: ({ row }) => {
        const count = (row.original as any)._count?.Certificates ?? 0;
        return (
          <div className="text-sm text-foreground font-medium">
            {count}
          </div>
        );
      },
    },
    {
      accessorKey: "emailVerified",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.emailVerified")} />
      ),
      cell: ({ row }) => {
        return <EmailVerifiedCell emailVerified={row.original.emailVerified ?? false} />;
      },
      filterFn: (row, id, value) => {
        const rowValue = String(row.getValue(id) as boolean);
        const filterValues = Array.isArray(value) ? value : [value];
        if (filterValues.length === 0) return true;
        return filterValues.some((val) => {
          const boolVal = String(val === "true" || val === true);
          return rowValue === boolVal;
        });
      },
    },
    {
      accessorKey: "lastVisitedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.lastVisited")} />
      ),
      cell: ({ row }) => {
        const lastVisited = row.original.lastVisitedAt;
        if (!lastVisited) {
          return <span className="text-muted-foreground text-sm">-</span>;
        }
        return (
          <div className="text-sm text-muted-foreground">
            {formatDate(lastVisited, locale)}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const student = row.original;

        return (
          <div className="w-full h-10 flex items-center justify-end gap-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-10 p-0 rounded-xl border"
                >
                  <span className="sr-only">{t("actions.openMenu")}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(student.email);
                    maketoast.info();
                  }}
                  className="w-full h-full flex justify-between items-center p-2"
                >
                  <svg
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5 12V14.25C10.5 14.664 10.164 15 9.75 15H3.25C3.05109 15 2.86032 14.921 2.71967 14.7803C2.57902 14.6397 2.5 14.4489 2.5 14.25V5.75C2.5 5.336 2.836 5 3.25 5H4.5C4.83505 4.99977 5.16954 5.02742 5.5 5.08267M10.5 12H12.75C13.164 12 13.5 11.664 13.5 11.25V8C13.5 5.02667 11.338 2.55933 8.5 2.08267C8.16954 2.02742 7.83505 1.99977 7.5 2H6.25C5.836 2 5.5 2.336 5.5 2.75V5.08267M10.5 12H6.25C6.05109 12 5.86032 11.921 5.71967 11.7803C5.57902 11.6397 5.5 11.4489 5.5 11.25V5.08267M13.5 9.5V8.25C13.5 7.65326 13.2629 7.08097 12.841 6.65901C12.419 6.23705 11.8467 6 11.25 6H10.25C10.0511 6 9.86032 5.92098 9.71967 5.78033C9.57902 5.63968 9.5 5.44891 9.5 5.25V4.25C9.5 3.95453 9.4418 3.66195 9.32873 3.38896C9.21566 3.11598 9.04992 2.86794 8.84099 2.65901C8.63206 2.45008 8.38402 2.28435 8.11104 2.17127C7.83806 2.0582 7.54547 2 7.25 2H6.5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-foreground"
                    />
                  </svg>
                  {t("actions.copyEmail")}
                </DropdownMenuItem>
                <Link href={`/students/${row.original.id}`}>
                  <DropdownMenuItem
                    className="w-full h-full flex justify-between items-center gap-x-2 p-2"
                  >
                    <Info className="w-4 h-4" />
                    {t("actions.moreInfo")}
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};
