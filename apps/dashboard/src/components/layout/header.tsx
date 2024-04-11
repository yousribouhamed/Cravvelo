"use client";

import type { FC } from "react";
import { SearchInput } from "../search";
import UserNav from "../auth/user-nav";
import { Button } from "@ui/components/ui/button";
import { useRouter } from "next/navigation";
import MobildSideBard from "./mobile-sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/ui/tooltip";
import Notifications from "../real-time/notifications";
import { ArrowRight } from "lucide-react";
import { UserData } from "@/src/types";
import { daysLeftInTrial } from "@/src/lib/utils";

interface Props {
  title: string;
  user: UserData;
  goBack?: boolean;
  isLoadingPage?: boolean;
}

const Header: FC<Props> = ({ title, user, goBack, isLoadingPage }) => {
  const router = useRouter();
  return (
    <>
      <TooltipProvider>
        <div className="w-full h-[96px] flex justify-between items-center border-b  ">
          <div className="w-[25%] h-full flex items-center justify-start gap-x-2">
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
            <h1 className="text-xl font-bold text-start">{title}</h1>
          </div>
          <div className="w-[50%] h-[88px] flex items-center justify-center px-4">
            <SearchInput />
          </div>

          <div className="w-[25%]  h-full flex items-center justify-end gap-x-2">
            <Notifications />

            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <UserNav user={user} />
              </TooltipTrigger>
              <TooltipContent>
                <p> هذه هي قائمة التنقل الخاصة بالمستخدم</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>

      {user?.isFreeTrial && !user?.isSubscribed && !isLoadingPage ? (
        <div className="w-full h-[70px] flex items-center justify-center bg-gradient-to-r from-primary to-yellow-500">
          <h1 className="text-white font-bold text-md">
            لديك {daysLeftInTrial(user.createdAt)} يومًا متبقيًا في النسخة
            التجريبية المجانية
          </h1>
        </div>
      ) : !user?.isSubscribed && !isLoadingPage ? (
        <div className="w-full h-[70px] flex items-center justify-center bg-gradient-to-r from-primary to-yellow-500">
          <h1 className="text-white font-bold text-md">
            انتهت الفترة التجريبية، يجب عليك الاشتراك في أحد الباقات
          </h1>
        </div>
      ) : null}
    </>
  );
};

export default Header;
