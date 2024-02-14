"use client";

import { Button } from "@ui/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@ui/components/ui/sheet";
import { Menu } from "lucide-react";
import * as React from "react";
import type { FC } from "react";
import { cn } from "@ui/lib/utils";
import SideBarMenu from "./mobil-menu";
import AddNew from "./models/add-new";

const MobildSideBard: FC = ({}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="rounded-2xl bg-white border text-black"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        className={cn(
          `pb-12  bg-primary h-full   ${isOpen ? "block" : "hidden"}`
        )}
      >
        <div className="space-y-4 py-2   ">
          <div className="px-3 pb-2 pt-6">
            <div className="w-full  h-[50px] relative ">
              <AddNew />
            </div>
            <div className="space-y-2 mt-5">
              <SideBarMenu />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobildSideBard;
