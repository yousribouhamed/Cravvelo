/* eslint-disable */

"use client";

import { Chapter as ChapterType } from "database";
import { FC, useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { trpc } from "@/src/app/_trpc/client";
import { getValueFromUrl } from "../lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import AddChapter from "./models/create-chapter-modal";
import { NotFoundCard } from "./not-found-card";
import { cn } from "@ui/lib/utils";
import { Button } from "@ui/components/ui/button";
import { MoreHorizontal, ChevronDown, Grip } from "lucide-react";
import DeleteChapter from "./models/delete-chapter-modal";
import { useMounted } from "../hooks/use-mounted";
import UpdateChapterModel from "./models/update-chapter-modal";
import { Badge } from "@ui/components/ui/badge";
import Link from "next/link";
import { AddToChapter } from "./chapter";
import ModulesList from "./modules-list";
import { Module } from "../types";
import { maketoast } from "./toasts";

interface ChaptersBoardProps {
  initialData: ChapterType[];
}

const ChaptersBoard: FC<ChaptersBoardProps> = ({ initialData }) => {
  const path = usePathname();
  const courseID = getValueFromUrl(path, 2);
  const isMounted = useMounted();

  const [isDeleteModelOpen, setIsDeleteModelOpen] = useState<boolean>(false);
  const [isEditChapterOpen, setIsEditChapterOpen] = useState<boolean>(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(
    null
  );
  const [prevChapterTitle, setPrevChapterTitle] = useState<string>("");
  const [sections, setSections] = useState(initialData);

  const { data, refetch } = trpc.getChapters.useQuery(
    { courseId: courseID },
    { initialData }
  );

  const updateMutation = trpc.updateChapters.useMutation({
    onSuccess: () => {
      maketoast.success();
      refetch();
    },
    onError: () => {
      maketoast.error();
    },
  });

  const visibilityMutation = trpc.toggleChapterVisibility.useMutation({
    onSuccess: () => {
      refetch();
      maketoast.success();
    },
    onError: () => {
      maketoast.error();
    },
  });

  useEffect(() => {
    if (data) {
      setSections(data);
    }
  }, [data]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const items = Array.from(sections);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      const updatedSections = items.map((section, index) => ({
        ...section,
        position: index,
      }));

      setSections(updatedSections);

      updateMutation.mutate({
        courseID,
        bulkUpdateData: updatedSections.map((section) => ({
          id: section.id,
          position: section.position,
        })),
      });
    },
    [sections, updateMutation, courseID]
  );

  if (!isMounted) {
    return null;
  }

  if (sections.length === 0) {
    return (
      <>
        <div className="mt-8">
          <NotFoundCard
            src={"/no-chapters.svg"}
            text="لم تقم بإضافة أي فصل إلى هذه الدورة"
          />
        </div>
        <div className="w-full h-[100px] flex items-center justify-center py-2">
          <AddChapter chaptersNumber={sections.length} refetch={refetch} />
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
        isOpen={isEditChapterOpen}
        setIsOpen={setIsEditChapterOpen}
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
                  {(provided) => {
                    const [open, setOpen] = useState<boolean>(false);
                    const materials = JSON.parse(
                      chapter.modules as string
                    ) as Module[];

                    return (
                      <div
                        className={cn(
                          "flex flex-col justify-start gap-y-2 bg-[#FC6B0033] border-[#FC6B00] my-4 rounded-2xl",
                          chapter.isVisible && "text-black"
                        )}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <Accordion
                          defaultValue={
                            sections.length - 1 === index ? `item-${index}` : ""
                          }
                          onClick={() => setOpen(!open)}
                          type="single"
                          collapsible
                        >
                          <AccordionItem
                            value={`item-${index}`}
                            className="w-full min-h-[40px] h-fit p-4"
                          >
                            <AccordionTrigger asChild>
                              <div className="w-full h-[40px] flex items-center cursor-pointer justify-between">
                                <div className="w-fit h-full flex items-center justify-start">
                                  <div
                                    className={cn("px-2 py-3 transition")}
                                    {...provided.dragHandleProps}
                                  >
                                    <Grip />
                                  </div>
                                  <div className="w-fit flex flex-col h-full mr-4 justify-center gap-y-1">
                                    <p className="text-black text-sm font-bold">
                                      {chapter.title}
                                    </p>
                                    <span className="text-[#A1A1A1] text-xs text-start space-x-2">
                                      {materials?.length
                                        ? materials?.length
                                        : "0"}{" "}
                                      مواد
                                    </span>
                                  </div>
                                </div>
                                <div
                                  dir="rtl"
                                  className="w-fit h-full flex items-center gap-x-4 justify-end"
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
                                          setIsEditChapterOpen(true);
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
                                  <ChevronDown
                                    className={`h-5 w-5 ${
                                      open ? "" : "rotate-180"
                                    } transition-all duration-300`}
                                  />
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="mt-4 space-y-4">
                              <ModulesList
                                title={chapter.title}
                                courseId={courseID}
                                chapterID={chapter.id}
                                initialModules={materials}
                              />
                              <AddToChapter
                                path={path}
                                chapterID={chapter.id}
                              />
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    );
                  }}
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
