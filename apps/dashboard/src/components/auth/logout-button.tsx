"use client";

import type { FC } from "react";
import * as React from "react";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { useMounted } from "@/src/hooks/use-mounted";
import { DropdownMenuItem } from "@ui/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

const LogoutButton: FC = ({}) => {
  const router = useRouter();
  const mounted = useMounted();
  const [isPending, startTransition] = React.useTransition();

  if (!mounted) {
    return (
      <DropdownMenuItem
        disabled
        className="w-full h-full flex justify-end items-center p-3 "
      >
        <span className="text-red-500">تسجيل الخروج</span>
        <LogOut className="ml-2 h-4 w-4 text-red-500" />
      </DropdownMenuItem>
    );
  }

  return (
    <SignOutButton signOutCallback={() => router.push(`/sign-in`)}>
      <DropdownMenuItem className="w-full h-full flex justify-end items-center p-3 ">
        <span className="text-red-500">تسجيل الخروج</span>
        <LogOut className="ml-2 h-4 w-4 text-red-500" />
      </DropdownMenuItem>
    </SignOutButton>
  );
};

export default LogoutButton;
