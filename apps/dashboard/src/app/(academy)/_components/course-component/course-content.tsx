"use client";

import type { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/components/accordion";
import { Globe, Video } from "lucide-react";

interface CourseContentProps {}

const CourseContent: FC<CourseContentProps> = ({}) => {
  return (
    <div className="w-full min-h-[50px] h-fit bg-white rounded-xl p-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger asChild>
            <div className="w-full h-[50px]  flex flex-col items-start justify-center  cursor-pointer ">
              <p className="text-lg font-bold text-black">البداية</p>
              <span className="text-sm text-gray-500">4مواد</span>
            </div>
          </AccordionTrigger>
          <AccordionContent
            asChild
            className="w-full min-h-[100px] h-fit p-4 flex flex-col items-start justify-start gap-y-4 "
          >
            {/* this is the first  */}
            <div className="w-full h-[70px] flex items-center justify-start gap-x-4 cursor-pointer hover:bg-gray-100 transition-all duration-300 ease-in-out">
              {/* this is the first container */}
              <div className="w-[100px] h-full flex items-center justify-start gap-x-4">
                <div className="w-[40px] h-[40px] rounded-[50%] flex items-center justify-center bg-gray-300">
                  <Video className="w-5 h-5 text-black" />
                </div>
                <Globe className="w-4 h-4" />
              </div>

              {/* this is the second container */}
              <div className="w-full h-full flex flex-col items-start justify-center ">
                <p className="text-sm text-black ">نظرة عامة عن الدورة</p>
                <span className="text-gray-500 text-xs">3:09</span>
              </div>
            </div>

            {/* this is the second */}
            <div className="w-full h-[70px] flex items-center justify-start gap-x-4 cursor-pointer hover:bg-gray-100 transition-all duration-300 ease-in-out">
              {/* this is the first container */}
              <div className="w-[100px] h-full flex items-center justify-start gap-x-4">
                <div className="w-[40px] h-[40px] rounded-[50%] flex items-center justify-center bg-gray-300">
                  <Video className="w-5 h-5 text-black" />
                </div>
                <Globe className="w-4 h-4" />
              </div>

              {/* this is the second container */}
              <div className="w-full h-full flex flex-col items-start justify-center ">
                <p className="text-sm text-black ">نظرة عامة عن الدورة</p>
                <span className="text-gray-500 text-xs">3:09</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default CourseContent;
