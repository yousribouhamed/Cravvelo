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
import { Student, UserData } from "@/src/types";
import { FC } from "react";

interface studentNavProps {
  student: Student;
}

const StudentNav: FC<studentNavProps> = ({ student }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="w-10 h-full flex items-center justify-start ">
          <Avatar className="w-8 h-8  rounded-[50%]">
            <AvatarImage src={student?.avatar} />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className=" w-56 ">
        <div
          dir="ltr"
          className="w-full h-[70px]  flex items-center justify-between px-2"
        >
          <Button size="icon" className="w-6 h-6 p-1" variant="secondary">
            <Eye className="text-gray-700 w-2 h-2 " />
          </Button>
          <div
            className={`  cursor-pointer   flex justify-center items-end gap-y-2  w-full h-full flex-col `}
          >
            <Avatar className="w-8 h-8 rounded-md">
              <AvatarImage src={student?.avatar} />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>

            <p className="text-md text-black">
              {student?.firstName ? student?.firstName : "ah"} اكاديمية
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem className="w-full  h-full flex justify-between items-center  ">
            <Link
              className="w-full  h-full flex justify-between items-center p-2 "
              href={"/profile"}
            >
              <User className=" h-4 w-4" />
              <span>الملف الشخصي</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="w-full  h-full flex justify-between items-center  ">
            <Link
              className="w-full  h-full flex justify-between items-center p-2 "
              href={"/pricing"}
            >
              <Gift className=" h-4 w-4" />
              <span>باقة الأكاديمية</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="w-fulls  h-full flex justify-between items-center  ">
            <Link
              target="_blank"
              className="w-full  h-full flex justify-between items-center p-2 "
              href={"https://www.instagram.com/mugi.crafts/"}
            >
              <ArrowUpLeft className=" h-4 w-4" />
              <span> مركز المساعدة</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StudentNav;
