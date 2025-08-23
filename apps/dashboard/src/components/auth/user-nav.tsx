import { ArrowLeft, User, ChevronDown, Eye, ArrowUpLeft } from "lucide-react";
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
  const name = user?.firstName || user?.user_name || "";
  return name.trim() === "" ? "مستخدم" : name;
};

// Helper function to get verification progress
const getVerificationProgress = (steps: number | undefined): number => {
  if (typeof steps !== "number") return 0;

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

const getVerificationText = (steps: number | undefined): string => {
  return steps === 3 ? "تم التوثيق بنجاح" : "ابدأ التوثيق الآن";
};

const navigationItems = [
  {
    href: "/profile",
    icon: User,
    label: "الملف الشخصي",
    external: false,
  },
] as const;

export default function UserNav({ user }: UserNavProps) {
  const displayName = getDisplayName(user);
  const verificationProgress = getVerificationProgress(
    user?.verification_steps
  );
  const verificationText = getVerificationText(user?.verification_steps);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={`${buttonVariants({
            variant: "ghost",
          })} cursor-pointer w-20 md:w-48 flex items-center rounded-xl border border-border justify-start gap-x-6 md:gap-x-4 bg-card hover:bg-accent/50 transition-colors !p-2`}
        >
          <div className="w-[20%] h-full flex items-center justify-start">
            <Avatar className="w-8 h-8 rounded-2xl">
              <AvatarImage src={user?.avatar || ""} />
              <AvatarFallback className="bg-muted text-muted-foreground">
                AB
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="md:w-[80%] w-4 h-full justify-end items-center flex gap-x-2">
            <p className="text-md w-fit hidden md:flex text-foreground">
              {displayName ?? "مستخدم"}
            </p>
            <ChevronDown className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-56 bg-popover border-border"
      >
        {/* User Profile Header */}
        <div
          dir="ltr"
          className="w-full h-[70px] flex items-center justify-between px-2"
        >
          <Button
            size="icon"
            className="w-6 h-6 p-1 hover:bg-accent/50 transition-colors"
            variant="secondary"
          >
            <Eye className="text-muted-foreground hover:text-foreground w-2 h-2 transition-colors " />
          </Button>
          <div className="cursor-pointer flex justify-center items-end gap-y-2 w-full h-full flex-col hover:opacity-80 transition-opacity">
            <Avatar className="w-8 h-8 rounded-md">
              <AvatarImage src={user?.avatar || ""} />
              <AvatarFallback className="bg-muted text-muted-foreground">
                AB
              </AvatarFallback>
            </Avatar>
            <p className="text-md text-foreground">
              {user?.firstName || ""} اكاديمية
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-border" />

        {/* Verification Section */}
        <div className="w-full h-[80px] flex flex-col px-2">
          <div className="w-full h-[50px] flex items-center justify-between">
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            <div className="w-[70%] h-full flex items-center justify-end gap-x-2">
              <p className="text-sm text-foreground text-start">
                {verificationText}
              </p>
              <Image
                alt="verified image"
                src="/verified.svg"
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
              value={verificationProgress}
              className="h-1 w-full bg-muted"
            />
          </div>
        </div>

        <DropdownMenuSeparator className="bg-border" />

        {/* Navigation Items */}
        <DropdownMenuGroup>
          {navigationItems.map((item) => (
            <DropdownMenuItem
              key={item.href}
              className="w-full h-full flex justify-between items-center hover:bg-accent focus:bg-accent transition-colors"
            >
              <Link
                className="cursor-pointer w-full h-full flex justify-between items-center p-2 text-foreground hover:text-foreground/80 transition-colors"
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
            className="w-full h-full flex justify-between items-center hover:bg-accent focus:bg-accent data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed transition-colors"
          >
            <Link
              target="_blank"
              className={`w-full h-full flex justify-between items-center p-2 text-foreground transition-colors ${
                user?.subdomain
                  ? "cursor-pointer hover:text-foreground/80"
                  : "cursor-not-allowed opacity-50"
              }`}
              href={user?.subdomain ? `https://${user.subdomain}` : "#"}
              onClick={!user?.subdomain ? (e) => e.preventDefault() : undefined}
            >
              <ArrowUpLeft className="h-4 w-4" />
              <span>معاينة الأكاديمية</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-border" />

        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
