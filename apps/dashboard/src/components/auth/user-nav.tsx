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
import { USER_NAV_AR, USER_NAV_EN } from "@cravvelo/i18n";

interface UserNavProps {
  user: UserData;
}

export default function UserNav({ user }: UserNavProps) {
  const USER_NAV = user.lang === "en" ? USER_NAV_EN : USER_NAV_AR;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={` ${buttonVariants({
            variant: "ghost",
          })}  cursor-pointer  w-20 md:w-48   flex items-center  rounded-xl border justify-start gap-x-6 md:gap-x-4 bg-white !p-2 `}
        >
          <div className="w-[20%] h-full flex items-center justify-start ">
            <Avatar className="w-8 h-8  rounded-[50%]">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
          </div>
          <div className=" md:w-[80%] w-4 h-full  justify-end items-center flex gap-x-2">
            <p className="text-md w-fit  hidden md:flex text-[#303030]">
              {user?.user_name
                ? user?.user_name
                : user?.firstName
                ? user?.firstName
                : ""}
            </p>
            <ChevronDown className="w-4 h-4 text-[#303030] hover:text-accent-foreground " />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={user.lang === "en" ? "end" : "start"}
        className=" w-56 "
      >
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

            <p className="text-md text-[#303030]">
              {user?.firstName ? user?.firstName : "ah"}{" "}
              {user?.lang === "en" ? "Academia" : "اكاديمية"}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="w-full h-[80px] flex flex-col px-2">
          <div className="w-full h-[50px] flex items-center justify-between">
            <ArrowLeft className="w-4 h-4" />
            <div
              className={`w-[70%] h-full flex items-center  gap-x-2 ${
                user?.lang === "en" ? "justify-start" : "justify-end"
              }`}
            >
              <p className="text-sm text-[#303030] text-start">
                {user.verification_steps === 3
                  ? user.lang === "en"
                    ? "approved account"
                    : "تم التوثيق بنجاح"
                  : user.lang === "en"
                  ? "start approving now"
                  : " ابدأ التوثيق الآن"}
              </p>
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
            <Progress
              value={
                user.verification_steps === 0
                  ? 0
                  : user.verification_steps === 1
                  ? 25
                  : user.verification_steps === 2
                  ? 75
                  : 100
              }
              className="h-1 w-full bg-[#EFEFEF]"
            />
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="w-full  h-full flex justify-between items-center  ">
            <Link
              className="w-full  h-full flex justify-between items-center p-2 "
              href={"/profile"}
            >
              {user.lang === "en" ? (
                <>
                  <span>{USER_NAV.profile}</span>
                  <User className=" h-4 w-4" />
                </>
              ) : (
                <>
                  <User className=" h-4 w-4" />
                  <span>{USER_NAV.profile}</span>
                </>
              )}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="w-full  h-full flex justify-between items-center  ">
            <Link
              className="w-full  h-full flex justify-between items-center p-2 "
              href={"/pricing"}
            >
              {user.lang === "en" ? (
                <>
                  <span>{USER_NAV.plan}</span>
                  <Gift className=" h-4 w-4" />
                </>
              ) : (
                <>
                  <Gift className=" h-4 w-4" />
                  <span>{USER_NAV.plan}</span>
                </>
              )}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="w-fulls  h-full flex justify-between items-center  ">
            <Link
              target="_blank"
              className="w-full  h-full flex justify-between items-center p-2 "
              href={"https://www.instagram.com/mugi.crafts/"}
            >
              {user.lang === "en" ? (
                <>
                  <span>{USER_NAV.helpCenter}</span>
                  <ArrowUpLeft className=" h-4 w-4" />
                </>
              ) : (
                <>
                  <ArrowUpLeft className=" h-4 w-4" />
                  <span>{USER_NAV.helpCenter}</span>
                </>
              )}
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
              {user.lang === "en" ? (
                <>
                  <span>{USER_NAV.roadmap}</span>
                  <ArrowUpLeft className=" h-4 w-4" />
                </>
              ) : (
                <>
                  <ArrowUpLeft className=" h-4 w-4" />

                  <span>{USER_NAV.roadmap}</span>
                </>
              )}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <LogoutButton lang={user?.lang} name={USER_NAV.logout} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
