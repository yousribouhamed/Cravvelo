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
            size: "lg",
          })}  cursor-pointer flex items-center justify-end gap-x-2 !p-2`}
        >
          <Avatar>
            <AvatarImage src={user?.imageUrl ?? user?.imageUrl} />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <p className="text-md text-black">
            مرحباً {user?.firstName ? user?.firstName : "ah"}
          </p>
          <ChevronDown className="w-4 h-4 text-black hover:text-accent-foreground " />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[16rem] ">
        <div className="w-full h-[70px] bg-gray-100 flex items-center justify-center">
          <span>{user?.emailAddresses[0].emailAddress}</span>
        </div>
        <DropdownMenuGroup>
          <DropdownMenuItem className="w-full  h-full flex justify-end items-center p-3 ">
            <span>الملف الشخصي</span>
            <User className="ml-2 h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="w-full h-full flex justify-end items-center p-3">
            <span>باقة الأكاديمية</span>
            <CreditCard className="ml-2 h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="w-full h-full flex justify-end items-center p-3 ">
            <span>برنامج شركاء مساق</span>
            <Settings className="ml-2 h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="w-full h-full flex justify-end items-center p-3 ">
            <span>Keyboard shortcuts</span>
            <Keyboard className="ml-2 h-4 w-4" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuSeparator />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
