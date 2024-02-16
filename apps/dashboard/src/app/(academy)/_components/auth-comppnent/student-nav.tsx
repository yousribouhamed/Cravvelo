"use client";

import { Gift, User } from "lucide-react";
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

interface studentNavProps {
  student: Student;
}

const StudentNav: FC<studentNavProps> = ({ student }) => {
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
          <DropdownMenuItem className="w-fulls  h-full flex justify-between items-center  ">
            <Link
              target="_blank"
              className="w-full  h-full flex justify-between items-center p-2 "
              href={"https://www.instagram.com/mugi.crafts/"}
            >
              <ArrowUpLeft className=" h-4 w-4" />
              <span className="text-red-500">تسجيل الخروج</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StudentNav;
