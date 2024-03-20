"use client";

import type { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/components/accordion";
import { Course, Chapter } from "database";
import { Module } from "@/src/types";
import { useCoursePlayerStore } from "../../../global-state/course-player-store";
import { ScrollArea } from "@ui/components/ui/scroll-area";

const formatVideoSize = (sizeInBytes) => {
  const hours = Math.floor(sizeInBytes / (60 * 60 * 1000));
  const minutes = Math.floor((sizeInBytes % (60 * 60 * 1000)) / (60 * 1000));
  return `${hours}:${minutes}`;
};

interface VideoChainProps {
  chapters: Chapter[];
}

const VideoChain: FC<VideoChainProps> = ({ chapters }) => {
  const setCurrentModule = useCoursePlayerStore(
    (state) => state.actions.setCurrentModule
  );
  return (
    <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 w-full ">
      <div dir="rtl" className="w-full min-h-full h-fit  ">
        <div className="w-full min-h-[50px] h-fit rounded-xl   space-y-4">
          {Array.isArray(chapters) &&
            chapters?.map((item, index) => {
              const modules = JSON.parse(item?.modules as string) as Module[];
              return (
                <div
                  key={item.id + index}
                  className="w-full min-h-[50px] h-fit   "
                >
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger asChild>
                        <div className="w-full p-4 h-[50px]  flex flex-col items-start justify-center  cursor-pointer ">
                          <p className="text-lg font-bold text-black">
                            {item?.title}
                          </p>
                          <span className="text-sm text-gray-500">
                            {modules?.length} مواد
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent
                        asChild
                        className="w-full min-h-[100px] h-fit flex flex-col items-start justify-start gap-y-4 py-4 "
                      >
                        {Array.isArray(modules) &&
                          modules?.map((subitem, index) => {
                            return (
                              <button
                                key={subitem?.title + index}
                                className="w-full h-[70px] flex items-center justify-start gap-x-4 cursor-pointer hover:bg-gray-100 transition-all duration-300 ease-in-out "
                                onClick={() => {
                                  console.log("this is subitem");
                                  console.log(
                                    "this is the button cliked and it is working as it should"
                                  );
                                  console.log(subitem);
                                  setCurrentModule(subitem);
                                }}
                              >
                                {/* this is the second container */}
                                <div className="w-full  h-full flex flex-col items-start justify-center gap-y-1 p-4 ">
                                  <div className="flex items-center justify-start gap-x-2 mt-2">
                                    <svg
                                      width="23"
                                      height="20"
                                      viewBox="0 0 33 30"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M11.6864 29.9711C11.2223 29.9711 10.8335 29.8138 10.5201 29.4993C10.2055 29.1859 10.0483 28.7971 10.0483 28.333V26.6949H3.4959C2.59495 26.6949 1.82395 26.3744 1.18291 25.7333C0.540778 25.0912 0.219711 24.3196 0.219711 23.4187V3.76154C0.219711 2.86059 0.540778 2.08905 1.18291 1.44691C1.82395 0.805872 2.59495 0.485352 3.4959 0.485352H29.7054C30.6064 0.485352 31.3779 0.805872 32.0201 1.44691C32.6611 2.08905 32.9816 2.86059 32.9816 3.76154V23.4187C32.9816 24.3196 32.6611 25.0912 32.0201 25.7333C31.3779 26.3744 30.6064 26.6949 29.7054 26.6949H23.153V28.333C23.153 28.7971 22.9963 29.1859 22.6829 29.4993C22.3684 29.8138 21.9791 29.9711 21.5149 29.9711H11.6864ZM3.4959 23.4187H29.7054V3.76154H3.4959V23.4187Z"
                                        fill="#1F2029"
                                      />
                                      <path
                                        d="M12.5677 17.5629V8.79911C12.5677 8.14387 12.8543 7.6661 13.4277 7.36578C14.001 7.06546 14.5607 7.09276 15.1067 7.44768L21.9048 11.7886C22.4235 12.089 22.6829 12.5531 22.6829 13.181C22.6829 13.809 22.4235 14.2731 21.9048 14.5734L15.1067 18.9144C14.5607 19.2693 14.001 19.2966 13.4277 18.9963C12.8543 18.6959 12.5677 18.2182 12.5677 17.5629Z"
                                        fill="#1F2029"
                                      />
                                    </svg>
                                    <p className="text-sm text-black ">
                                      {index}-{subitem?.title}
                                    </p>
                                  </div>

                                  <span className="text-black text-sm my-4">
                                    {formatVideoSize(subitem.length)}
                                  </span>
                                </div>
                              </button>
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
    </ScrollArea>
  );
};

export default VideoChain;
