"use client";

import type { FC } from "react";
import { SearchInput } from "../search";
import { Button } from "@ui/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/ui/tooltip";
import { ArrowRight } from "lucide-react";
import SignOutButton from "../sign-out-button";

interface Props {
  title: string;

  goBack?: boolean;
}

const Header: FC<Props> = ({ title, goBack }) => {
  const router = useRouter();
  return (
    <>
      <TooltipProvider>
        <div className="w-full h-[96px] flex justify-between items-center border-b  ">
          <div className="w-[25%] h-full flex items-center justify-start gap-x-2">
            {/* <div className="lg:hidden">
              <MobildSideBard />

            </div> */}
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
            <h1 className="text-xl font-bold text-start">{title}</h1>
          </div>
          <div className="w-[50%] h-[88px] flex items-center justify-center px-4">
            <SearchInput />
          </div>

          <div className="w-[25%]  h-full flex items-center justify-end gap-x-2">
            <SignOutButton />
          </div>
        </div>
      </TooltipProvider>
    </>
  );
};

export default Header;
