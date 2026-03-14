"use client";

import { buttonVariants } from "@ui/components/ui/button";
import type { FC } from "react";
import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { PackagePlus } from "lucide-react";
import { useTranslations } from "next-intl";

interface TableHeaderProps {
  table: any;
  refetch?: () => Promise<any>;
  data: any[];
}

const CertificateTableHeader: FC<TableHeaderProps> = ({
  table,
  refetch,
  data,
}) => {
  const t = useTranslations("certificates");

  return (
    <div className="w-full min-h-[70px] flex flex-wrap items-center justify-end gap-2 py-2">
      <Link
        href={"/students/certificates/create-certificate"}
        className={cn(buttonVariants(), "rounded-xl")}
      >
        <PackagePlus className="w-5 h-5 mx-2" />
        {t("actions.createNew")}
      </Link>
    </div>
  );
};

export default CertificateTableHeader;
