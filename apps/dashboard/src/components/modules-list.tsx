"use client";

import { FC, useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";
import { Module } from "../types";
import { cn } from "@ui/lib/utils";
import { Badge } from "@ui/components/ui/badge";
import { useMounted } from "../hooks/use-mounted";
import Link from "next/link";

interface ModulesListProps {}

interface ChapterProps {
  title: string;
  chapterID: string;
  courseId: string;
  initialModules: Module[];
}

const ModulesList: FC<ChapterProps> = ({
  chapterID,
  courseId,
  initialModules,
}) => {
  const [modules, setModules] = useState(initialModules || []);

  const isMounted = useMounted();

  const onDragEnd = (result: DropResult) => {
    if (!result) return;
    if (!result.destination) return;

    const items = modules;
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedSections = items.slice(startIndex, endIndex + 1);

    setModules(updatedSections);

    // const bulkUpdateData = updatedSections.map((section) => ({
    //   id: section.id,
    //   position: items.findIndex((item) => item.id === section.id),
    // }));

    // mutation.mutate({
    //   courseID,
    //   bulkUpdateData,
    // });
  };

  if (!isMounted) {
    return null;
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={chapterID + "this is an id"}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="mr-12  min-h-[10px] h-fit"
          >
            {modules.map((chapter, index) => (
              <Draggable
                key={chapter.title + chapterID}
                draggableId={chapter.title + chapterID}
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-transparent  h-[25px] justify-start  rounded-md my-4 text-sm"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(" rounded-l-md transition ")}
                      {...provided.dragHandleProps}
                    >
                      <svg
                        width="21"
                        height="20"
                        viewBox="0 0 21 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M6.51758 4.27791C6.51758 3.59749 7.06917 3.0459 7.74959 3.0459C8.43002 3.0459 8.98161 3.59749 8.98161 4.27791C8.98161 4.95834 8.43002 5.50993 7.74959 5.50993C7.06917 5.50993 6.51758 4.95834 6.51758 4.27791ZM6.51758 9.20597C6.51758 8.52554 7.06917 7.97396 7.74959 7.97396C8.43002 7.97396 8.98161 8.52554 8.98161 9.20597C8.98161 9.8864 8.43002 10.438 7.74959 10.438C7.06917 10.438 6.51758 9.8864 6.51758 9.20597ZM6.51758 14.134C6.51758 13.4536 7.06917 12.902 7.74959 12.902C8.43002 12.902 8.98161 13.4536 8.98161 14.134C8.98161 14.8145 8.43002 15.366 7.74959 15.366C7.06917 15.366 6.51758 14.8145 6.51758 14.134Z"
                          fill="#2D2D2D"
                        />
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M11.9385 4.27791C11.9385 3.59749 12.49 3.0459 13.1705 3.0459C13.851 3.0459 14.4025 3.59749 14.4025 4.27791C14.4025 4.95834 13.851 5.50993 13.1705 5.50993C12.49 5.50993 11.9385 4.95834 11.9385 4.27791ZM11.9385 9.20597C11.9385 8.52554 12.49 7.97396 13.1705 7.97396C13.851 7.97396 14.4025 8.52554 14.4025 9.20597C14.4025 9.8864 13.851 10.438 13.1705 10.438C12.49 10.438 11.9385 9.8864 11.9385 9.20597ZM11.9385 14.134C11.9385 13.4536 12.49 12.902 13.1705 12.902C13.851 12.902 14.4025 13.4536 14.4025 14.134C14.4025 14.8145 13.851 15.366 13.1705 15.366C12.49 15.366 11.9385 14.8145 11.9385 14.134Z"
                          fill="#2D2D2D"
                        />
                      </svg>
                    </div>
                    <Link
                      href={`/courses/${courseId}/chapters/${chapterID}/${chapter.fileUrl}/update-video`}
                    >
                      <p className="text-black font-bold text-sm hover:text-primary transition-all duration-300 ">
                        {" "}
                        {chapter.title}
                      </p>
                    </Link>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ModulesList;
