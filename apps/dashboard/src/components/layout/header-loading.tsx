"use client";

import type { FC } from "react";
import { SearchInput } from "../search";
import UserNav from "../auth/user-nav";
import { Button, buttonVariants } from "@ui/components/ui/button";
import { useRouter } from "next/navigation";
import MobildSideBard from "./mobile-sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/ui/tooltip";
import { ArrowRight, ChevronDown } from "lucide-react";
import { UserData } from "@/src/types";
import { Notification } from "database";
import { Icons } from "../my-icons";

import { Skeleton } from "@ui/components/ui/skeleton";

interface Props {
  title: string;

  goBack?: boolean;
}

const HeaderLoading: FC<Props> = ({
  title,

  goBack,
}) => {
  const router = useRouter();
  return (
    <>
      <TooltipProvider>
        <div className="w-full h-[96px] flex justify-between items-center border-b  ">
          <div className="lg:w-[25%] w-[50%] h-full flex items-center justify-start gap-x-2">
            <div className="lg:hidden">
              <MobildSideBard />
            </div>
            {goBack && (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => router.back()}
                    variant="secondary"
                    size="icon"
                    className="bg-white rounded-xl border"
                  >
                    <ArrowRight className="w-4 h-4 text-black" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>عد للصفحة السابقة</p>
                </TooltipContent>
              </Tooltip>
            )}
            <h1 className=" text-sm md:text-xl truncate font-bold text-start">
              {title}
            </h1>
          </div>
          <div className="w-[50%] h-[88px] flex items-center justify-center px-4">
            <SearchInput />
          </div>

          <div className=" lg:w-[25%] w-[50%]   h-full flex items-center justify-end gap-x-2">
            <Button
              size="icon"
              variant="secondary"
              className="bg-white border rounded-xl w-10 h-10  relative"
            >
              <Icons.bell className="w-4 h-4 text-black " />
            </Button>

            <div
              className={` ${buttonVariants({
                variant: "ghost",
              })}  cursor-pointer  w-20 md:w-48   flex items-center  rounded-xl border justify-start gap-x-6 md:gap-x-4 bg-white hover:bg-white !p-2 `}
            >
              <div className="w-[20%] h-full flex items-center justify-start ">
                <Skeleton className="w-8 h-8 rounded-[50%]" />
              </div>
              <div className=" md:w-[80%] w-4 h-full  justify-end items-center flex gap-x-2">
                <Skeleton className="w-[110px] h-4 rounded-2xl" />
                <ChevronDown className="w-4 h-4 text-black hover:text-accent-foreground " />
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
};

export default HeaderLoading;
