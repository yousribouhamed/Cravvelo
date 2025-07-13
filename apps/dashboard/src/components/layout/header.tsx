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
import { Notification } from "database";

interface Props {
  title: string;
  user: UserData;
  goBack?: boolean;
  isLoadingPage?: boolean;
  notifications: Notification[];
}

const Header: FC<Props> = ({
  title,
  user,
  goBack,
  isLoadingPage,
  notifications,
}) => {
  const router = useRouter();
  
  return (
    <div className="w-full ">
      <TooltipProvider>
        <div className="w-full h-20 flex justify-between items-center px-4 md:px-6">
          {/* Left Section - Title & Back Button */}
          <div className="flex items-center gap-3 min-w-0 flex-1 lg:flex-initial lg:w-1/4">
            <div className="lg:hidden">
              <MobildSideBard />
            </div>
            
            {goBack && (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => router.back()}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-lg border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 text-gray-600" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>عد للصفحة السابقة</p>
                </TooltipContent>
              </Tooltip>
            )}
            
            <h1 className="text-lg md:text-2xl font-bold text-gray-900 truncate">
              {title}
            </h1>
          </div>

          {/* Center Section - Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchInput />
          </div>

          {/* Right Section - Notifications & User Nav */}
          <div className="flex items-center gap-3 lg:w-1/4 justify-end">
            <Notifications
              accountId={user.accountId}
              notifications={notifications}
            />
            
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <UserNav user={user} />
              </TooltipTrigger>
              <TooltipContent>
                <p>هذه هي قائمة التنقل الخاصة بالمستخدم</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-4">
          <SearchInput />
        </div>
      </TooltipProvider>

      {/* Trial Status Banner */}
      {user?.isFreeTrial && !user?.isSubscribed && !isLoadingPage && (
        <div className="w-full bg-white border border-dashed border-blue-500 rounded-xl px-4 py-3">
          <div className="flex items-center justify-center">
            <h1 className="text-gray-800 font-medium text-sm md:text-base text-center">
              لديك {daysLeftInTrial(user.createdAt)} يومًا متبقيًا في النسخة التجريبية المجانية
            </h1>
          </div>
        </div>
      )}

      {/* Expired Trial Banner */}
      {!user?.isSubscribed && !user?.isFreeTrial && !isLoadingPage && (
        <div className="w-full bg-white border border-dashed border-blue-500 rounded-xl px-4 py-3">
          <div className="flex items-center justify-center">
            <h1 className="text-gray-800 font-medium text-sm md:text-base text-center">
              انتهت الفترة التجريبية، يجب عليك الاشتراك في أحد الباقات
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;