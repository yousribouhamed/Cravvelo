import type { FC } from "react";
import { Skeleton } from "@ui/components/ui/skeleton";

const Loading: FC = ({}) => {
  return (
    <div className="w-full flex flex-col h-screen ">
      <div className="bg-white border-b flex justify-between items-center h-[60px] px-4 ">
        <Skeleton className="h-[30px] border-b  w-[30px] " />
        <Skeleton className="h-[30px] border-b  w-[150px] " />
        <Skeleton className="h-[30px] border-b  w-[200px] " />
      </div>
      <div className="w-full flex h-full ">
        <div className="w-[25%] max-w-[350px] border-l flex flex-col gap-y-4  p-4  h-full ">
          <Skeleton className="h-[20px] border-b  w-full " />
          <Skeleton className="h-[80px] border-b  w-full " />

          <Skeleton className="h-[150px] border-b  w-full " />
        </div>

        <div className="w-[75%] flex-grow relative   h-full bg-white p-4">
          <Skeleton className="rounded-xl w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
