"use client";

import type { FC } from "react";
import React from "react";
import ApiVideoPlayer from "@api.video/react-player";
import { Chapter, Course } from "database";
import CourseDescription from "../../../_components/course-component/course-description";
import CourseContent from "../../../_components/course-component/course-content";
import Feedbacks from "../../../_components/course-component/feedbacks";

interface CourseContentProps {
  course: Course;
  chapters: Chapter[];
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

const CourseDisplayContent: FC<CourseContentProps> = ({ course, chapters }) => {
  const [tab, setTab] = React.useState<{ name: string; value: string }>(
    tabs[0]
  );
  return (
    <div className="w-full min-h-[300px] h-fit my-4">
      <div className="w-full h-14 bg-white  flex  items-center justify-start gap-x-4 ">
        {tabs.map((item) => (
          <button
            className={`h-full w-[100px] text-black ${
              tab.value === item.value
                ? "border-b-2 border-primary font-bold "
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
                  <div className="w-full h-[500px]  ">
                    <ApiVideoPlayer
                      video={{ id: course?.youtubeUrl }}
                      style={{ width: "100%", height: 450 }}
                    />
                  </div>
                  <CourseDescription
                    // @ts-ignore
                    value={JSON.parse(course?.courseDescription as string)}
                  />
                  {/* what you are gonna learn */}
                  <div className="w-full my-4 min-h-[200px] h-fit flex flex-col rounded-xl">
                    <div className="w-full h-[100px] flex items-center justify-start gap-x-4">
                      <h3 className="text-xl font-bold">
                        ماذا ستتعلم في هذه الدورة
                      </h3>
                    </div>
                    <div className="w-full h-[300px] flex flex-col bg-white  gap-y-4 rounded-xl  p-4">
                      <p className="text-lg text-black">
                        uuuuu
                        {course?.courseWhatYouWillLearn}
                      </p>
                    </div>
                  </div>
                  {/* requirements */}
                  <div className="w-full min-h-[200px] h-fit flex flex-col rounded-xl">
                    <div className="w-full h-[100px] flex items-center justify-start gap-x-4">
                      <h3 className="text-xl font-bold">متطلبات حضور الدورة</h3>
                    </div>
                    <div className="w-full h-[300px] flex flex-col bg-white gap-y-4 rounded-xl  p-4">
                      <p className="text-lg text-black">
                        {course?.courseRequirements}
                      </p>
                    </div>
                  </div>

                  <Feedbacks />
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
