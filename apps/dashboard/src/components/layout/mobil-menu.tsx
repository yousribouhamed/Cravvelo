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
import React from "react";
import { buttonVariants } from "@ui/components/ui/button";

import { ScrollArea } from "@ui/components/ui/scroll-area";
import { cn } from "@ui/lib/utils";
import Link from "next/link";

import { SIDE_BAR_ITEMS_EN, SIDE_BAR_ITEMS_AR } from "@cravvelo/i18n";
import { getValueFromUrl } from "@/src/lib/utils";

interface MobileLinkProps extends React.PropsWithChildren {
  href: string;
  disabled?: boolean;
  segment: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSelected: boolean;
  lang: string;
}

function MobileLink({
  children,
  href,
  setIsOpen,
  isSelected,
  lang,
}: MobileLinkProps) {
  const isLtr = lang === "en" ? true : false;
  return (
    <Link
      href={`${href}`}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        `w-full flex items-center ${
          isLtr ? "justify-start pl-[29px] " : "justify-end pr-4 "
        }  text-sm relative  hover:!bg-transparent  !text-white gap-x-2 hover:bg-none`
      )}
      onClick={() => setIsOpen(false)}
    >
      {isSelected && (
        <div
          className={`w-[15px] h-[15px] rounded-[50%] z-[20] absolute   bg-white ${
            isLtr ? "left-[12px]" : "-right-1"
          }`}
        />
      )}
      {children}
    </Link>
  );
}

interface MobilManueProps {
  lang: string;
}

const SideBarMenu: FC<MobilManueProps> = ({ lang }) => {
  const segment = useSelectedLayoutSegment();
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const path = usePathname();

  const SIDE_BAR_ITEMS = lang === "en" ? SIDE_BAR_ITEMS_EN : SIDE_BAR_ITEMS_AR;

  return (
    <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 ">
      <div className="w-full">
        <Accordion type="multiple" className="w-full space-y-2">
          {SIDE_BAR_ITEMS?.map((item, index) => (
            <AccordionItem value={item.title} key={index}>
              {item.subitems?.length === 0 && (
                <Link
                  href={item.slug}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    `w-full flex items-center ${
                      lang === "en" ? "justify-start" : "justify-end"
                    } qatar-semibold text-md  gap-x-2 hover:bg-primary !text-white`,
                    {
                      "text-white bg-[#A44600] hover:bg-[#A44600]":
                        (item.slug.includes(getValueFromUrl(path, 1)) &&
                          path !== "/") ||
                        path === item.slug,
                    }
                  )}
                >
                  {lang === "en" ? (
                    <>
                      <item.icon
                        className={`w-5 h-5 text-white`}
                        strokeWidth={3}
                      />
                      {item.title}
                    </>
                  ) : (
                    <>
                      {item.title}
                      <item.icon
                        className={`w-5 h-5 text-white`}
                        strokeWidth={3}
                      />
                    </>
                  )}
                </Link>
              )}

              {item.subitems?.length > 0 && (
                <AccordionTrigger
                  onClick={() => {
                    if (item.subitems?.length < 0) {
                      router.push(item.slug);
                    }
                  }}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    `w-full flex items-center ${
                      lang === "en" ? "justify-start" : "justify-end"
                    } qatar-semibold group text-md  gap-x-2 hover:bg-primary !text-white `,
                    {
                      "text-white bg-[#A44600] hover:bg-[#A44600]":
                        (item.slug.includes(getValueFromUrl(path, 1)) &&
                          path !== "/") ||
                        path === item.slug,
                    }
                  )}
                >
                  {lang === "en" ? (
                    <>
                      <item.icon
                        className={`w-5 h-5 text-white`}
                        strokeWidth={3}
                      />
                      {item.title}
                    </>
                  ) : (
                    <>
                      {item.title}
                      <item.icon
                        className={`w-5 h-5 text-white`}
                        strokeWidth={3}
                      />
                    </>
                  )}
                </AccordionTrigger>
              )}
              {item.subitems?.length > 0 && (
                <AccordionContent>
                  <div
                    className={` flex relative flex-col space-y-1  ${
                      lang === "an" ? "pl-4" : "pr-4 "
                    }`}
                  >
                    {item.subitems?.map((subItem, index) => (
                      <MobileLink
                        lang={lang}
                        isSelected={
                          path === subItem.slug ||
                          subItem.slug.includes(getValueFromUrl(path, 2))
                        }
                        key={index}
                        href={subItem.slug}
                        segment={String(segment)}
                        setIsOpen={setIsOpen}
                        disabled={!(path === subItem.slug)}
                      >
                        {subItem.title}
                      </MobileLink>
                    ))}
                    <div
                      className={`absolute top-0 bottom-4 w-0.5 h-[80%] bg-white ${
                        lang === "en" ? "left-5" : "right-5"
                      }`}
                    />
                  </div>
                </AccordionContent>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </ScrollArea>
  );
};

export default SideBarMenu;
