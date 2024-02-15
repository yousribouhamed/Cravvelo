import type { FC } from "react";
import { Skeleton } from "@ui/components/ui/skeleton";

const Page: FC = ({}) => {
  return (
    <div className="  w-full h-fit min-h-screen flex flex-col lg:flex-row  justify-between gap-x-4 items-start py-4">
      <div className=" w-full lg:w-[calc(100%-300px)] min-h-[500px] h-fit px-2 py-8 lg:p-8">
        <Skeleton className="w-full h-[400px] my-4 rounded-xl" />
        <div className="w-full h-[400px] flex flex-col rounded-xl">
          <div className="w-full h-[100px] flex items-center justify-start gap-x-4">
            <Skeleton className="w-[60px] h-[60px] rounded-[50%] flex items-center justify-center" />
            <Skeleton className="w-[200px] h-[20px]" />
          </div>
          <Skeleton className="w-full h-[300px] flex flex-col  gap-y-4 rounded-xl  p-4" />
        </div>
        <div className="w-full h-[400px] flex flex-col rounded-xl">
          <div className="w-full h-[100px] flex items-center justify-start gap-x-4">
            <Skeleton className="w-[60px] h-[60px] rounded-[50%] flex items-center justify-center" />
            <Skeleton className="w-[200px] h-[20px]" />
          </div>
          <Skeleton className="w-full h-[300px] flex flex-col  gap-y-4 rounded-xl  p-4" />
        </div>
      </div>
      <Skeleton className=" w-full lg:w-[350px] h-[500px]  rounded-xl border my-8 p-4 flex flex-col gap-y-4 sm:sticky lg:top-[100px]" />
    </div>
  );
};

export default Page;
