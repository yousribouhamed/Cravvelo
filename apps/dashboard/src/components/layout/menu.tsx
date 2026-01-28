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
import { useSidebarItems } from "@/src/hooks/use-sidebar-items";
import { getValueFromUrl } from "@/src/lib/utils";
import InstalledAppsBox from "@/src/modules/apps/components/installed-apps-box";
import { useLocale } from "next-intl";

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
  const locale = useLocale();
  const isRTL = locale === "ar";
  const handleClick = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "w-full flex items-center text-sm relative hover:!bg-transparent !text-black dark:!text-white gap-x-2 hover:bg-none",
        isRTL ? "justify-end pr-4" : "justify-start pl-4"
      )}
      onClick={handleClick}
    >
      {isSelected && (
        <div className={cn(
          "w-[10px] h-[10px] rounded-full z-[20] absolute bg-gray-800 dark:bg-white border-2 border-gray-200 dark:border-gray-600",
          isRTL ? "-right-[3px]" : "-left-[3px]"
        )} />
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
  const locale = useLocale();
  const SIDE_BAR_ITEMS = useSidebarItems();
  const isRTL = locale === "ar";

  const pathSegments = useMemo(() => {
    return {
      firstSegment: getValueFromUrl(path, 1),
      secondSegment: getValueFromUrl(path, 2),
    };
  }, [path]);

  const [openAccordionItems, setOpenAccordionItems] = React.useState<string[]>(
    []
  );

  const activeAccordionValues = useMemo(() => {
    if (!SIDE_BAR_ITEMS) return [];

    return SIDE_BAR_ITEMS.filter((item) => {
      if (!item.subitems || item.subitems.length === 0) return false;
      return item.subitems.some(
        (subItem) =>
          path === subItem.slug ||
          subItem.slug.includes(pathSegments.secondSegment)
      );
    }).map((item) => item.title);
  }, [SIDE_BAR_ITEMS, path, pathSegments.secondSegment]);

  React.useEffect(() => {
    if (activeAccordionValues.length > 0) {
      setOpenAccordionItems((prev) => {
        //@ts-expect-error this is a type error
        const newItems = [...new Set([...prev, ...activeAccordionValues])];
        return newItems;
      });
    }
  }, [activeAccordionValues]);

  const isItemActive = useCallback(
    (item: any) => {
      return (
        (item.slug.includes(pathSegments.firstSegment) && path !== "/") ||
        path === item.slug
      );
    },
    [path, pathSegments.firstSegment]
  );

  const isSubItemActive = useCallback(
    (subItem: any) => {
      return (
        path === subItem.slug ||
        subItem.slug.includes(pathSegments.secondSegment)
      );
    },
    [path, pathSegments.secondSegment]
  );

  const handleAccordionValueChange = useCallback((value: string[]) => {
    setOpenAccordionItems(value);
  }, []);

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
                      "w-full flex items-center qatar-semibold text-md gap-x-2 hover:bg-black/5 dark:hover:bg-white/5 !text-black dark:!text-white",
                      isRTL ? "justify-end" : "justify-start",
                      {
                        "bg-black/5 dark:bg-white/5": isActive,
                      }
                    )}
                    onClick={handleDirectLinkClick}
                  >
                    {isRTL ? (
                      <>
                        {item.title}
                        <item.icon
                          className="w-5 h-5 !text-black dark:!text-white"
                          aria-hidden="true"
                        />
                      </>
                    ) : (
                      <>
                        <item.icon
                          className="w-5 h-5 !text-black dark:!text-white"
                          aria-hidden="true"
                        />
                        {item.title}
                      </>
                    )}
                  </Link>
                )}

                {hasSubitems && (
                  <>
                    <AccordionTrigger
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "w-full flex items-center qatar-semibold group text-sm gap-x-2 hover:bg-black/5 dark:hover:bg-white/5 !text-black dark:!text-white",
                        isRTL ? "justify-end" : "justify-start",
                        {
                          "bg-black/5 dark:bg-white/5": isActive,
                        }
                      )}
                    >
                      {isRTL ? (
                        <>
                          {item.title}
                          <item.icon
                            className="w-5 h-5 !text-black dark:!text-white"
                            strokeWidth={3}
                            aria-hidden="true"
                          />
                        </>
                      ) : (
                        <>
                          <item.icon
                            className="w-5 h-5 !text-black dark:!text-white"
                            strokeWidth={3}
                            aria-hidden="true"
                          />
                          {item.title}
                        </>
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className={cn(
                        "flex relative flex-col space-y-1",
                        isRTL ? "pr-4" : "pl-4"
                      )}>
                        {item.subitems.map((subItem, subIndex) => (
                          <MobileLink
                            isSelected={isSubItemActive(subItem)}
                            key={`${subItem.title}-${subIndex}`}
                            href={subItem.slug}
                            segment={String(segment)}
                            setIsOpen={setIsOpen}
                            disabled={false}
                          >
                            {subItem.title}
                          </MobileLink>
                        ))}
                        <div className={cn(
                          "absolute top-0 bottom-4 w-0.5 h-[80%] bg-gray-300 dark:bg-white/60",
                          isRTL ? "right-5" : "left-5"
                        )} />
                      </div>
                    </AccordionContent>
                  </>
                )}
              </AccordionItem>
            );
          })}
        </Accordion>

        <InstalledAppsBox />
      </div>
    </ScrollArea>
  );
};

export default SideBarMenu;
