"use client";

import type { FC } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/components/ui/accordion";
import { Menu } from "lucide-react";
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
import { SIDE_BAR_ITEMS } from "../../constants/side-bar-items";
import { getValueFromUrl } from "@/src/lib/utils";

interface MobileLinkProps extends React.PropsWithChildren {
  href: string;
  disabled?: boolean;
  segment: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSelected: boolean;
}

function MobileLink({
  children,
  href,
  disabled,
  segment,
  setIsOpen,
  isSelected,
}: MobileLinkProps) {
  return (
    <Link
      href={`${href}`}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "w-full flex items-center justify-end text-sm pr-4 relative  hover:!bg-transparent  !text-white gap-x-2 hover:bg-none"
      )}
      onClick={() => setIsOpen(false)}
    >
      {isSelected && (
        <div className="w-[15px] h-[15px] rounded-[50%] z-[20] absolute -right-1  bg-white" />
      )}
      {children}
    </Link>
  );
}

interface MobilManueAbdullahProps {}

const SideBarMenu: FC = ({}) => {
  const segment = useSelectedLayoutSegment();
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const path = usePathname();

  console.log("we get somevalue from the url");
  console.log(getValueFromUrl(path, 1));

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
                    "w-full flex items-center justify-end qatar-semibold text-md  gap-x-2 hover:bg-primary !text-white",
                    {
                      "text-white bg-[#A44600] hover:bg-[#A44600]":
                        path === item.slug ||
                        (path.includes(getValueFromUrl(item.slug, 1)) &&
                          item.slug !== "/"),
                    }
                  )}
                >
                  {item.title}
                  <item.icon className={`w-4 h-4 `} />
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
                    "w-full flex items-center justify-end qatar-semibold group text-md  gap-x-2 hover:bg-primary !text-white ",
                    {
                      "text-white bg-[#A44600] hover:bg-[#A44600]":
                        path === item.slug ||
                        (item.slug.includes(getValueFromUrl(path, 1)) &&
                          item.slug !== "/"),
                    }
                  )}
                >
                  {item.title}
                  <item.icon className={`w-4 h-4 text-white`} />
                </AccordionTrigger>
              )}
              {item.subitems?.length > 0 && (
                <AccordionContent>
                  <div className="flex relative flex-col pr-4 space-y-1">
                    {item.subitems?.map((subItem, index) => (
                      <MobileLink
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
                    <div className="absolute top-0 bottom-4 w-0.5 h-[80%] bg-white right-5" />
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
