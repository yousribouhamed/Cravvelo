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
import { Button } from "@ui/components/ui/button";
import { usePathname } from "next/navigation";
import { Module } from "../../../types";
import { ChevronDown } from "lucide-react";
import React from "react";
import { AddToChapter } from "./AddToChapter";

interface ChapterProps {
  title: string;
  chapterID: string;
  modules: Module[];
}
const Chapter: FC<ChapterProps> = ({ chapterID, title, modules }) => {
  const path = usePathname();

  // const router = useRouter();

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Card className="p-0  ">
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
                <div className="w-[100px] h-full flex items-center justify-end">
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200  " />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="min-h-[200px] h-fit space-y-3 w-full">
              <div>
                {modules?.map((item) => {
                  return (
                    <div
                      key={item.orderNumber + item.title}
                      className="w-full  h-full flex items-center justify-start  gap-x-2 mr-4   my-2 "
                    >
                      <Button
                        className="cursor-grab"
                        variant="ghost"
                        size="icon"
                      >
                        <svg
                          width="21"
                          height="20"
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
                        <h2 className="text-sm ">{item.title}</h2>
                      </div>
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
