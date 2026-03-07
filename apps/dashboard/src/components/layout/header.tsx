"use client";

import type { FC } from "react";
import { SearchInput } from "../search";
import UserNav from "../auth/user-nav";
import { Button } from "@ui/components/ui/button";
import { useRouter } from "next/navigation";
import MobildSideBard from "./mobile-sidebar";
import Notifications from "../real-time/notifications";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { UserData } from "@/src/types";
import { Notification } from "database";
import { useLocale } from "next-intl";

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
  const locale = useLocale();
  const isRTL = locale === "ar";
  const BackDirectionIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="w-full">
      <div className="w-full h-16 md:h-20 flex justify-between items-center ">
        {/* Left Section - Mobile Sidebar & Back Button & Title */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 min-w-0 flex-1">
          {/* Mobile Sidebar - Always first on mobile */}
          <div className="lg:hidden flex-shrink-0">
            <MobildSideBard />
          </div>

          {/* Back Button */}
          {goBack && (
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="icon"
              className="flex-shrink-0 h-8 w-8 sm:h-9 sm:w-9"
            >
              <BackDirectionIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          )}

          {/* Title */}
          <h1 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate min-w-0">
            {title}
          </h1>
        </div>

        {/* Right Section - Search, Notifications & User Nav (search close to notification) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="hidden lg:block flex-shrink-0">
            <SearchInput />
          </div>
          <div className="flex-shrink-0">
            <Notifications
              accountId={user.accountId}
              notifications={notifications}
            />
          </div>

          <div className="flex-shrink-0">
            <UserNav user={user} />
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Search Bar */}
      <div className="lg:hidden px-2 sm:px-4 pb-3">
        <SearchInput />
      </div>
    </div>
  );
};

export default Header;
