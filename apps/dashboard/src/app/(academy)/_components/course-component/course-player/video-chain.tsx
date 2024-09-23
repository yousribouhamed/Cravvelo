"use client";

import { type FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/components/accordion";
import { Chapter } from "database";
import { Module } from "@/src/types";
import { useCoursePlayerStore } from "../../../global-state/course-player-store";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { Check } from "lucide-react";

function formatDuration(durationSeconds: number): string {
  const minutes: number = Math.floor(durationSeconds / 60);
  const seconds: number = durationSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

interface VideoChainProps {
  chapters: Chapter[];
  currentEpisode: number;
  color: string;
}

const VideoChain: FC<VideoChainProps> = ({
  chapters,
  currentEpisode,
  color,
}) => {
  const setCurrentModule = useCoursePlayerStore(
    (state) => state.actions.setCurrentModule
  );

  const currentModule = useCoursePlayerStore(
    (state) => state.state.currentModule
  );

  let globalVideoIndex = 0;

  return (
    <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 w-full ">
      <div dir="rtl" className="w-full min-h-full h-fit">
        <div className="w-full min-h-[50px] h-fit rounded-xl space-y-4">
          {chapters?.map((chapter, chapterIndex) => {
            const modules = JSON.parse(chapter?.modules as string) as Module[];
            return (
              <div
                key={chapter.id + chapterIndex}
                className={` w-full min-h-[50px] h-fit   ${
                  chapterIndex % 2 === 0 ? "" : "bg-gray-500/5"
                } `}
              >
                <Accordion
                  type="single"
                  collapsible
                  defaultValue={`item-${chapterIndex}`}
                >
                  <AccordionItem value={`item-${chapterIndex}`}>
                    <AccordionTrigger asChild>
                      <div className="w-full p-4 h-[70px] border-b flex flex-col items-start justify-center cursor-pointer">
                        <p className="text-lg font-bold text-black">
                          {chapter?.title}
                        </p>
                        <span className="text-sm text-gray-500">
                          {modules?.length} مواد
                        </span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent
                      asChild
                      className="w-full min-h-[100px] h-fit flex flex-col items-start justify-start gap-y-4 py-4"
                    >
                      {modules?.map((module, moduleIndex) => {
                        const videoIndex = globalVideoIndex++;
                        const isActive =
                          currentModule?.fileUrl === module?.fileUrl ||
                          (currentModule?.fileUrl === undefined &&
                            videoIndex === 0);

                        const getColor = () => {
                          if (videoIndex < currentEpisode) {
                            return color;
                          } else if (videoIndex === currentEpisode) {
                            return "bg-green-500";
                          }
                          return "bg-white";
                        };

                        return (
                          <div
                            key={module?.title + moduleIndex}
                            className="w-full h-[70px]"
                          >
                            <button
                              className={`w-full relative h-[70px] flex items-center justify-start gap-x-4 pr-6 cursor-pointer  transition-all duration-300 ease-in-out`}
                              onClick={() => {
                                setCurrentModule(module);
                              }}
                            >
                              {isActive && (
                                <span
                                  className="absolute inset-0 opacity-10"
                                  style={{ backgroundColor: color }}
                                ></span>
                              )}
                              <div className="w-[60px] h-full flex items-center justify-center">
                                <div
                                  className={`w-[30px] h-[30px] rounded-[50%] bg-white border-4 flex items-center justify-center`}
                                  style={{
                                    border: `${color} solid 1px`,
                                    backgroundColor: getColor(),
                                  }}
                                >
                                  {videoIndex < currentEpisode && (
                                    <Check
                                      strokeWidth={3}
                                      className="w-5 h-5 text-white"
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="w-full h-full flex flex-col items-start justify-center gap-y-2 py-4">
                                <div className="flex items-center justify-start gap-x-2 mt-4">
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
                                    {videoIndex + " "}-{module?.title}
                                  </p>
                                </div>
                                <span className="text-black text-sm">
                                  ({formatDuration(module.length)})
                                </span>
                              </div>
                            </button>
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
    </ScrollArea>
  );
};

export default VideoChain;
