"use client";

import { Gift, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import Link from "next/link";
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
    return (
      <div className="w-10 h-full flex items-center justify-start 6 z-[99] cursor-pointer ">
        <Avatar className="w-10 h-10  rounded-[50%]">
          <AvatarImage src={student?.photo_url} />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      </div>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-10 h-full flex items-center justify-start 6 z-[99] cursor-pointer ">
          <Avatar className="w-10 h-10  rounded-[50%]">
            <AvatarImage src={student?.photo_url} />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className=" w-56 z-[99] ">
        <div className="w-full h-[70px] flex items-center justify-between px-2">
          <div className="w-[70%] h-full flex flex-col justify-center">
            <p>{student?.full_name}</p>
          </div>
          <Avatar className="w-12 h-12 ring-primary   rounded-[50%]">
            <AvatarImage src={student.photo_url} />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
        </div>
        <DropdownMenuGroup>
          <DropdownMenuSeparator />
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
            className="  w-full  h-full flex justify-between items-center p-3"
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
