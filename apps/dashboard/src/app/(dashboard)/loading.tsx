import MaxWidthWrapper from "@/src/components/max-width-wrapper";
import { Skeleton } from "@ui/components/ui/skeleton";
import HeaderLoading from "@/src/components/layout/header-loading";

const page = ({}) => {
  return (
    <MaxWidthWrapper>
      <main className="w-full flex flex-col overflow-y-hidden h-fit  justify-start">
        <HeaderLoading title="الرئيسية" />
        <div className="w-full h-[30px] flex justify-start items-center mt-10 ">
          <Skeleton className="w-[260px] h-[45px] rounded-xl" />
        </div>
        <div className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className=" min-h-[150px]" />
            <Skeleton className=" min-h-[150px]" />
            <Skeleton className=" min-h-[150px]" />
            <Skeleton className=" min-h-[150px]" />
          </div>
          <div className="grid gap-4 md:grid-cols-3  my-8 h-[450px] w-full ">
            <Skeleton className=" w-full h-full col-span-2" />
            <Skeleton className=" w-full h-full col-span-1" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 my-8 h-[300px] w-full ">
            <Skeleton className=" w-full h-full" />

            <Skeleton className=" w-full h-full" />
          </div>
        </div>
      </main>
    </MaxWidthWrapper>
  );
};

export default page;
