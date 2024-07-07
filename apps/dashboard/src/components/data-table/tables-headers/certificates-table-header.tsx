import { Button, buttonVariants } from "@ui/components/ui/button";
import type { FC } from "react";
import Link from "next/link";
import { cn } from "@ui/lib/utils";

//@ts-ignore
import { download, generateCsv, mkConfig } from "export-to-csv";

interface TableHeaderProps {
  table: any;
  refetch: () => Promise<any>;
  data: any[];
}

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const CertificateTableHeader: FC<TableHeaderProps> = ({
  table,
  refetch,
  data,
}) => {
  const handleExportCSV = (data: any[]) => {
    const csv = generateCsv(csvConfig)(data);
    //@ts-ignore
    download(csvConfig)(csv);
  };

  return (
    <div className="w-full h-[70px] flex items-center justify-between">
      <div className="min-w-[200px] w-fit h-full flex  items-center justify-start gap-x-4">
        <Button
          disabled
          variant="secondary"
          className="bg-white rounded-xl border flex items-center gap-x-2"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.93189 2.57251C10.8467 2.57251 12.7232 2.73376 14.5497 3.04373C14.9201 3.10628 15.187 3.43016 15.187 3.80547V4.53106C15.187 4.73642 15.1466 4.93977 15.068 5.1295C14.9894 5.31923 14.8742 5.49162 14.729 5.63683L10.9537 9.41215C10.8085 9.55736 10.6933 9.72975 10.6147 9.91948C10.5361 10.1092 10.4957 10.3126 10.4957 10.5179V12.5522C10.4957 12.8427 10.4149 13.1275 10.2621 13.3746C10.1094 13.6217 9.89091 13.8214 9.63107 13.9513L7.3681 15.0828V10.5179C7.36811 10.3126 7.32766 10.1092 7.24907 9.91948C7.17049 9.72975 7.0553 9.55736 6.91009 9.41215L3.13477 5.63683C2.98956 5.49162 2.87438 5.31923 2.79579 5.1295C2.7172 4.93977 2.67676 4.73642 2.67676 4.53106V3.80547C2.67676 3.43016 2.94364 3.10628 3.31409 3.04373C5.17017 2.72948 7.04939 2.57185 8.93189 2.57251Z"
              stroke="black"
              stroke-width="1.04252"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          تصفية
        </Button>
      </div>
      <div className="min-w-[200px] w-fit h-full flex items-center justify-end gap-x-4">
        <Link
          href={"/students/certificates/create-certificate"}
          className={cn(buttonVariants(), "rounded-xl")}
        >
          تصميم شهادة جديدة
        </Link>
      </div>
    </div>
  );
};

export default CertificateTableHeader;
