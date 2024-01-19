"use client";

import { Chapter as ChapterType } from "database";
import type { FC } from "react";
import { usePathname } from "next/navigation";
import { trpc } from "@/src/app/_trpc/client";
import { getValueFromUrl } from "../lib/utils";
import Chapter from "./chapter";

import AddChapter from "./models/add-chapter";
import { Module } from "../types";

interface ChaptersBoardAbdullahProps {
  initialData: ChapterType[];
}

const ChaptersBoard: FC<ChaptersBoardAbdullahProps> = ({ initialData }) => {
  const path = usePathname();

  const courseID = getValueFromUrl(path, 2);

  const { data, refetch } = trpc.getChapters.useQuery(
    { courseId: courseID },
    {
      initialData,
    }
  );

  return (
    <div className="w-full flex flex-col gap-y-4 min-h-[100px] ">
      {data?.map((item) => {
        const modules = item?.modules
          ? (JSON.parse(item.modules as string) as Module[])
          : ([] as Module[]);
        return (
          <Chapter
            modules={modules}
            key={item.id}
            title={item?.title}
            chapterID={item.id}
          />
        );
      })}

      <div className="w-full h-[100px] flex items-center justify-center py-2">
        <AddChapter chaptersNumber={data.length} refetch={refetch} />
      </div>
    </div>
  );
};

export default ChaptersBoard;
