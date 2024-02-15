import { Skeleton } from "@ui/components/ui/skeleton";

const Loading = async () => {
  return (
    <div className="  w-full h-fit min-h-screen flex flex-col gap-4 items-start py-4">
      <div className="w-full h-[100px] flex items-center justify-start">
        <Skeleton className="w-[200px] h-[50px] rounded-xl" />
      </div>
      <div className="w-full h-[100px] flex items-center justify-start gap-x-4">
        <Skeleton className="w-[50px] h-[50px] rounded-xl" />
        <Skeleton className="w-[200px] h-[50px] rounded-xl" />
      </div>
      <div className="w-full min-h-[300px] flex flex-wrap gap-x-4">
        <Skeleton className="w-[320px] h-[400px] rounded-xl" />
        <Skeleton className="w-[320px] h-[400px] rounded-xl" />
        <Skeleton className="w-[320px] h-[400px] rounded-xl" />
      </div>
    </div>
  );
};

export default Loading;
