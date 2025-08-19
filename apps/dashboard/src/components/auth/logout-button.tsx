"use client";

import type { FC } from "react";
import * as React from "react";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { useMounted } from "@/src/hooks/use-mounted";
import { DropdownMenuItem } from "@ui/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { deleteAllCookies } from "@/src/lib/utils";

const LogoutButton: FC = ({}) => {
  const router = useRouter();
  const mounted = useMounted();

  const handleSignOut = () => {
    deleteAllCookies();
    // The redirect will happen automatically after sign out
  };

  if (!mounted) {
    return (
      <DropdownMenuItem
        disabled
        className="w-full h-full flex justify-between items-center p-3 "
      >
        <LogOut className=" h-4 w-4 text-red-500" />
        <span className="text-red-500">تسجيل الخروج</span>
      </DropdownMenuItem>
    );
  }

  return (
    <SignOutButton redirectUrl="/">
      <DropdownMenuItem
        className="w-full h-full flex justify-between items-center p-3"
        onClick={handleSignOut}
      >
        <LogOut className=" h-4 w-4 text-red-500" />
        <span className="text-red-500">تسجيل الخروج</span>
      </DropdownMenuItem>
    </SignOutButton>
  );
};

export default LogoutButton;
