import { Skeleton } from "@ui/components/ui/skeleton";

const Loading = async () => {
  return (
    <>
      <div className="w-full min-h-[700px] h-fit grid grid-cols-3 gap-x-4 ">
        <div className="w-full h-full col-span-1 flex flex-col items-end gap-y-4 py-8 ">
          <Skeleton className="w-full h-[100px] p-4 flex flex-col items-start justify-start gap-y-4  " />
          <Skeleton className="w-full h-[100px] p-4 flex flex-col items-start justify-start gap-y-4 " />
          <Skeleton className="w-full h-[100px] p-4 flex flex-col items-start justify-start gap-y-4 " />
        </div>
        <div className="w-full h-full col-span-2 py-8">
          <Skeleton className="w-full h-[500px] rounded-xl " />
          <div className="w-full h-[100px] flex items-center justify-start gap-x-4">
            <Skeleton className="w-[100px] h-[40px] rounded-xl" />
            <Skeleton className="w-[100px] h-[40px] rounded-xl" />
          </div>
          <div className="w-full h-fit flex flex-col gap-y-4">
            <Skeleton className="w-full h-[200px] p-4 flex flex-col items-start justify-start gap-y-4 " />
            <Skeleton className="w-full h-[200px] p-4 flex flex-col items-start justify-start gap-y-4 " />
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;
