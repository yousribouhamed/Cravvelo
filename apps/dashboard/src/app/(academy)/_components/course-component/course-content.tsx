"use client";

import type { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/components/accordion";
import { Globe, Video } from "lucide-react";
import { Info } from "lucide-react";
import { Chapter } from "database";
import { Module } from "@/src/types";

interface CourseContentProps {
  chapters: Chapter[];
}

function formatDuration(durationSeconds: number): string {
  const minutes: number = Math.floor(durationSeconds / 60);
  const seconds: number = durationSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

const CourseContent: FC<CourseContentProps> = ({ chapters }) => {
  return (
    <>
      <div className="w-full min-h-[200px] h-fit flex flex-col rounded-xl">
        <div className="w-full h-[100px] flex items-center justify-start gap-x-4">
          <h3 className="text-xl font-bold">محتوى الدورة</h3>
        </div>
        <div className="w-full min-h-[200px] h-fit flex flex-col  gap-y-4 rounded-xl  ">
          {Array.isArray(chapters) &&
            chapters?.map((item, index) => {
              const modules = JSON.parse(item?.modules as string) as Module[];
              return (
                <div
                  key={item.id + index}
                  className="w-full min-h-[50px] h-fit bg-white rounded-xl p-4"
                >
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger asChild>
                        <div className="w-full h-[50px]  flex flex-col items-start justify-center  cursor-pointer ">
                          <p className="text-lg font-bold text-black">
                            {item.title}
                          </p>
                          <span className="text-sm text-gray-500">
                            {modules?.length} مواد
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent
                        asChild
                        className="w-full min-h-[100px] h-fit p-4 flex flex-col items-start justify-start gap-y-4 "
                      >
                        {Array.isArray(modules) &&
                          modules?.map((subitem) => {
                            return (
                              <div
                                key={subitem.title + index}
                                className="w-full h-[70px] flex items-center justify-start gap-x-4 cursor-pointer hover:bg-gray-100 transition-all duration-300 ease-in-out"
                              >
                                {/* this is the first container */}
                                <div className="w-[100px] h-full flex items-center justify-start gap-x-4">
                                  <div className="w-[40px] h-[40px] rounded-[50%] flex items-center justify-center bg-gray-300">
                                    <Video className="w-5 h-5 text-black" />
                                  </div>
                                  <Globe className="w-4 h-4" />
                                </div>

                                {/* this is the second container */}
                                <div className="w-full h-full flex flex-col items-start justify-center ">
                                  <p className="text-sm text-black ">
                                    {subitem.title}
                                  </p>
                                  <span className="text-gray-500 text-xs">
                                    {formatDuration(subitem.length)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default CourseContent;
