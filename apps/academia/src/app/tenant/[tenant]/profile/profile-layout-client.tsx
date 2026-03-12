"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import ProfileSidebar from "@/modules/profile/components/sidebar";
import { ProfileSidebarNavContent } from "@/modules/profile/components/sidebar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useTenantThemeStyles } from "@/hooks/use-tenant";
import { cn } from "@/lib/utils";

export default function ProfileLayoutClient({
  children,
}: React.PropsWithChildren) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { profileStyle } = useTenantThemeStyles();
  const isCompact = profileStyle === "COMPACT";
  const isSidebarLeft = profileStyle === "SIDEBAR_LEFT";

  return (
    <div
      className={cn(
        "w-full h-fit min-h-[400px] grid grid-cols-1 py-8",
        isCompact ? "md:grid-cols-[200px_1fr] gap-3" : "md:grid-cols-4 gap-4",
        isSidebarLeft && "md:grid-flow-col",
      )}
      data-profile-style={profileStyle}
    >
      {/* Desktop sidebar - SIDEBAR_LEFT keeps sidebar on left in RTL */}
      <aside className={cn("hidden md:block w-full", isSidebarLeft && "order-first")}>
        <ProfileSidebar />
      </aside>

      {/* Content: menu button (mobile only) + page content */}
      <div
        className={cn(
          "h-full min-w-0 flex flex-col gap-4",
          !isCompact && "md:col-span-3",
        )}
      >
        <div className="md:hidden">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSheetOpen(true)}
            className="flex items-center gap-2"
            aria-label="Open profile menu"
          >
            <Menu className="w-4 h-4" />
            Menu
          </Button>
        </div>
        <div className="flex-1 min-h-0">{children}</div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Profile menu</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto pt-4">
            <ProfileSidebarNavContent onLinkClick={() => setSheetOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
