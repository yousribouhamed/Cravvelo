import { ArrowLeft, Gift, User, ChevronDown, Eye, ArrowUpLeft } from "lucide-react";
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
import { Progress } from "@ui/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "./logout-button";
import { UserData } from "@/src/types";

interface UserNavProps {
  user: UserData;
}

// Helper function to get display name
const getDisplayName = (user: UserData): string => {
  return user?.user_name || user?.firstName || "مرحباً";
};

// Helper function to get verification progress
const getVerificationProgress = (steps: number): number => {
  switch (steps) {
    case 0:
      return 0;
    case 1:
      return 25;
    case 2:
      return 75;
    case 3:
    default:
      return 100;
  }
};

// Helper function to get verification text
const getVerificationText = (steps: number): string => {
  return steps === 3 ? "تم التوثيق بنجاح" : "ابدأ التوثيق الآن";
};

// Navigation menu items configuration
const navigationItems = [
  {
    href: "/profile",
    icon: User,
    label: "الملف الشخصي",
    external: false,
  },
  {
    href: "/pricing",
    icon: Gift,
    label: "باقة الأكاديمية",
    external: false,
  },
  {
    href: "https://www.instagram.com/mugi.crafts/",
    icon: ArrowUpLeft,
    label: "مركز المساعدة",
    external: true,
  },
] as const;

export default function UserNav({ user }: UserNavProps) {
  const displayName = getDisplayName(user);
  const verificationProgress = getVerificationProgress(user.verification_steps);
  const verificationText = getVerificationText(user.verification_steps);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`${buttonVariants({
            variant: "ghost",
          })} cursor-pointer w-20 md:w-48 flex items-center rounded-xl border justify-start gap-x-6 md:gap-x-4 bg-white !p-2`}
        >
          <div className="w-[20%] h-full flex items-center justify-start">
            <Avatar className="w-8 h-8 rounded-[50%]">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
          </div>
          <div className="md:w-[80%] w-4 h-full justify-end items-center flex gap-x-2">
            <p className="text-md w-fit hidden md:flex text-black">
              {displayName}
            </p>
            <ChevronDown className="w-4 h-4 text-black hover:text-accent-foreground" />
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        {/* User Profile Header */}
        <div dir="ltr" className="w-full h-[70px] flex items-center justify-between px-2">
          <Button size="icon" className="w-6 h-6 p-1" variant="secondary">
            <Eye className="text-gray-700 w-2 h-2" />
          </Button>
          <div className="cursor-pointer flex justify-center items-end gap-y-2 w-full h-full flex-col">
            <Avatar className="w-8 h-8 rounded-md">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <p className="text-md text-black">
              {user?.firstName || "ah"} اكاديمية
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Verification Section */}
        <div className="w-full h-[80px] flex flex-col px-2">
          <div className="w-full h-[50px] flex items-center justify-between">
            <ArrowLeft className="w-4 h-4" />
            <div className="w-[70%] h-full flex items-center justify-end gap-x-2">
              <p className="text-sm text-black text-start">
                {verificationText}
              </p>
              <Image
                alt="verified image"
                src="/verified.png"
                width={20}
                height={20}
              />
            </div>
          </div>
          <div dir="rtl" className="w-full h-[20px] flex justify-center items-center">
            <Progress
              value={verificationProgress}
              className="h-1 w-full bg-[#EFEFEF]"
            />
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Navigation Items */}
        <DropdownMenuGroup>
          {navigationItems.map((item) => (
            <DropdownMenuItem
              key={item.href}
              className="w-full h-full flex justify-between items-center"
            >
              <Link
                className="w-full h-full flex justify-between items-center p-2"
                href={item.href}
                target={item.external ? "_blank" : undefined}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}

          {/* Academy Preview - Conditional Item */}
          <DropdownMenuItem
            disabled={!user?.subdomain}
            className="w-full h-full flex justify-between items-center"
          >
            <Link
              target="_blank"
              className="w-full h-full flex justify-between items-center p-2"
              href={`https://${user?.subdomain}`}
            >
              <ArrowUpLeft className="h-4 w-4" />
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