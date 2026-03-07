"use client";

import type { FC } from "react";
import * as React from "react";
import { useClerk } from "@clerk/nextjs";
import { useMounted } from "@/src/hooks/use-mounted";
import { DropdownMenuItem } from "@ui/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@ui/lib/utils";

interface LogoutButtonProps {
  isRTL?: boolean;
}

const LogoutButton: FC<LogoutButtonProps> = ({ isRTL = false }) => {
  const t = useTranslations("auth");
  const mounted = useMounted();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut({
        redirectUrl: "/",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      window.location.href = "/";
    }
  };

  const content = (
    <>
      {isRTL ? (
        <>
          <LogOut className="h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" />
          <span className="font-medium text-sm text-red-600 dark:text-red-400">{t("logout")}</span>
        </>
      ) : (
        <>
          <span className="font-medium text-sm text-red-600 dark:text-red-400">{t("logout")}</span>
          <LogOut className="h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" />
        </>
      )}
    </>
  );

  if (!mounted) {
    return (
      <DropdownMenuItem
        disabled
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2.5 cursor-not-allowed",
          isRTL ? "flex-row-reverse justify-between" : "flex-row justify-between"
        )}
      >
        {content}
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2.5 cursor-pointer",
        isRTL ? "flex-row-reverse justify-between" : "flex-row justify-between"
      )}
      onClick={handleSignOut}
    >
      {content}
    </DropdownMenuItem>
  );
};

export default LogoutButton;
