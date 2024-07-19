import type { FC } from "react";

interface SimpleTableHeaderProps {
  table: any;
  data: any[];
}

const SimpleTableHeader: FC<SimpleTableHeaderProps> = ({ table, data }) => {
  return (
    <div className="w-full h-[70px] flex items-center justify-between">
      <div className="min-w-[200px] w-fit h-full flex  items-center justify-start gap-x-4"></div>
      <div className="min-w-[200px] w-fit h-full flex items-center justify-end gap-x-4"></div>
    </div>
  );
};

export default SimpleTableHeader;
