import { ArrowLeft, Gift, User } from "lucide-react";
import { ChevronDown } from "lucide-react";
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
import LogoutButton from "./logout-button";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Progress } from "@ui/components/ui/progress";
import Image from "next/image";
import { UserData } from "@/src/types";
import { ArrowUpLeft } from "lucide-react";

interface UserNavProps {
  user: UserData;
}

export default function UserNav({ user }: UserNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={` ${buttonVariants({
            variant: "ghost",
          })}  cursor-pointer  w-48   flex items-center  rounded-xl border justify-start gap-x-4 bg-white !p-2 `}
        >
          <div className="w-[20%] h-full flex items-center justify-start ">
            <Avatar className="w-8 h-8  rounded-[50%]">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
          </div>
          <div className="w-[80%] h-full flex justify-end items-center gap-x-2">
            <p className="text-md w-fit  text-black">
              {user?.user_name
                ? user?.user_name
                : user?.firstName
                ? user?.firstName
                : "مرحباً"}
            </p>
            <ChevronDown className="w-4 h-4 text-black hover:text-accent-foreground " />
          </div>
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
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>

            <p className="text-md text-black">
              {user?.firstName ? user?.firstName : "ah"} اكاديمية
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="w-full h-[80px] flex flex-col px-2">
          <div className="w-full h-[50px] flex items-center justify-between">
            <ArrowLeft className="w-4 h-4" />
            <div className="w-[70%] h-full flex items-center justify-end gap-x-2">
              <p className="text-sm text-black text-start">ابدأ التوثيق الآن</p>
              <Image
                alt="verified image"
                src="/verified.png"
                width={20}
                height={20}
              />
            </div>
          </div>

          <div
            dir="rtl"
            className="w-full h-[20px] flex justify-center items-center"
          >
            <Progress value={25} className="h-1 w-full bg-[#EFEFEF]" />
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

          <DropdownMenuItem
            disabled={user?.subdomain ? false : true}
            className="w-full  h-full flex justify-between items-center  "
          >
            <Link
              target="_blank"
              className="w-full  h-full flex justify-between items-center p-2 "
              href={`https://${user?.subdomain}`}
            >
              <ArrowUpLeft className=" h-4 w-4" />

              <span>معاينة الأكاديمية</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
