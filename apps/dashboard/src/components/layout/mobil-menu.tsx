"use client";

import type { FC } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/components/ui/accordion";
import {
  usePathname,
  useRouter,
  useSelectedLayoutSegment,
} from "next/navigation";
import React, { useMemo, useCallback } from "react";
import { buttonVariants } from "@ui/components/ui/button";

import { ScrollArea } from "@ui/components/ui/scroll-area";
import { cn } from "@ui/lib/utils";
import Link from "next/link";
import { SIDE_BAR_ITEMS } from "../../constants/side-bar-items";
import { getValueFromUrl } from "@/src/lib/utils";

interface MobileLinkProps extends React.PropsWithChildren {
  href: string;
  disabled?: boolean;
  segment: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSelected: boolean;
}

const MobileLink: FC<MobileLinkProps> = ({
  children,
  href,
  setIsOpen,
  isSelected,
}) => {
  const handleClick = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "w-full flex items-center justify-end text-sm pr-4 relative hover:!bg-transparent !text-white gap-x-2 hover:bg-none"
      )}
      onClick={handleClick}
    >
      {isSelected && (
        <div className="w-[15px] h-[15px] rounded-[50%] z-[20] absolute -right-1 bg-white" />
      )}
      {children}
    </Link>
  );
};

interface SideBarMenuProps {
  onItemClick?: () => void;
}

const SideBarMenu: FC<SideBarMenuProps> = ({ onItemClick }) => {
  const segment = useSelectedLayoutSegment();
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const path = usePathname();

  // Memoize the path segments for better performance
  const pathSegments = useMemo(() => {
    return {
      firstSegment: getValueFromUrl(path, 1),
      secondSegment: getValueFromUrl(path, 2),
    };
  }, [path]);

  // State to manage which accordion items are open
  const [openAccordionItems, setOpenAccordionItems] = React.useState<string[]>(
    []
  );

  // Memoize the active accordion values - items that should be open based on current path
  const activeAccordionValues = useMemo(() => {
    if (!SIDE_BAR_ITEMS) return [];

    return SIDE_BAR_ITEMS.filter((item) => {
      if (!item.subitems || item.subitems.length === 0) return false;

      // Check if any subitem is active
      return item.subitems.some(
        (subItem) =>
          path === subItem.slug ||
          subItem.slug.includes(pathSegments.secondSegment)
      );
    }).map((item) => item.title);
  }, [SIDE_BAR_ITEMS, path, pathSegments.secondSegment]);

  // Update open accordion items when active values change
  React.useEffect(() => {
    if (activeAccordionValues.length > 0) {
      setOpenAccordionItems((prev) => {
        //@ts-expect-error this is a type error
        const newItems = [...new Set([...prev, ...activeAccordionValues])];
        return newItems;
      });
    }
  }, [activeAccordionValues]);

  // Helper function to check if an item is active
  const isItemActive = useCallback(
    (item: any) => {
      return (
        (item.slug.includes(pathSegments.firstSegment) && path !== "/") ||
        path === item.slug
      );
    },
    [path, pathSegments.firstSegment]
  );

  // Helper function to check if a subitem is active
  const isSubItemActive = useCallback(
    (subItem: any) => {
      return (
        path === subItem.slug ||
        subItem.slug.includes(pathSegments.secondSegment)
      );
    },
    [path, pathSegments.secondSegment]
  );

  // Handle accordion value change
  const handleAccordionValueChange = useCallback((value: string[]) => {
    setOpenAccordionItems(value);
  }, []);

  // Handle direct link click
  const handleDirectLinkClick = useCallback(() => {
    onItemClick?.();
  }, [onItemClick]);

  if (!SIDE_BAR_ITEMS || SIDE_BAR_ITEMS.length === 0) {
    return null;
  }

  return (
    <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
      <div className="w-full">
        <Accordion
          type="multiple"
          className="w-full space-y-2"
          value={openAccordionItems}
          onValueChange={handleAccordionValueChange}
        >
          {SIDE_BAR_ITEMS.map((item, index) => {
            const hasSubitems = item.subitems && item.subitems.length > 0;
            const isActive = isItemActive(item);

            return (
              <AccordionItem value={item.title} key={`${item.title}-${index}`}>
                {!hasSubitems && (
                  <Link
                    href={item.slug}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "w-full flex items-center justify-end qatar-semibold text-md gap-x-2 hover:bg-primary !text-white",
                      {
                        "text-white bg-[#A44600] hover:bg-[#A44600]": isActive,
                      }
                    )}
                    onClick={handleDirectLinkClick}
                  >
                    {item.title}
                    <item.icon
                      className="w-5 h-5 text-white"
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                  </Link>
                )}

                {hasSubitems && (
                  <>
                    <AccordionTrigger
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "w-full flex items-center justify-end qatar-semibold group text-md gap-x-2 hover:bg-primary !text-white",
                        {
                          "text-white bg-[#A44600] hover:bg-[#A44600]":
                            isActive,
                        }
                      )}
                    >
                      {item.title}
                      <item.icon
                        className="w-5 h-5 text-white"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex relative flex-col pr-4 space-y-1">
                        {item.subitems.map((subItem, subIndex) => (
                          <MobileLink
                            isSelected={isSubItemActive(subItem)}
                            key={`${subItem.title}-${subIndex}`}
                            href={subItem.slug}
                            segment={String(segment)}
                            setIsOpen={setIsOpen}
                            disabled={false} // Removed confusing disabled logic
                          >
                            {subItem.title}
                          </MobileLink>
                        ))}
                        <div className="absolute top-0 bottom-4 w-0.5 h-[80%] bg-white right-5" />
                      </div>
                    </AccordionContent>
                  </>
                )}
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </ScrollArea>
  );
};

export default SideBarMenu;
