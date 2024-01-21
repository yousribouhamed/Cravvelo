import type { FC } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@ui/components/ui/sheet";
import { Button } from "@ui/components/ui/button";
import { Menu } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/components/ui/accordion";

const links = [
  {
    name: "الرئيسية",
    slug: "/",
  },
  {
    name: "الخدمات",
    slug: "/",
  },
  {
    name: "الاسعار",
    slug: "/",
  },
  {
    name: "جدارة +",
    slug: "/",
  },
];

export const MobilNavBar: FC = ({}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="border-[#FFB700] border-2  bg-[#FFEEC5]"
        >
          <Menu className="text-black w-8 h-8" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full bg-[#61AFA0] " side={"left"}>
        <SheetHeader>
          <SheetTitle className="text-white font-bold text-3xl">
            جدارة
          </SheetTitle>
        </SheetHeader>
        <Accordion className="mt-12" type="single" collapsible>
          {links.map((item) => {
            return (
              <AccordionItem
                key={item.name}
                className="border-b my-4"
                value="item-1"
              >
                <AccordionTrigger className="w-full  text-white h-[50px] flex justify-start text-xl font-bold ">
                  {item.name}
                </AccordionTrigger>
              </AccordionItem>
            );
          })}
        </Accordion>
      </SheetContent>
    </Sheet>
  );
};
