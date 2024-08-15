import type { FC } from "react";
import LoadingCard from "./_components/loading";
import MaxWidthWrapper from "./_components/max-width-wrapper";
import AcademiaFooter from "./_components/layout/academy-footer";
import MobilNavgiationProduction from "./_components/layout/academy-header/mobil-navbar";
import LinksNavbar from "./_components/layout/academy-header/links-navbar";
import { Skeleton } from "@ui/components/ui/skeleton";
import { ShoppingBag } from "lucide-react";

const Page: FC = ({}) => {
  return (
    <>
      <div className="w-full h-[70px]   border-b z-[8] fixed top-0 bg-white shadow overflow-y-hidden">
        <MaxWidthWrapper className="w-full h-[70px] flex items-center justify-between">
          <div className="w-fit h-full flex items-center justify-start md:hidden">
            <MobilNavgiationProduction />
          </div>
          <div className="min-w-[200px] w-fit  items-center justify-start gap-x-4 hidden md:flex h-full">
            <LinksNavbar />
          </div>
          <div className="flex w-fir min-w-[100px] justify-end items-center">
            <button className="text-black w-[40px] h-450px] rounded-xl p-2 relative">
              <ShoppingBag className="w-5 h-5 " />
            </button>
            <Skeleton className="h-10 w-[120px] rounded-xl" />
          </div>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper className="h-fit mt-[140px] min-h-[calc(100vh-70px)] overflow-hidden ">
        <LoadingCard />
      </MaxWidthWrapper>
      <AcademiaFooter />
    </>
  );
};

export default Page;
