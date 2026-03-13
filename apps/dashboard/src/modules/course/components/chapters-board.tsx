/* eslint-disable */

"use client";

import { Chapter as ChapterType } from "database";
import { FC, useCallback, useEffect, useState, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { trpc } from "@/src/app/_trpc/client";
import { getValueFromUrl } from "../../../lib/utils";
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
import AddChapter from "../../../components/models/create-chapter-modal";
import { NotFoundCard } from "../../../components/not-found-card";
import { cn } from "@ui/lib/utils";
import { Button } from "@ui/components/ui/button";
import { MoreHorizontal, ChevronDown } from "lucide-react";
import DeleteChapter from "../../../components/models/delete-chapter-modal";
import { useMounted } from "../../../hooks/use-mounted";
import UpdateChapterModel from "../../../components/models/update-chapter-modal";
import { Badge } from "@ui/components/ui/badge";
import { AddToChapter } from "./AddToChapter";
import ModulesList from "./modules-list";
import { Module } from "@/src/types";
import { maketoast } from "@/src/components/toasts";
import { Skeleton } from "@ui/components/ui/skeleton";

interface ChaptersBoardProps {
  initialData: ChapterType[];
}

const ChaptersBoard: FC<ChaptersBoardProps> = ({ initialData }) => {
  const path = usePathname();
  const courseID = getValueFromUrl(path, 2);
  const isMounted = useMounted();
  const t = useTranslations("courses.chaptersBoard");

  // State management
  const [isDeleteModelOpen, setIsDeleteModelOpen] = useState<boolean>(false);
  const [isEditChapterOpen, setIsEditChapterOpen] = useState<boolean>(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(
    null
  );
  const [prevChapterTitle, setPrevChapterTitle] = useState<string>("");
  const [sections, setSections] = useState<ChapterType[]>(initialData || []);
  // Changed: Use chapter IDs instead of indices for accordion state
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);

  // Refs for performance optimization
  const sectionsRef = useRef<ChapterType[]>(sections);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update ref when sections change
  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  const { data, refetch, isLoading, error } = trpc.getChapters.useQuery(
    { courseId: courseID },
    {
      initialData: initialData || [],
      enabled: !!courseID,
      staleTime: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    }
  );

  const updateMutation = trpc.updateChapters.useMutation({
    onSuccess: () => {
      maketoast.success(t("messages.updateOrderSuccess"));
      void refetch().catch((e) =>
        console.error("Refetch after reorder failed", e)
      );
    },
    onError: (error) => {
      console.error("Failed to update chapters:", error);
      maketoast.error(t("messages.updateOrderError"));
      // Revert to previous state; never set sections to non-array to avoid render throw
      setSections(
        Array.isArray(data) ? data : sectionsRef.current ?? []
      );
    },
  });

  const visibilityMutation = trpc.toggleChapterVisibility.useMutation({
    onSuccess: () => {
      maketoast.success(t("messages.updateVisibilitySuccess"));
      refetch();
    },
    onError: (error) => {
      console.error("Failed to toggle visibility:", error);
      maketoast.error(t("messages.updateVisibilityError"));
      // Revert visibility change; never set sections to non-array
      setSections(
        Array.isArray(data) ? data : sectionsRef.current ?? []
      );
    },
  });

  // Sync with server data; only set sections when we have a valid array
  useEffect(() => {
    const nextSections = Array.isArray(data) ? data : [];
    setSections(nextSections);
    if (nextSections.length > 0) {
      const lastChapter = [...nextSections].sort(
        //@ts-expect-error
        (a, b) => (a.position || 0) - (b.position || 0)
      )[nextSections.length - 1];
      setOpenAccordions(new Set([lastChapter.id]));
    }
  }, [data]);

  // Memoized values for performance
  const sortedSections = useMemo(() => {
    //@ts-expect-error
    return [...sections].sort((a, b) => (a.position || 0) - (b.position || 0));
  }, [sections]);

  const totalModulesCount = useMemo(() => {
    return sections.reduce((total, chapter) => {
      try {
        const materials = JSON.parse(chapter.modules as string) as Module[];
        return total + (materials?.length || 0);
      } catch {
        return total;
      }
    }, 0);
  }, [sections]);

  // Optimized drag end handler with debouncing
  const onDragEnd = useCallback(
    (result: DropResult) => {
      setIsDragging(false);
      setDragStartIndex(null);

      if (!result.destination) return;

      const sourceIndex = result.source.index;
      const destinationIndex = result.destination.index;

      // No change in position
      if (sourceIndex === destinationIndex) return;

      try {
        const items = Array.from(sectionsRef.current);
        const [reorderedItem] = items.splice(sourceIndex, 1);
        items.splice(destinationIndex, 0, reorderedItem);

        // Update positions
        const updatedSections = items.map((section, index) => ({
          ...section,
          position: index,
        }));

        // Optimistic update - accordion state is preserved because we use chapter IDs
        setSections(updatedSections);

        // Debounce the server update
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current);
        }

        updateTimeoutRef.current = setTimeout(() => {
          if (!courseID?.trim()) {
            maketoast.error(t("messages.updateOrderError"));
            setSections(sectionsRef.current ?? []);
            return;
          }
          updateMutation.mutate({
            courseID,
            bulkUpdateData: updatedSections.map((section) => ({
              id: section.id,
              position: section.position,
            })),
          });
        }, 300);
      } catch (error) {
        console.error("Error during drag operation:", error);
        maketoast.error(t("messages.reorderError"));
      }
    },
    [updateMutation, courseID, t]
  );

  const onDragStart = useCallback((start: any) => {
    setIsDragging(true);
    setDragStartIndex(start.source.index);
  }, []);

  // Changed: Accordion handlers now use chapter IDs
  const handleAccordionToggle = useCallback((chapterId: string) => {
    setOpenAccordions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  }, []);

  // Safe JSON parsing with error handling
  const parseModules = useCallback((modulesString: string): Module[] => {
    try {
      const parsed = JSON.parse(modulesString);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn("Failed to parse modules:", error);
      return [];
    }
  }, []);

  // Handle visibility toggle with optimistic updates
  const handleVisibilityToggle = useCallback(
    (chapterId: string, currentVisibility: boolean) => {
      // Optimistic update
      setSections((prev) =>
        prev.map((chapter) =>
          chapter.id === chapterId
            ? { ...chapter, isVisible: !currentVisibility }
            : chapter
        )
      );

      visibilityMutation.mutate({
        chapterId,
        visibility: !currentVisibility,
      });
    },
    [visibilityMutation]
  );

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Loading state
  if (!isMounted) {
    return null;
  }

  // Error state
  if (error) {
    return (
      <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-700 dark:text-red-200">{t("error.loadingError")}</p>
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          className="mt-2"
        >
          {t("error.retry")}
        </Button>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="mt-8 flex flex-col gap-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col bg-card justify-start gap-y-2 border border-border rounded-2xl p-4"
          >
            <div className="w-full h-[40px] flex items-center justify-between">
              <div className="w-fit h-full flex items-center gap-x-3">
                <Skeleton className="h-5 w-5 rounded-lg shrink-0" />
                <div className="flex flex-col gap-y-2">
                  <Skeleton className="h-4 w-40 rounded-md" />
                  <Skeleton className="h-3 w-20 rounded-md" />
                </div>
              </div>
              <div className="flex items-center gap-x-2">
                <Skeleton className="h-6 w-14 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (sortedSections.length === 0) {
    return (
      <>
        <div className="mt-8">
          <NotFoundCard
            src={"/no-chapters.svg"}
            text={t("emptyState.noChapters")}
          />
        </div>
        <div className="w-full h-[100px] flex items-center justify-center py-2">
          <AddChapter chaptersNumber={0} refetch={refetch} />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Modals */}
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

      {/* Drag Drop Context */}
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <Droppable droppableId="chapters" type="CHAPTER">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={cn(
                "transition-colors flex flex-col gap-y-4 duration-200",
                snapshot.isDraggingOver && "bg-orange-50 dark:bg-orange-900/20 rounded-lg"
              )}
            >
              {sortedSections.map((chapter, index) => {
                const materials = parseModules(chapter.modules as string);
                // Changed: Use chapter ID instead of index for accordion
                const accordionId = chapter.id;
                const isOpen = openAccordions.has(accordionId);

                return (
                  <Draggable
                    key={chapter.id}
                    draggableId={chapter.id}
                    index={index}
                    isDragDisabled={
                      updateMutation.isLoading || visibilityMutation.isLoading
                    }
                  >
                    {(provided, snapshot) => (
                      <div
                        className={cn(
                          "flex flex-col bg-card justify-start gap-y-2 transition-all duration-300 border border-border my-3 rounded-2xl",
                          chapter.isVisible ? "text-foreground" : "opacity-75",
                          snapshot.isDragging &&
                            " shadow-2xl scale-105 rotate-2 z-50 border-[#FC6B00] ",
                          dragStartIndex === index &&
                            !snapshot.isDragging &&
                            "scale-95",
                          !chapter.isVisible && "bg-muted border-muted"
                        )}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <Accordion
                          value={isOpen ? accordionId : ""}
                          onValueChange={(value) =>
                            handleAccordionToggle(accordionId)
                          }
                          type="single"
                          collapsible
                        >
                          <AccordionItem
                            value={accordionId}
                            className="w-full min-h-[60px] bg-card rounded-2xl h-fit p-4 border-none"
                          >
                            <AccordionTrigger asChild>
                              <div className="w-full h-[40px] flex items-center cursor-pointer justify-between group">
                                <div className="w-fit h-full flex items-center justify-start">
                                  {/* Drag Handle */}
                                  <div
                                    className={cn(
                                      "px-2 rounded-lg py-3 transition-colors duration-200 cursor-grab active:cursor-grabbing",
                                      "text-muted-foreground hover:text-foreground",
                                      "hover:bg-accent/50 group-hover:bg-accent/50",
                                      snapshot.isDragging && "cursor-grabbing"
                                    )}
                                    {...provided.dragHandleProps}
                                    aria-label={t("dragHandle.ariaLabel")}
                                  >
                                    <svg
                                      width="21"
                                      height="20"
                                      viewBox="0 0 21 20"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="transition-colors duration-200"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M6.51758 4.27791C6.51758 3.59749 7.06917 3.0459 7.74959 3.0459C8.43002 3.0459 8.98161 3.59749 8.98161 4.27791C8.98161 4.95834 8.43002 5.50993 7.74959 5.50993C7.06917 5.50993 6.51758 4.95834 6.51758 4.27791ZM6.51758 9.20597C6.51758 8.52554 7.06917 7.97396 7.74959 7.97396C8.43002 7.97396 8.98161 8.52554 8.98161 9.20597C8.98161 9.8864 8.43002 10.438 7.74959 10.438C7.06917 10.438 6.51758 9.8864 6.51758 9.20597ZM6.51758 14.134C6.51758 13.4536 7.06917 12.902 7.74959 12.902C8.43002 12.902 8.98161 13.4536 8.98161 14.134C8.98161 14.8145 8.43002 15.366 7.74959 15.366C7.06917 15.366 6.51758 14.8145 6.51758 14.134Z"
                                        fill="currentColor"
                                      />
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M11.9385 4.27791C11.9385 3.59749 12.49 3.0459 13.1705 3.0459C13.851 3.0459 14.4025 3.59749 14.4025 4.27791C14.4025 4.95834 13.851 5.50993 13.1705 5.50993C12.49 5.50993 11.9385 4.95834 11.9385 4.27791ZM11.9385 9.20597C11.9385 8.52554 12.49 7.97396 13.1705 7.97396C13.851 7.97396 14.4025 8.52554 14.4025 9.20597C14.4025 9.8864 13.851 10.438 13.1705 10.438C12.49 10.438 11.9385 9.8864 11.9385 9.20597ZM11.9385 14.134C11.9385 13.4536 12.49 12.902 13.1705 12.902C13.851 12.902 14.4025 13.4536 14.4025 14.134C14.4025 14.8145 13.851 15.366 13.1705 15.366C12.49 15.366 11.9385 14.8145 11.9385 14.134Z"
                                        fill="currentColor"
                                      />
                                    </svg>
                                  </div>

                                  {/* Chapter Info */}
                                  <div className="w-fit flex flex-col h-full mr-4 justify-center gap-y-1">
                                    <div className="flex items-center gap-x-2">
                                      <p className="text-black dark:text-white text-sm font-bold line-clamp-1 transition-colors duration-200">
                                        {chapter.title || t("chapter.noTitle")}
                                      </p>
                                    </div>
                                    <span className="text-muted-foreground text-xs text-start transition-colors duration-200">
                                      {materials.length}{" "}
                                      {materials.length === 1 ? t("materials.single") : t("materials.plural")}
                                    </span>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div
                                  dir="rtl"
                                  className="w-fit h-full flex items-center gap-x-2 justify-end"
                                >
                                  {/* Visibility Badge */}
                                  {!chapter.isVisible && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {t("badge.hidden")}
                                    </Badge>
                                  )}

                                  {/* Loading Indicator */}
                                  {(updateMutation.isLoading ||
                                    visibilityMutation.isLoading) && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  )}

                                  {/* Dropdown Menu */}
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="bg-transparent hover:bg-accent/50 h-8 w-8 p-0"
                                        size="sm"
                                        disabled={
                                          updateMutation.isLoading ||
                                          visibilityMutation.isLoading
                                        }
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">
                                          {t("menu.openMenu")}
                                        </span>
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="start"
                                      className="w-48"
                                    >
                                      <DropdownMenuItem
                                        className="flex justify-end items-center p-2 text-sm cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleVisibilityToggle(
                                            chapter.id,
                                            chapter.isVisible
                                          );
                                        }}
                                        disabled={visibilityMutation.isLoading}
                                      >
                                        {chapter.isVisible
                                          ? t("menu.hideChapter")
                                          : t("menu.showChapter")}
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        className="flex justify-end items-center p-2 text-sm cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedChapterId(chapter.id);
                                          setPrevChapterTitle(chapter.title);
                                          setIsEditChapterOpen(true);
                                        }}
                                      >
                                        {t("menu.editTitle")}
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        className="flex justify-end items-center p-2 text-sm text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedChapterId(chapter.id);
                                          setIsDeleteModelOpen(true);
                                        }}
                                      >
                                        {t("menu.deleteChapter")}
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>

                                  {/* Accordion Chevron */}
                                  <ChevronDown
                                    className={cn(
                                      "h-4 w-4 transition-transform duration-200",
                                      isOpen && "rotate-180"
                                    )}
                                  />
                                </div>
                              </div>
                            </AccordionTrigger>

                            {/* Accordion Content */}
                            <AccordionContent className="mt-4 space-y-4 pb-2">
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
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add Chapter Button */}
      <div className="w-full h-[100px] flex items-center justify-center py-2">
        <AddChapter chaptersNumber={sortedSections.length} refetch={refetch} />
      </div>
    </>
  );
};

export default ChaptersBoard;
