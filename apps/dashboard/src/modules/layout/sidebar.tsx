"use client";

import type { FC } from "react";
import { usePathname } from "next/navigation";
import React from "react";
import { Card, CardContent } from "@ui/components/ui/card";
import { buttonVariants } from "@ui/components/ui/button";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { cn } from "@ui/lib/utils";
import Link from "next/link";
import { SIDE_BAR_ITEMS } from "@/src/constants/side-bar-items";

interface SideBarMenuProps {
  onItemClick?: () => void;
}

const SideBarMenu: FC<SideBarMenuProps> = ({ onItemClick }) => {
  const pathname = usePathname();

  const isItemActive = (slug: string) => {
    return pathname === slug || pathname.startsWith(slug + "/");
  };

  if (!SIDE_BAR_ITEMS || SIDE_BAR_ITEMS.length === 0) {
    return null;
  }

  return (
    <ScrollArea className="h-[calc(100vh-8rem)] p-4">
      <Card className="bg-transparent border-gray-700">
        <CardContent className="p-2 space-y-1">
          {SIDE_BAR_ITEMS.map((item, index) => {
            const isActive = isItemActive(item.slug);

            return (
              <div key={`${item.title}-${index}`} className="space-y-1">
                <Link
                  href={item.slug}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "w-full justify-start text-white hover:bg-primary/80",
                    isActive && "bg-[#A44600] hover:bg-[#A44600]/90"
                  )}
                  onClick={onItemClick}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.title}
                </Link>

                {/* Render subitems if they exist */}
                {item.subitems &&
                  item.subitems.map((subItem, subIndex) => {
                    const isSubActive = isItemActive(subItem.slug);

                    return (
                      <Link
                        key={`${subItem.title}-${subIndex}`}
                        href={subItem.slug}
                        className={cn(
                          buttonVariants({ variant: "ghost" }),
                          "w-full justify-start text-white/80 text-sm pl-8 hover:bg-primary/60",
                          isSubActive &&
                            "bg-[#A44600]/70 hover:bg-[#A44600]/80 text-white"
                        )}
                        onClick={onItemClick}
                      >
                        {subItem.title}
                      </Link>
                    );
                  })}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </ScrollArea>
  );
};

export default SideBarMenu;
