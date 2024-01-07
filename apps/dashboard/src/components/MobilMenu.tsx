"use client";

import type { FC } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/components/ui/accordion";
import { Menu } from "lucide-react";
import { useSelectedLayoutSegment } from "next/navigation";
import React from "react";
import { Button, buttonVariants } from "@ui/components/ui/button";

import { ScrollArea } from "@ui/components/ui/scroll-area";
import { cn } from "@ui/lib/utils";
import Link from "next/link";
import { SIDE_BAR_ITEMS } from "../constants/side-bar-items";

interface MobileLinkProps extends React.PropsWithChildren {
  href: string;
  disabled?: boolean;
  segment: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function MobileLink({
  children,
  href,
  disabled,
  segment,
  setIsOpen,
}: MobileLinkProps) {
  return (
    <Link
      href={`/collection/${href}`}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "w-full flex items-center justify-end text-lg pr-4  hover:!bg-transparent hover:!text-white text-white gap-x-2 hover:bg-none"
      )}
      onClick={() => setIsOpen(false)}
    >
      {children}
    </Link>
  );
}

interface MobilManueAbdullahProps {}

const SideBarMenu: FC = ({}) => {
  const segment = useSelectedLayoutSegment();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-4">
      <div className="w-full">
        <Accordion
          type="multiple"
          defaultValue={SIDE_BAR_ITEMS.map((item) => item.title)}
          className="w-full"
        >
          {SIDE_BAR_ITEMS?.map((item, index) => (
            <AccordionItem value={item.title} key={index}>
              <AccordionTrigger
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-full flex items-center justify-end qatar-semibold text-xl text-white gap-x-2 hover:!bg-transparent hover:!text-white "
                )}
              >
                {item.title}
                <item.icon className="w-5 h-5 text-white" />
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col pr-4 space-y-2">
                  {item.subitems?.map((subItem, index) => (
                    <MobileLink
                      key={index}
                      href={String(subItem.slug)}
                      segment={String(segment)}
                      setIsOpen={setIsOpen}
                      disabled={false}
                    >
                      {subItem.title}
                    </MobileLink>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </ScrollArea>
  );
};

export default SideBarMenu;
