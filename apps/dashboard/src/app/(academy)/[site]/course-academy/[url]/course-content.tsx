"use client";

import type { FC } from "react";
import React from "react";
import { Chapter, Course } from "database";
import CourseDescription from "../../../_components/course-component/course-description";
import CourseContent from "../../../_components/course-component/course-content";
import LoadingCard from "../../../_components/loading";
import { getEmbedUrl } from "@/src/lib/utils";

interface CourseContentProps {
  course: Course;
  chapters: Chapter[];
  color: string;
}

const tabs = [
  {
    name: "معلومات",
    value: "informations",
  },
  {
    name: "المحتوى",
    value: "content",
  },
];

const CourseDisplayContent: FC<CourseContentProps> = ({
  course,
  chapters,
  color,
}) => {
  const [tab, setTab] = React.useState<{ name: string; value: string }>(
    tabs[0]
  );
  const [videoLoaded, setVideoLoaded] = React.useState(false);
  return (
    <div className="w-full min-h-[300px]  h-fit my-4">
      <div className="w-full h-16 bg-white border rounded-xl  flex  items-center justify-start gap-x-4 ">
        {tabs.map((item, index) => (
          <button
            key={item.name + index}
            className={`h-full w-[100px] text-black ${
              tab.value === item.value
                ? "border-b-2 border-black font-bold "
                : ""
            }`}
            onClick={() => setTab(item)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-y-4 my-4">
        {(() => {
          switch (tab.value) {
            case "informations":
              return (
                <>
                  <div className="w-full h-fit">
                    {course?.preview_video ? (
                      <div className="w-full h-[500px] relative ">
                        {!videoLoaded && (
                          <LoadingCard className="h-[500px] w-full bg-white" />
                        )}

                        <iframe
                          src={`https://iframe.mediadelivery.net/embed/${process.env["NEXT_PUBLIC_VIDEO_LIBRARY"]}/${course?.preview_video}?primaryColor=${color}`}
                          loading="lazy"
                          style={{
                            border: "none",
                            position: "absolute",
                            height: "100%",
                            width: "100%",
                          }}
                          onLoad={() => setVideoLoaded(true)} // Set videoLoaded to true when loaded
                          allow="accelerometer; gyroscope;  encrypted-media; picture-in-picture;"
                          allowFullScreen={true}
                        ></iframe>
                      </div>
                    ) : (
                      <div className="w-full h-[500px] relative ">
                        <div className="relative w-full h-full">
                          <iframe
                            width="100%"
                            height="500"
                            className="!rounded-md"
                            src={getEmbedUrl({
                              url: course?.youtubeUrl,
                            })}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          ></iframe>
                        </div>
                      </div>
                    )}
                  </div>

                  <CourseDescription
                    // @ts-ignore
                    value={JSON.parse(course?.courseDescription as string)}
                  />
                  {/* what you are gonna learn */}
                  {course.courseWhatYouWillLearn && (
                    <div className="w-full my-4  min-h-[50px] h-fit flex flex-col rounded-xl">
                      <div className="w-full h-[50px]  flex items-center justify-start gap-x-4">
                        <h3 className="text-xl font-bold">
                          ماذا ستتعلم في هذه الدورة
                        </h3>
                      </div>
                      <div className="w-full min-h-[50px] h-fit flex flex-col bg-white  gap-y-4 rounded-xl border  p-4">
                        <p className="text-lg text-black">
                          {course?.courseWhatYouWillLearn}
                        </p>
                      </div>
                    </div>
                  )}
                  {/* requirements */}

                  {course.courseRequirements && (
                    <div className="w-full min-h-[100px] h-fit flex flex-col rounded-xl">
                      <div className="w-full h-[100px] flex items-center justify-start gap-x-4">
                        <h3 className="text-xl font-bold">
                          متطلبات حضور الدورة
                        </h3>
                      </div>
                      <div className="w-full min-h-[100px] h-fit flex flex-col bg-white gap-y-4 border rounded-xl  p-4">
                        <p className="text-lg text-black">
                          {course?.courseRequirements}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              );
            case "content":
              return <CourseContent chapters={chapters} />;

            default:
              return <div>Default case</div>;
          }
        })()}
      </div>
    </div>
  );
};

export default CourseDisplayContent;
