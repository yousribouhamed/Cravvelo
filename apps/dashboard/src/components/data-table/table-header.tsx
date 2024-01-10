import { Button } from "@ui/components/ui/button";
import type { FC } from "react";

interface TableHeaderAbdullahProps {}

const TableHeader: FC = ({}) => {
  return (
    <div className="w-full h-[70px] flex items-center justify-between">
      <div className="min-w-[200px] w-fit h-full flex  items-center justify-start">
        <Button variant="secondary">تصفية</Button>
      </div>
      <div className="min-w-[200px] w-fit h-full flex items-center justify-end gap-x-4">
        <Button variant="secondary">تصدير البيانات</Button>
        <Button>أنشئ دورة جديدة</Button>
      </div>
    </div>
  );
};

export default TableHeader;
