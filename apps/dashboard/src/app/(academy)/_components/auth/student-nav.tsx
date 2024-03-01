"use client";

import { Gift, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { Button, buttonVariants } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import Link from "next/link";
import { Eye } from "lucide-react";
import { ArrowUpLeft } from "lucide-react";
import { UserData } from "@/src/types";
import type { Student } from "database";
import { FC } from "react";
import { useMounted } from "@/src/hooks/use-mounted";

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

interface studentNavProps {
  student: Student;
}

const StudentNav: FC<studentNavProps> = ({ student }) => {
  const mounted = useMounted();

  const logOut = () => {
    deleteCookie("jwt");
    deleteCookie("studentId");
    window?.location?.reload();
  };

  if (!mounted) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-10 h-full flex items-center justify-start 6 z-[99] cursor-pointer ">
          <Avatar className="w-10 h-10  rounded-[50%]">
            <AvatarImage
              src={
                "https://www.google.com/url?sa=i&url=https%3A%2F%2Fthe-artifice.com%2Frezero-love-fate-sins%2F&psig=AOvVaw0Ztx45IvWFAX7xBl7wkSRC&ust=1709411667092000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCOiiwPH004QDFQAAAAAdAAAAABAE"
              }
            />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className=" w-56 z-[99] ">
        <DropdownMenuGroup>
          <DropdownMenuItem className="w-full  h-full flex justify-between items-center  ">
            <Link
              className="w-full  h-full flex justify-between items-center p-2 "
              href={"/student-profile/studentId"}
            >
              <User className=" h-4 w-4" />
              <span>الملف الشخصي</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="w-full  h-full flex justify-between items-center  ">
            <Link
              className="w-full  h-full flex justify-between items-center p-2 "
              href={"/student-library"}
            >
              <Gift className=" h-4 w-4" />
              <span>المكتبة الرقمية</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={logOut}
            className="w-fulls  h-full flex justify-between items-center  "
          >
            <LogOut className=" h-4 w-4" />
            <span className="text-red-500">تسجيل الخروج</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StudentNav;
