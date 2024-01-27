"use client";

import { Chapter as ChapterType } from "database";
import type { FC } from "react";
import * as React from "react";
import { usePathname } from "next/navigation";
import { trpc } from "@/src/app/_trpc/client";
import { getValueFromUrl } from "../lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/components/ui/accordion";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import AddChapter from "./models/add-chapter";
import { Module } from "../types";
import { NotFoundCard } from "./not-found-card";
import { cn } from "@ui/lib/utils";
import { Grip } from "lucide-react";
import { maketoast } from "./toasts";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@ui/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { ChevronDown } from "lucide-react";
import DeleteChapter from "./models/delete-chapter-model";
import { useMounted } from "../hooks/use-mounted";
import UpdateChapterModel from "./models/update-chapter-modle";
import { Badge } from "@ui/components/ui/badge";
import Link from "next/link";
import { AddToChapter } from "./chapter";

interface ChaptersBoardAbdullahProps {
  initialData: ChapterType[];
}

const ChaptersBoard: FC<ChaptersBoardAbdullahProps> = ({ initialData }) => {
  const path = usePathname();
  const [isMounted, setIsMounted] = React.useState(false);
  const [isDeleteModelOpen, setIsDeleteModelOpen] =
    React.useState<boolean>(false);
  const [IsEditeChapterOpen, setIsEditeChapterOpen] =
    React.useState<boolean>(false);

  const IsMounted = useMounted();

  const [selectedChapterId, setSelectedChapterId] = React.useState<
    string | null
  >(null);

  // this state will go to the model when pop up so the input will get it as a default value
  const [prevChapterTitle, setPrevChapterTitle] = React.useState<string>("");

  const courseID = getValueFromUrl(path, 2);

  const { data, refetch } = trpc.getChapters.useQuery(
    { courseId: courseID },
    {
      initialData,
    }
  );
  const mutation = trpc.updateChapters.useMutation({
    onSuccess: () => {
      maketoast.success();
    },
    onError: () => {
      maketoast.error();
    },
  });

  const visibilityMutation = trpc.toggleChapterVisibility.useMutation({
    onSuccess: async () => {
      await refetch();
      maketoast.success();
    },
    onError: () => {
      maketoast.error();
    },
  });

  const [sections, setSections] = React.useState(data || []);

  const onDragEnd = (result: DropResult) => {
    if (!result) return;
    if (!result.destination) return;

    const items = data;
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedSections = items.slice(startIndex, endIndex + 1);

    setSections(updatedSections);

    const bulkUpdateData = updatedSections.map((section) => ({
      id: section.id,
      position: items.findIndex((item) => item.id === section.id),
    }));

    mutation.mutate({
      courseID,
      bulkUpdateData,
    });
  };

  useEffect(() => {
    setSections(data);
  }, [data]);

  if (!IsMounted) {
    return null;
  }

  if (data.length === 0) {
    return (
      <>
        <NotFoundCard />
        <div className="w-full h-[100px] flex items-center justify-center py-2">
          <AddChapter chaptersNumber={data.length} refetch={refetch} />
        </div>
      </>
    );
  }

  return (
    <>
      <DeleteChapter
        refetch={refetch}
        isOpen={isDeleteModelOpen}
        setIsOpen={setIsDeleteModelOpen}
        chapterId={selectedChapterId}
      />
      <UpdateChapterModel
        prevTitle={prevChapterTitle}
        refetch={refetch}
        isOpen={IsEditeChapterOpen}
        setIsOpen={setIsEditeChapterOpen}
        chapterId={selectedChapterId}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="chapters">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {sections.map((chapter, index) => (
                <Draggable
                  key={chapter.id}
                  draggableId={chapter.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className={cn(
                        "flex flex-col  justify-start gap-y-2 bg-[#FC6B0033] border-[#FC6B00] cursor-pointer  my-4 rounded-2xl ",
                        chapter.isVisible && " text-black"
                      )}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <Accordion type="single" collapsible>
                        <AccordionItem
                          value={`item-${index}`}
                          className="w-full min-h-[40px] h-fit p-4 "
                        >
                          <AccordionTrigger asChild>
                            <div className="w-full h-[40px]  flex items-center justify-between ">
                              <div className=" w-fit h-full flex items-center justify-start">
                                <div
                                  className={cn("px-2 py-3   transition")}
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
                                <div className="w-fit flex flex-col h-full mr-4 justify-center gap-y-1">
                                  <p className="text-black text-sm font-bold ">
                                    {" "}
                                    {chapter.title}
                                  </p>
                                  <span className="text-[#A1A1A1] text-xs text-start ">
                                    {0}
                                    مواد
                                  </span>
                                </div>
                              </div>

                              <div
                                dir="rtl"
                                className="w-fit h-full flex items-center  gap-x-4 justify-end"
                              >
                                {!chapter.isVisible && (
                                  <Badge className="text-white bg-black">
                                    مختفي
                                  </Badge>
                                )}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="bg-transparent hover:bg-transparent"
                                      size="icon"
                                    >
                                      <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start">
                                    <DropdownMenuItem
                                      className="flex justify-end items-center p-2 text-sm"
                                      onClick={() => {
                                        visibilityMutation.mutate({
                                          chapterId: chapter.id,
                                          visibility: !chapter.isVisible,
                                        });
                                      }}
                                    >
                                      {chapter.isVisible
                                        ? "جعل هذا الفصل غير مرئية"
                                        : "جعل هذا الفصل مرئيا"}
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="flex justify-end items-center p-2 text-sm"
                                      onClick={() => {
                                        setSelectedChapterId(chapter.id);
                                        setPrevChapterTitle(chapter.title);
                                        setIsEditeChapterOpen(true);
                                      }}
                                    >
                                      تغيير عنوان الفصل
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="flex justify-end items-center p-2 text-sm text-red-500"
                                      onClick={() => {
                                        setSelectedChapterId(chapter.id);
                                        setIsDeleteModelOpen(true);
                                      }}
                                    >
                                      حذف هذا الفصل
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <ChevronDown className="h-5 w-5" />
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="mt-4">
                            <AddToChapter path={path} chapterID={chapter.id} />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="w-full h-[100px] flex items-center justify-center py-2">
        <AddChapter chaptersNumber={data.length} refetch={refetch} />
      </div>
    </>
  );
};

export default ChaptersBoard;
