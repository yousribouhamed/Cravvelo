import { CreditCard, Keyboard, LogOut, Settings, User } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import type { User as UserType } from "@clerk/nextjs/server";
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
import { Icons } from "../Icons";
import Link from "next/link";

interface UserNavProps {
  user: UserType;
}

export default function UserNav({ user }: UserNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={` ${buttonVariants({
            variant: "ghost",
          })}  cursor-pointer  w-48   flex items-center bg-white rounded-xl border justify-end gap-x-4 `}
        >
          <Avatar className="w-8 h-8 rounded-xl">
            <AvatarImage src={user?.imageUrl ?? user?.imageUrl} />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <p className="text-md text-black">
            مرحباً {user?.firstName ? user?.firstName : "ah"}
          </p>
          <ChevronDown className="w-4 h-4 text-black hover:text-accent-foreground " />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" w-48  ">
        <div className="w-full h-[70px]  flex items-center justify-center px-2">
          <Button size="icon" variant="secondary">
            <Icons.Order className="text-gray-700 w-4 h-4" />
          </Button>
          <div
            className={`  cursor-pointer   flex items-center justify-end gap-x-4  w-full `}
          >
            <p className="text-md text-black">
              {user?.firstName ? user?.firstName : "ah"} اكاديمية
            </p>
            <Avatar className="w-8 h-8">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="w-full  h-full flex justify-between items-center  ">
            <Link
              className="w-full  h-full flex justify-between items-center p-2 "
              href={"/profile"}
            >
              <User className="ml-2 h-4 w-4" />
              <span>الملف الشخصي</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="w-full  h-full flex justify-between items-center  ">
            <Link
              className="w-full  h-full flex justify-between items-center p-2 "
              href={"/pricing"}
            >
              <CreditCard className="ml-2 h-4 w-4" />
              <span>باقة الأكاديمية</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuItem className="w-full  h-full flex justify-between items-center  ">
            <Link
              className="w-full  h-full flex justify-between items-center p-2 "
              href={"/profile"}
            >
              <CreditCard className="ml-2 h-4 w-4" />
              <span> مركز المساعدة</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="w-full  h-full flex justify-between items-center  ">
            <Link
              className="w-full  h-full flex justify-between items-center p-2 "
              href={"/profile"}
            >
              <CreditCard className="ml-2 h-4 w-4" />
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
