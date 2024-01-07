"use client";

import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@ui/components/ui/command";
import React from "react";
import { cn } from "@ui/lib/utils";
import { isMacOs } from "../lib/utils";
import { Input } from "@ui/components/ui/input";
import { Button, buttonVariants } from "@ui/components/button";
import { Icons } from "./Icons";

export function SearcInput() {
  const [isVisible, setIsVisible] = React.useState<boolean>(false);

  return (
    <>
      <div
        className={cn(
          buttonVariants({ variant: "ghost" }),
          ` relative flex gap-x-4 h-7 w-[300px] bg-white p-0 border  xl:justify-start xl:h-10 xl:px-3 xl:py-2 `
        )}
      >
        <Icons.search className="w-4 h-4 text-[#43766C]" />
        <span className="hidden xl:inline-flex text-muted-foreground text-[#8A8A8A]">
          ابحث ...
        </span>
        <span className="sr-only">ابحث عن أيَّ شيء داخل الأكاديمية</span>
      </div>
      <div className="hidden ">
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList className={`${isVisible ? "" : "hidden"}`}>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <Smile className="mr-2 h-4 w-4" />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem>
                <Calculator className="mr-2 h-4 w-4" />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </>
  );
}
