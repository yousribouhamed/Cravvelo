"use client";

import type { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/components/ui/accordion";
import { Card } from "@ui/lib/tremor";
import { CardContent } from "@ui/components/ui/card";
import { Button, buttonVariants } from "@ui/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { getValueFromUrl } from "../lib/utils";
import Link from "next/link";
import { cn } from "@ui/lib/utils";
import { Module } from "../types";

interface ChapterProps {
  title: string;
  chapterID: string;
  modules: Module[];
}
const Chapter: FC<ChapterProps> = ({ chapterID, title, modules }) => {
  const path = usePathname();

  // const router = useRouter();

  return (
    <Card className="p-0">
      <CardContent className="h-fit w-full min-h-[70px] bg-[#F2F4F4] rounded-lg flex items-center  py-0  border relative">
        <Accordion type="single" className="w-full " collapsible>
          <AccordionItem value="item-1" className="p-0 w-full">
            <AccordionTrigger asChild>
              <div className="w-full h-[70px]  flex items-center my-auto cursor-pointer py-4">
                <div className="w-full  h-full flex items-center justify-start  gap-x-4 ">
                  <Button className="cursor-grab" variant="ghost" size="icon">
                    <svg
                      width="31"
                      height="30"
                      viewBox="0 0 21 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVG">
                        <path
                          id="Vector"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M6.51807 4.27791C6.51807 3.59749 7.06965 3.0459 7.75008 3.0459C8.43051 3.0459 8.9821 3.59749 8.9821 4.27791C8.9821 4.95834 8.43051 5.50993 7.75008 5.50993C7.06965 5.50993 6.51807 4.95834 6.51807 4.27791ZM6.51807 9.20597C6.51807 8.52554 7.06965 7.97396 7.75008 7.97396C8.43051 7.97396 8.9821 8.52554 8.9821 9.20597C8.9821 9.8864 8.43051 10.438 7.75008 10.438C7.06965 10.438 6.51807 9.8864 6.51807 9.20597ZM6.51807 14.134C6.51807 13.4536 7.06965 12.902 7.75008 12.902C8.43051 12.902 8.9821 13.4536 8.9821 14.134C8.9821 14.8145 8.43051 15.366 7.75008 15.366C7.06965 15.366 6.51807 14.8145 6.51807 14.134Z"
                          fill="#2D2D2D"
                        />
                        <path
                          id="Vector_2"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M11.939 4.27791C11.939 3.59749 12.4905 3.0459 13.171 3.0459C13.8514 3.0459 14.403 3.59749 14.403 4.27791C14.403 4.95834 13.8514 5.50993 13.171 5.50993C12.4905 5.50993 11.939 4.95834 11.939 4.27791ZM11.939 9.20597C11.939 8.52554 12.4905 7.97396 13.171 7.97396C13.8514 7.97396 14.403 8.52554 14.403 9.20597C14.403 9.8864 13.8514 10.438 13.171 10.438C12.4905 10.438 11.939 9.8864 11.939 9.20597ZM11.939 14.134C11.939 13.4536 12.4905 12.902 13.171 12.902C13.8514 12.902 14.403 13.4536 14.403 14.134C14.403 14.8145 13.8514 15.366 13.171 15.366C12.4905 15.366 11.939 14.8145 11.939 14.134Z"
                          fill="#2D2D2D"
                        />
                      </g>
                    </svg>
                  </Button>
                  <div className=" flex flex-col items-start justify-center gap-y-1">
                    <h2 className="text-sm font-bold">{title}</h2>
                    <span className="text-xs text-gray-500">
                      مواد{modules.length}
                    </span>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="h-[300px] w-full">
              <div>
                {modules?.map((item) => {
                  return (
                    <div className="w-full h-[50px] flex items-center bg-[#dbdede] ">
                      <span className="font-bold text-xl">{item.title}</span>
                    </div>
                  );
                })}
              </div>
              <AddToChapter path={path} chapterID={chapterID} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default Chapter;

const AddToChapter = ({
  path,
  chapterID,
}: {
  path: string;
  chapterID: string;
}) => {
  const courseId = getValueFromUrl(path, 2);

  const maps = [
    {
      name: "فيديو",
      url: `/courses/${courseId}/chapters/${chapterID}/add-vedio`,
      icon: () => (
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5106 7.82073L13.612 4.71934C13.6809 4.65051 13.7687 4.60364 13.8643 4.58467C13.9598 4.56569 14.0588 4.57544 14.1488 4.61271C14.2388 4.64997 14.3157 4.71307 14.3699 4.79403C14.4241 4.87499 14.453 4.97019 14.4531 5.06759V12.5451C14.453 12.6425 14.4241 12.7377 14.3699 12.8187C14.3157 12.8996 14.2388 12.9627 14.1488 13C14.0588 13.0372 13.9598 13.047 13.8643 13.028C13.7687 13.009 13.6809 12.9622 13.612 12.8933L10.5106 9.79196M3.11855 13.2416H9.03222C9.42432 13.2416 9.80036 13.0858 10.0776 12.8086C10.3549 12.5313 10.5106 12.1553 10.5106 11.7632V5.84951C10.5106 5.45741 10.3549 5.08137 10.0776 4.80411C9.80036 4.52686 9.42432 4.37109 9.03222 4.37109H3.11855C2.72645 4.37109 2.35041 4.52686 2.07316 4.80411C1.7959 5.08137 1.64014 5.45741 1.64014 5.84951V11.7632C1.64014 12.1553 1.7959 12.5313 2.07316 12.8086C2.35041 13.0858 2.72645 13.2416 3.11855 13.2416Z"
            stroke="black"
            stroke-width="0.985611"
            stroke-linecap="round"
          />
        </svg>
      ),
    },
    {
      name: "ملف PDF",
      url: `/courses/${courseId}/chapters/${chapterID}/add-pdf`,
      icon: () => (
        <svg
          width="11"
          height="15"
          viewBox="0 0 11 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.4088 9.28431V7.55949C10.4088 6.97133 10.1752 6.40727 9.75932 5.99139C9.34344 5.5755 8.77937 5.34186 8.19122 5.34186H7.20561C7.00956 5.34186 6.82154 5.26398 6.68291 5.12535C6.54428 4.98672 6.4664 4.7987 6.4664 4.60265V3.61704C6.4664 3.02889 6.23276 2.46483 5.81688 2.04894C5.40099 1.63306 4.83693 1.39941 4.24878 1.39941H3.01676M3.01676 9.77711H7.94482M3.01676 11.7483H5.48079M4.49518 1.39941H1.29194C0.8839 1.39941 0.552734 1.73058 0.552734 2.13862V13.4732C0.552734 13.8812 0.8839 14.2124 1.29194 14.2124H9.66964C10.0777 14.2124 10.4088 13.8812 10.4088 13.4732V7.31308C10.4088 5.74468 9.7858 4.24052 8.67678 3.13149C7.56775 2.02246 6.06358 1.39941 4.49518 1.39941Z"
            stroke="black"
            stroke-width="0.985611"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
    {
      name: " صوت",
      url: `/courses/${courseId}/chapters/${chapterID}/add-vioce`,
      icon: () => (
        <svg
          width="17"
          height="17"
          viewBox="0 0 17 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_154_2293)">
            <path
              d="M8.54694 13.2418C9.59254 13.2418 10.5953 12.8264 11.3347 12.087C12.074 11.3477 12.4894 10.3449 12.4894 9.29931V8.3137M8.54694 13.2418C7.50134 13.2418 6.49856 12.8264 5.75921 12.087C5.01986 11.3477 4.60449 10.3449 4.60449 9.29931V8.3137M8.54694 13.2418V15.7058M6.08291 15.7058H11.011M8.54694 11.2705C8.02414 11.2705 7.52275 11.0629 7.15307 10.6932C6.7834 10.3235 6.57572 9.82211 6.57572 9.29931V3.87845C6.57572 3.35565 6.7834 2.85426 7.15307 2.48458C7.52275 2.11491 8.02414 1.90723 8.54694 1.90723C9.06974 1.90723 9.57113 2.11491 9.9408 2.48458C10.3105 2.85426 10.5182 3.35565 10.5182 3.87845V9.29931C10.5182 9.82211 10.3105 10.3235 9.9408 10.6932C9.57113 11.0629 9.06974 11.2705 8.54694 11.2705Z"
              stroke="black"
              stroke-width="0.985611"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_154_2293">
              <rect
                width="15.7698"
                height="15.7698"
                fill="white"
                transform="translate(0.662109 0.921875)"
              />
            </clipPath>
          </defs>
        </svg>
      ),
    },
    {
      name: "فصل افتراضي",
      url: `/courses/${courseId}/chapters/${chapterID}/add-vioce`,
      icon: () => (
        <svg
          width="17"
          height="17"
          viewBox="0 0 17 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.32438 2.89258V4.371M12.2237 2.89258V4.371M2.86035 13.2415V5.84941C2.86035 5.45731 3.01611 5.08127 3.29337 4.80401C3.57063 4.52676 3.94667 4.371 4.33877 4.371H13.2093C13.6014 4.371 13.9774 4.52676 14.2547 4.80401C14.5319 5.08127 14.6877 5.45731 14.6877 5.84941V13.2415M2.86035 13.2415C2.86035 13.6336 3.01611 14.0096 3.29337 14.2869C3.57063 14.5642 3.94667 14.7199 4.33877 14.7199H13.2093C13.6014 14.7199 13.9774 14.5642 14.2547 14.2869C14.5319 14.0096 14.6877 13.6336 14.6877 13.2415M2.86035 13.2415V8.31344C2.86035 7.92134 3.01611 7.5453 3.29337 7.26804C3.57063 6.99079 3.94667 6.83502 4.33877 6.83502H13.2093C13.6014 6.83502 13.9774 6.99079 14.2547 7.26804C14.5319 7.5453 14.6877 7.92134 14.6877 8.31344V13.2415"
            stroke="black"
            stroke-width="0.985611"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
    {
      name: " نص",
      url: `/courses/${courseId}/chapters/${chapterID}/add-text`,
      icon: () => (
        <svg
          width="17"
          height="17"
          viewBox="0 0 17 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.15918 5.35645H14.0009M3.15918 8.80609H14.0009M8.58004 12.2557H14.0009"
            stroke="black"
            stroke-width="0.985611"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full h-[200px] border-2 mt-4 border-dashed p-4 border-gray-950 bg-white rounded-lg mx-auto">
      <h3 className="text-start font-bold text-xl">
        أضف مواد تعليمية جديدة إلى القسم
      </h3>
      <div className="w-full h-[50px] flex items-center justify-start gap-x-6">
        {maps.map((item) => {
          return (
            <Link
              key={item.name}
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "bg-white border flex justify-center gap-x-2"
              )}
              href={item.url}
            >
              <item.icon />
              {item.name}
            </Link>
          );
        })}
      </div>

      <h3 className="text-start font-bold text-xl">أضف تدريبات واختبارات</h3>
      <div className="w-full h-[50px] flex items-center justify-start gap-x-6">
        <Button
          className="hover:bg-gray-900 hover:text-white cursor-pointer"
          variant="secondary"
          size="lg"
        >
          اختبار
        </Button>
        <Button
          className="hover:bg-gray-900 hover:text-white cursor-pointer"
          variant="secondary"
          size="lg"
        >
          واجب
        </Button>
        <Button
          className="hover:bg-gray-900 hover:text-white cursor-pointer"
          variant="secondary"
          size="lg"
        >
          استبيان
        </Button>
      </div>
    </div>
  );
};
