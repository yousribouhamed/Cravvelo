"use client";

import type { FC } from "react";
import * as React from "react";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";

import { cn } from "@ui/lib/utils";
import { useMounted } from "@/src/hooks/use-mounted";
import { DropdownMenuItem } from "@ui/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

interface LogoutButtonAbdullahProps {}

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
    <SignOutButton
      signOutCallback={() =>
        startTransition(() => {
          router.push(`${window.location.origin}/?redirect=false`);
        })
      }
    >
      <DropdownMenuItem className="w-full h-full flex justify-end items-center p-3 ">
        <span className="text-red-500">تسجيل الخروج</span>
        <LogOut className="ml-2 h-4 w-4 text-red-500" />
      </DropdownMenuItem>
    </SignOutButton>
  );
};

export default LogoutButton;
