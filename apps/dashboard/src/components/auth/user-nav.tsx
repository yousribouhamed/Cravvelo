"use client";

import {
  ArrowLeft,
  ArrowRight,
  User,
  ChevronDown,
  Eye,
  ArrowUpLeft,
  ArrowUpRight,
  CreditCard,
  Moon,
  Sun,
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
import { Switch } from "@ui/components/ui/switch";
import Image from "next/image";
import Link from "next/link";
import LogoutButton from "./logout-button";
import { UserData } from "@/src/types";
import { useTranslations, useLocale } from "next-intl";
import { useMemo, useEffect, useState } from "react";
import { useTheme } from "next-themes";
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
  const tTheme = useTranslations("settings.theme");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [themeMounted, setThemeMounted] = useState(false);

  useEffect(() => {
    setThemeMounted(true);
  }, []);

  const isDark = themeMounted && resolvedTheme === "dark";

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

  const planLabel = useMemo(() => {
    if (!user?.subscription) return t("freePlan");
    const sub = user.subscription;
    const planNameKey = `subscription.plans.${sub.planCode.toLowerCase()}.name` as const;
    const planName = t(planNameKey);
    const cycleKey =
      sub.billingCycle === "YEARLY" ? "subscription.yearly" : "subscription.monthly";
    return `${planName} (${t(cycleKey)})`;
  }, [user?.subscription, t]);

  const navigationItems = useMemo(
    () => [
      {
        href: "/settings/profile",
        icon: User,
        label: t("profile"),
        external: false,
      },
      {
        href: "/settings/subscription",
        icon: CreditCard,
        label: t("subscription"),
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
        dir={isRTL ? "rtl" : "ltr"}
        className="w-60 bg-popover border-border text-base antialiased"
      >
        {/* User Profile Header */}
        <div
          className={cn(
            "w-full min-h-[70px] flex items-center gap-3 px-3 py-3",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}
        >
          <Button
            size="icon"
            className="w-8 h-8 flex-shrink-0 hover:bg-accent/50 transition-colors"
            variant="secondary"
          >
            <Eye className="text-muted-foreground hover:text-foreground w-4 h-4 transition-colors" />
          </Button>

          <div
            className={cn(
              "cursor-pointer flex flex-1 items-center gap-3 hover:opacity-90 transition-opacity min-w-0",
              isRTL ? "flex-row-reverse" : "flex-row"
            )}
          >
            <Avatar className="w-9 h-9 rounded-lg flex-shrink-0">
              <AvatarImage src={user?.avatar || ""} />
              <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
                AB
              </AvatarFallback>
            </Avatar>
            <p className="text-sm font-semibold text-foreground truncate">
              {user?.firstName || ""} {t("academy")}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-border" />

        {/* Verification Section */}
        <div className="w-full min-h-[80px] flex flex-col px-3 py-2">
          <div
            className={cn(
              "w-full min-h-[50px] flex items-center gap-2",
              isRTL ? "flex-row-reverse justify-between" : "flex-row justify-between"
            )}
          >
            <VerificationDirectionIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />

            <div
              className={cn(
                "flex items-center gap-2 min-w-0 flex-1",
                isRTL ? "flex-row-reverse justify-end" : "flex-row justify-start"
              )}
            >
              <p className="text-sm font-medium text-foreground leading-snug">
                {verificationText}
              </p>
              <Image
                alt="verified image"
                src="/verified.svg"
                width={20}
                height={20}
                className="flex-shrink-0"
              />
            </div>
          </div>

          <div className="w-full h-2 flex items-center mt-1">
            <Progress
              value={verificationProgress}
              className="h-1.5 w-full bg-muted"
            />
          </div>
        </div>

        <DropdownMenuSeparator className="bg-border" />

        {/* Current plan */}
        <div
          className={cn(
            "w-full px-3 py-2 flex items-center justify-between text-sm text-muted-foreground",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}
        >
          <span>{t("currentPlan")}</span>
          <span className="font-medium text-foreground">{planLabel}</span>
        </div>

        <DropdownMenuSeparator className="bg-border" />

        {/* Navigation Items - English: label first then icon; Arabic: icon first then label */}
        <DropdownMenuGroup>
          {navigationItems.map((item) => (
            <DropdownMenuItem
              key={item.href}
              className="hover:bg-accent focus:bg-accent transition-colors p-0"
            >
              <Link
                href={item.href}
                target={item.external ? "_blank" : undefined}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2.5 text-foreground hover:text-foreground transition-colors",
                  isRTL ? "flex-row-reverse justify-between" : "flex-row justify-between"
                )}
              >
                {isRTL ? (
                  <>
                    <item.icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </>
                ) : (
                  <>
                    <span className="font-medium text-sm">{item.label}</span>
                    <item.icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  </>
                )}
              </Link>
            </DropdownMenuItem>
          ))}

          {/* Academy Preview - English: label first then icon; Arabic: icon first then label */}
          <DropdownMenuItem
            disabled={!user?.subdomain}
            className="hover:bg-accent focus:bg-accent transition-colors p-0 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
          >
            <Link
              href={user?.subdomain ? `https://${user.subdomain}` : "#"}
              target="_blank"
              onClick={!user?.subdomain ? (e) => e.preventDefault() : undefined}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2.5 transition-colors",
                isRTL ? "flex-row-reverse justify-between" : "flex-row justify-between",
                user?.subdomain
                  ? "text-foreground hover:text-foreground/90"
                  : "cursor-not-allowed opacity-50 text-foreground"
              )}
            >
              {isRTL ? (
                <>
                  <ExternalLinkDirectionIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  <span className="font-medium text-sm">{t("academyPreview")}</span>
                </>
              ) : (
                <>
                  <span className="font-medium text-sm">{t("academyPreview")}</span>
                  <ExternalLinkDirectionIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                </>
              )}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-border" />

        {/* Theme switcher - prevent dropdown close when toggling */}
        <div
          role="presentation"
          className={cn(
            "flex items-center justify-between gap-2 px-3 py-2.5 text-sm",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={cn(
              "flex items-center gap-2 min-w-0 flex-1",
              isRTL ? "flex-row-reverse" : "flex-row"
            )}
          >
            {isDark ? (
              <Moon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            ) : (
              <Sun className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            )}
            <span className="font-medium text-foreground">
              {tTheme("label")}
            </span>
          </div>
          {themeMounted && (
            <div dir="ltr">
              <Switch
                checked={isDark}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                aria-label={tTheme("description")}
              />
            </div>
          )}
        </div>

        <DropdownMenuSeparator className="bg-border" />

        <LogoutButton isRTL={isRTL} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
