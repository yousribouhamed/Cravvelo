"use client";

import { Button } from "@ui/components/ui/button";
import { LogOut } from "lucide-react";
import type { FC } from "react";
import { deleteCookie } from "../lib/utils";

const SignOutButton: FC = ({}) => {
  const logout = () => {
    deleteCookie("jwt");
    deleteCookie("adminId");

    window.location.reload();
  };

  return (
    <Button onClick={logout} className="bg-black hover:bg-zinc-900">
      <LogOut className="w-4 h-4 ml-2 text-white" />
      تسجيل الخروج
    </Button>
  );
};

export default SignOutButton;
