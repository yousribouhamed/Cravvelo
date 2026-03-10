"use client";

import { SIDEBAR_ITEMS } from "@/config/sidebar-items";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/loader-icon";

interface MainSidebarProps {
  admin?: any; // Replace with your admin type
}

export default function MainSidebar({ admin }: MainSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [iconsLoading, setIconsLoading] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    // Simulate icon loading - in a real app, you might check if icons are actually loaded
    const timer = setTimeout(() => {
      setIconsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const sidebarWidth = isCollapsed ? "w-[80px]" : "w-[280px]";
  const iconSize = isCollapsed ? "w-10 h-10" : "w-12 h-12";

  return (
    <div
      className={cn(
        "bg-white border-r border-zinc-200 transition-all duration-300 ease-in-out h-full flex flex-col relative",
        sidebarWidth
      )}
    >
      {/* Header Section */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Image
              src={"/cravvelo-logo.svg"}
              alt={"cravvelo logo"}
              width={32}
              height={32}
              className="rounded-lg"
            />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-semibold text-zinc-900 truncate">
                Cravvelo
              </h1>
              <p className="text-xs text-zinc-500 truncate">
                Admin Dashboard
              </p>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-700 transition-colors duration-200 flex-shrink-0"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation Section */}
      {admin && (
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {SIDEBAR_ITEMS.map((item) => {
              const isEnabled = item.enabled ?? true;
              const disabledStyles = isEnabled
                ? ""
                : "opacity-50 cursor-not-allowed pointer-events-none";

              if (isCollapsed) {
                const content = (
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-xl transition-all duration-200 group text-zinc-600",
                      iconSize,
                      "p-3",
                      isEnabled
                        ? "hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2"
                        : disabledStyles
                    )}
                  >
                    <span className="flex-shrink-0">
                      {iconsLoading ? (
                        <Loader size={20} />
                      ) : (
                        item.icon
                      )}
                    </span>
                  </div>
                );

                return (
                  <Tooltip key={item.slug} delayDuration={300}>
                    {isEnabled ? (
                      <TooltipTrigger asChild>
                        <Link href={item.slug}>{content}</Link>
                      </TooltipTrigger>
                    ) : (
                      <TooltipTrigger asChild>
                        <div>{content}</div>
                      </TooltipTrigger>
                    )}
                    <TooltipContent
                      side="right"
                      sideOffset={12}
                      className="bg-popover text-popover-foreground border border-border p-3 rounded-lg shadow-lg font-medium text-sm"
                    >
                      <p>{item.name}</p>
                      {!isEnabled && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Coming soon
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              const content = (
                <div
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group text-zinc-600",
                    isEnabled
                      ? "hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2"
                      : disabledStyles
                  )}
                >
                  <span className="flex-shrink-0">
                    {iconsLoading ? (
                      <Loader size={20} />
                    ) : (
                      item.icon
                    )}
                  </span>
                  <span className="font-medium text-sm truncate">
                    {item.name}
                  </span>
                </div>
              );

              return (
                <div key={item.slug}>
                  {isEnabled ? (
                    <Link href={item.slug}>{content}</Link>
                  ) : (
                    content
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
