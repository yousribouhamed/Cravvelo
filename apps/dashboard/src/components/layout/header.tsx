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
    <div className="w-full">
      <TooltipProvider>
        <div className="w-full h-16 md:h-20 flex justify-between items-center  border-b border-gray-100">
          {/* Left Section - Mobile Sidebar & Back Button & Title */}
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            {/* Mobile Sidebar - Always first on mobile */}
            <div className="lg:hidden flex-shrink-0">
              <MobildSideBard />
            </div>

            {/* Back Button */}
            {goBack && (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => router.back()}
                    variant="outline"
                    size="icon"
                    className=" flex-shrink-0"
                  >
                    <ArrowRight className="w-4 h-4 " />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>عد للصفحة السابقة</p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Title */}
            <h1 className="text-base md:text-lg lg:text-2xl font-bold text-gray-900 truncate">
              {title}
            </h1>
          </div>

          {/* Center Section - Search (Desktop only) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4 xl:mx-8">
            <SearchInput />
          </div>

          {/* Right Section - Notifications & User Nav */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <div className="flex-shrink-0">
              <Notifications
                accountId={user.accountId}
                notifications={notifications}
              />
            </div>

            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="flex-shrink-0">
                  <UserNav user={user} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>هذه هي قائمة التنقل الخاصة بالمستخدم</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Mobile & Tablet Search Bar */}
        <div className="lg:hidden px-4 py-3 border-b border-gray-100">
          <SearchInput />
        </div>
      </TooltipProvider>

      {/* Trial Status Banner */}
      {user?.isFreeTrial && !user?.isSubscribed && !isLoadingPage && (
        <div className=" mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl px-4 py-3 shadow-sm">
          <div className="flex items-center justify-center">
            <h1 className="text-blue-800 font-medium text-sm md:text-base text-center leading-relaxed">
              لديك {daysLeftInTrial(user.createdAt)} يومًا متبقيًا في النسخة
              التجريبية المجانية
            </h1>
          </div>
        </div>
      )}

      {/* Expired Trial Banner */}
      {!user?.isSubscribed && !user?.isFreeTrial && !isLoadingPage && (
        <div className="mt-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl px-4 py-3 shadow-sm">
          <div className="flex items-center justify-center">
            <h1 className="text-red-800 font-medium text-sm md:text-base text-center leading-relaxed">
              انتهت الفترة التجريبية، يجب عليك الاشتراك في أحد الباقات
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
