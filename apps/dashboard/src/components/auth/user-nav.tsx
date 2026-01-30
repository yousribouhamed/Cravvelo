"use client";

import {
  ArrowLeft,
  ArrowRight,
  User,
  ChevronDown,
  Eye,
  ArrowUpLeft,
  ArrowUpRight,
} from "lucide-react";
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
import { useTranslations, useLocale } from "next-intl";
import { useMemo } from "react";
import { cn } from "@ui/lib/utils";

interface UserNavProps {
  user: UserData;
}

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

export default function UserNav({ user }: UserNavProps) {
  const t = useTranslations("userNav");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const VerificationDirectionIcon = isRTL ? ArrowLeft : ArrowRight;
  const ExternalLinkDirectionIcon = isRTL ? ArrowUpLeft : ArrowUpRight;

  const displayName = useMemo(() => {
    const name = user?.firstName || user?.user_name || "";
    return name.trim() === "" ? t("defaultUser") : name;
  }, [user?.firstName, user?.user_name, t]);

  const verificationProgress = getVerificationProgress(
    user?.verification_steps
  );

  const verificationText = useMemo(() => {
    return user?.verification_steps === 3
      ? t("verificationComplete")
      : t("startVerification");
  }, [user?.verification_steps, t]);

  const navigationItems = useMemo(
    () => [
      {
        href: "/settings/profile",
        icon: User,
        label: t("profile"),
        external: false,
      },
    ],
    [t]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "cursor-pointer w-20 md:w-48 flex items-center rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors !p-2 py-4 !h-10",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}
        >
          <Avatar className="w-8 h-8 rounded-md">
            <AvatarImage src={user?.avatar || ""} />
            <AvatarFallback className="bg-muted text-muted-foreground">
              AB
            </AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-x-2 flex-1 justify-between">
            <p className="text-md hidden md:flex text-foreground">
              {displayName}
            </p>
            <ChevronDown className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
       
        align={isRTL ? "start" : "end"}
        className="w-56 bg-popover border-border"
      >
        {/* User Profile Header */}
        <div className="w-full h-[70px] flex items-center justify-between px-2">
          <Button
            size="icon"
            className="w-6 h-6 p-1 hover:bg-accent/50 transition-colors"
            variant="secondary"
          >
            <Eye className="text-muted-foreground hover:text-foreground w-3 h-3 transition-colors" />
          </Button>

          <div className="cursor-pointer flex flex-col items-end justify-center flex-1 hover:opacity-80 transition-opacity">
            <Avatar className="w-8 h-8 rounded-md">
              <AvatarImage src={user?.avatar || ""} />
              <AvatarFallback className="bg-muted text-muted-foreground">
                AB
              </AvatarFallback>
            </Avatar>
            <p className="text-md text-foreground">
              {user?.firstName || ""} {t("academy")}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-border" />

        {/* Verification Section */}
        <div className="w-full h-[80px] flex flex-col px-2">
          <div
            className={cn(
              "w-full h-[50px] flex items-center justify-between",
              isRTL ? "flex-row" : "flex-row-reverse"
            )}
          >
            <VerificationDirectionIcon className="w-4 h-4 text-muted-foreground" />

            <div className="flex items-center gap-x-2">
              <p className="text-sm text-foreground">
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

          <div className="w-full h-[20px] flex items-center">
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
              className="hover:bg-accent focus:bg-accent transition-colors"
            >
              <Link
                href={item.href}
                target={item.external ? "_blank" : undefined}
                className={cn(
                  "w-full flex items-center justify-between p-2 text-foreground hover:text-foreground/80 transition-colors",
                  isRTL ? "flex-row-reverse" : "flex-row"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}

          {/* Academy Preview */}
          <DropdownMenuItem
            disabled={!user?.subdomain}
            className="hover:bg-accent focus:bg-accent transition-colors data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
          >
            <Link
              href={user?.subdomain ? `https://${user.subdomain}` : "#"}
              target="_blank"
              onClick={!user?.subdomain ? (e) => e.preventDefault() : undefined}
              className={cn(
                "w-full flex items-center justify-between p-2 text-foreground transition-colors",
                isRTL ? "flex-row-reverse" : "flex-row",
                user?.subdomain
                  ? "hover:text-foreground/80"
                  : "cursor-not-allowed opacity-50"
              )}
            >
              <ExternalLinkDirectionIcon className="h-4 w-4" />
              <span>{t("academyPreview")}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-border" />

        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
