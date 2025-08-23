"use client";

import type { FC } from "react";
import * as React from "react";
import { useClerk } from "@clerk/nextjs";
import { useMounted } from "@/src/hooks/use-mounted";
import { DropdownMenuItem } from "@ui/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

const LogoutButton: FC = () => {
  const mounted = useMounted();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut({
        redirectUrl: "/",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      // Fallback redirect
      window.location.href = "/";
    }
  };

  if (!mounted) {
    return (
      <DropdownMenuItem
        disabled
        className="w-full h-full flex justify-between items-center p-3"
      >
        <LogOut className="h-4 w-4 text-red-500" />
        <span className="text-red-500">تسجيل الخروج</span>
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem
      className="w-full h-full flex justify-between items-center p-3 cursor-pointer"
      onClick={handleSignOut}
    >
      <LogOut className="h-4 w-4 text-red-500" />
      <span className="text-red-500">تسجيل الخروج</span>
    </DropdownMenuItem>
  );
};

export default LogoutButton;
