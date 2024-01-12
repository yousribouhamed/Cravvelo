import { Button } from "@ui/components/ui/button";
import type { FC } from "react";
import AddCourse from "../models/add-course";

interface TableHeaderAbdullahProps {}

const TableHeader: FC = ({}) => {
  return (
    <div className="w-full h-[70px] flex items-center justify-between">
      <div className="min-w-[200px] w-fit h-full flex  items-center justify-start">
        <Button variant="secondary">تصفية</Button>
      </div>
      <div className="min-w-[200px] w-fit h-full flex items-center justify-end gap-x-4">
        <Button variant="secondary">تصدير البيانات</Button>
        <AddCourse />
      </div>
    </div>
  );
};

export default TableHeader;
