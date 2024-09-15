import { buttonVariants } from "@ui/components/ui/button";
import type { FC } from "react";
import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { PackagePlus } from "lucide-react";

interface TableHeaderProps {
  table: any;
  refetch: () => Promise<any>;
  data: any[];
}

const CertificateTableHeader: FC<TableHeaderProps> = ({
  table,
  refetch,
  data,
}) => {
  return (
    <div className="w-full h-[70px] flex items-center justify-end">
      <Link
        href={"/students/certificates/create-certificate"}
        className={cn(buttonVariants(), "rounded-xl")}
      >
        <PackagePlus className="w-5 h-5 mx-2" />
        تصميم شهادة جديدة
      </Link>
    </div>
  );
};

export default CertificateTableHeader;
