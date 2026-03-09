"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import ProfileSidebar from "@/modules/profile/components/sidebar";
import { ProfileSidebarNavContent } from "@/modules/profile/components/sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function ProfileLayoutClient({
  children,
}: React.PropsWithChildren) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="w-full h-fit min-h-[400px] grid grid-cols-1 md:grid-cols-4 gap-4 py-8">
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-full">
        <ProfileSidebar />
      </aside>

      {/* Content: menu button (mobile only) + page content */}
      <div className="md:col-span-3 h-full min-w-0 flex flex-col gap-4">
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
