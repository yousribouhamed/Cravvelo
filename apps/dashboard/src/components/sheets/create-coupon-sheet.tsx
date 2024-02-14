"use client";

import { Button } from "@ui/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@ui/components/ui/s-sheet";
import * as React from "react";
import type { FC } from "react";
import { cn } from "@ui/lib/utils";

const CreateCouponSheet: FC = ({}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <SheetTrigger asChild>
        <Button className="rounded-xl ">اصنع كوبون</Button>
      </SheetTrigger>
      <SheetContent
        className={cn(
          `pb-12  bg-white shadow-lg h-full  max-w-xl  ${
            isOpen ? "block" : "hidden"
          }`
        )}
      >
        <div className="space-y-4 py-2   ">
          <div className="px-3 pb-2 pt-6"></div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateCouponSheet;
