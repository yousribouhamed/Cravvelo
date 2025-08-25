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

interface MainSidebarProps {
  admin?: any; // Replace with your admin type
}

export default function MainSidebar({ admin }: MainSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const sidebarWidth = isCollapsed ? "w-[80px]" : "w-[280px]";
  const iconSize = isCollapsed ? "w-10 h-10" : "w-12 h-12";

  return (
    <div
      className={cn(
        "bg-background  transition-all duration-300 ease-in-out h-full flex flex-col relative",
        sidebarWidth
      )}
    >
      {/* Header Section */}
      <div className="p-4  flex items-center justify-between">
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
              <h1 className="text-lg font-semibold text-foreground truncate">
                Cravvelo
              </h1>
              <p className="text-xs text-muted-foreground truncate">
                Admin Dashboard
              </p>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-accent transition-colors duration-200 flex-shrink-0"
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
              if (isCollapsed) {
                return (
                  <Tooltip key={item.slug} delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.slug}
                        className={cn(
                          "flex items-center justify-center rounded-xl transition-all duration-200 group",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                          iconSize,
                          "p-3"
                        )}
                      >
                        <span className="flex-shrink-0">{item.icon}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      sideOffset={12}
                      className="bg-popover text-popover-foreground border border-border p-3 rounded-lg shadow-lg font-medium text-sm"
                    >
                      <p>{item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return (
                <Link
                  key={item.slug}
                  href={item.slug}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  )}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="font-medium text-sm truncate">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
