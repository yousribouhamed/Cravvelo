"use client";

import { FC, useCallback, useState, useRef, useEffect, useMemo } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Module } from "@/src/types";
import { cn } from "@ui/lib/utils";
import { useMounted } from "@/src/hooks/use-mounted";
import Link from "next/link";
import { trpc } from "@/src/app/_trpc/client";
import { maketoast } from "@/src/components/toasts";
import { Button } from "@ui/components/ui/button";
import { Badge } from "@ui/components/ui/badge";
import {
  MoreHorizontal,
  Loader2,
  Play,
  FileText,
  Video,
  Image,
  Download,
  ExternalLink,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/components/ui/tooltip";

interface ModulesListProps {
  title: string;
  chapterID: string;
  courseId: string;
  initialModules: Module[];
}

const ModulesList: FC<ModulesListProps> = ({
  title,
  chapterID,
  courseId,
  initialModules,
}) => {
  const [modules, setModules] = useState<Module[]>(initialModules || []);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);
  const [hoveredModuleId, setHoveredModuleId] = useState<string | null>(null);

  const isMounted = useMounted();
  const modulesRef = useRef<Module[]>(modules);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update ref when modules change
  useEffect(() => {
    modulesRef.current = modules;
  }, [modules]);

  // Sync with parent data changes
  useEffect(() => {
    if (
      initialModules &&
      JSON.stringify(initialModules) !== JSON.stringify(modules)
    ) {
      setModules(initialModules);
    }
  }, [initialModules]);

  // TRPC mutations
  const updateOrderMutation = trpc.updateModulesOrders.useMutation({
    onSuccess: () => {
      maketoast.success("تم تحديث ترتيب المواد بنجاح");
    },
    onError: (error) => {
      console.error("Failed to update modules order:", error);
      maketoast.error("فشل في تحديث ترتيب المواد");
      // Revert to previous state
      if (initialModules) {
        setModules(initialModules);
      }
    },
  });

  const toggleModuleVisibility = trpc.toggleModuleVisibility?.useMutation({
    onSuccess: () => {
      maketoast.success("تم تحديث حالة المادة بنجاح");
    },
    onError: (error) => {
      console.error("Failed to toggle module visibility:", error);
      maketoast.error("فشل في تحديث حالة المادة");
    },
  });

  // Get module type icon
  const getModuleTypeIcon = useCallback((module: Module) => {
    const fileExtension = module.fileUrl?.split(".").pop()?.toLowerCase();
    const type = module.type?.toLowerCase();

    if (
      type === "video" ||
      ["mp4", "webm", "ogg", "avi", "mov"].includes(fileExtension || "")
    ) {
      return <Video className="h-4 w-4 text-blue-600" />;
    } else if (
      type === "document" ||
      ["pdf", "doc", "docx", "txt"].includes(fileExtension || "")
    ) {
      return <FileText className="h-4 w-4 text-green-600" />;
    } else if (
      type === "image" ||
      ["jpg", "jpeg", "png", "gif", "svg"].includes(fileExtension || "")
    ) {
      return <Image className="h-4 w-4 text-purple-600" />;
    } else {
      return <Play className="h-4 w-4 text-orange-600" />;
    }
  }, []);

  // Format duration
  const formatDuration = useCallback((duration?: number) => {
    if (!duration) return null;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  // Get module status badge
  const getModuleStatusBadge = useCallback((module: Module) => {
    if (module.isPublished === false) {
      return (
        <Badge variant="secondary" className="text-xs">
          مسودة
        </Badge>
      );
    }
    if (module.isFree) {
      return (
        <Badge variant="outline" className="text-xs text-green-600">
          مجاني
        </Badge>
      );
    }
    return null;
  }, []);

  // Optimized drag handlers
  const onDragStart = useCallback((start: any) => {
    setIsDragging(true);
    setDragStartIndex(start.source.index);
  }, []);

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
        const updatedModules = Array.from(modulesRef.current);
        const [reorderedItem] = updatedModules.splice(sourceIndex, 1);
        updatedModules.splice(destinationIndex, 0, reorderedItem);

        // Update positions
        const modulesWithPositions = updatedModules.map((module, index) => ({
          ...module,
          position: index,
        }));

        // Optimistic update
        setModules(modulesWithPositions);

        // Debounce the server update
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current);
        }

        updateTimeoutRef.current = setTimeout(() => {
          updateOrderMutation.mutate({
            chapterID,
            modules: modulesWithPositions,
          });
        }, 300);
      } catch (error) {
        console.error("Error during module drag operation:", error);
        maketoast.error("حدث خطأ أثناء إعادة ترتيب المواد");
      }
    },
    [chapterID, updateOrderMutation]
  );

  // Handle visibility toggle
  const handleVisibilityToggle = useCallback(
    (moduleId: string, currentVisibility: boolean) => {
      // Optimistic update
      setModules((prev) =>
        prev.map((module) =>
          module.id === moduleId
            ? { ...module, isPublished: !currentVisibility }
            : module
        )
      );

      if (toggleModuleVisibility) {
        toggleModuleVisibility.mutate({
          moduleId,
          isPublished: !currentVisibility,
        });
      }
    },
    [toggleModuleVisibility]
  );

  // Memoized sorted modules
  const sortedModules = useMemo(() => {
    return [...modules].sort((a, b) => (a.position || 0) - (b.position || 0));
  }, [modules]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  // Empty state
  if (sortedModules.length === 0) {
    return (
      <div className="mr-12 min-h-[60px] flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
        <p className="text-gray-500 text-sm">لا توجد مواد في هذا الفصل</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <Droppable droppableId={`modules-${chapterID}`} type="MODULE">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={cn(
                "mr-12 min-h-[10px] h-fit transition-all duration-200",
                snapshot.isDraggingOver && "bg-blue-50 rounded-lg p-2"
              )}
            >
              {sortedModules.map((module, index) => {
                const moduleIcon = getModuleTypeIcon(module);
                const statusBadge = getModuleStatusBadge(module);
                const duration = formatDuration(module.duration);
                const isHovered = hoveredModuleId === module.id;
                const isDragDisabled =
                  updateOrderMutation.isLoading ||
                  toggleModuleVisibility?.isLoading;

                return (
                  <Draggable
                    key={`${module.id || module.title}-${chapterID}`}
                    draggableId={`${module.id || module.title}-${chapterID}`}
                    index={index}
                    isDragDisabled={isDragDisabled}
                  >
                    {(provided, snapshot) => (
                      <div
                        className={cn(
                          "group flex items-center gap-x-3 bg-white border border-gray-200 h-fit min-h-[50px] justify-between rounded-lg my-2 p-3 text-sm transition-all duration-200 hover:shadow-sm",
                          snapshot.isDragging &&
                            "shadow-lg scale-105 rotate-1 z-50 bg-white",
                          dragStartIndex === index &&
                            !snapshot.isDragging &&
                            "scale-95",
                          !module.isPublished &&
                            "bg-gray-50 border-gray-300 opacity-75",
                          isHovered && "border-blue-300 bg-blue-50"
                        )}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        onMouseEnter={() => setHoveredModuleId(module.id)}
                        onMouseLeave={() => setHoveredModuleId(null)}
                      >
                        {/* Left side - Drag handle and content */}
                        <div className="flex items-center gap-x-3 flex-1 min-w-0">
                          {/* Drag Handle */}
                          <div
                            className={cn(
                              "flex-shrink-0 p-1 rounded cursor-grab active:cursor-grabbing transition-colors",
                              "hover:bg-gray-100 group-hover:bg-gray-100",
                              snapshot.isDragging && "cursor-grabbing",
                              isDragDisabled && "cursor-not-allowed opacity-50"
                            )}
                            {...provided.dragHandleProps}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 21 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="transition-opacity group-hover:opacity-80"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.51758 4.27791C6.51758 3.59749 7.06917 3.0459 7.74959 3.0459C8.43002 3.0459 8.98161 3.59749 8.98161 4.27791C8.98161 4.95834 8.43002 5.50993 7.74959 5.50993C7.06917 5.50993 6.51758 4.95834 6.51758 4.27791ZM6.51758 9.20597C6.51758 8.52554 7.06917 7.97396 7.74959 7.97396C8.43002 7.97396 8.98161 8.52554 8.98161 9.20597C8.98161 9.8864 8.43002 10.438 7.74959 10.438C7.06917 10.438 6.51758 9.8864 6.51758 9.20597ZM6.51758 14.134C6.51758 13.4536 7.06917 12.902 7.74959 12.902C8.43002 12.902 8.98161 13.4536 8.98161 14.134C8.98161 14.8145 8.43002 15.366 7.74959 15.366C7.06917 15.366 6.51758 14.8145 6.51758 14.134Z"
                                fill="#6B7280"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M11.9385 4.27791C11.9385 3.59749 12.49 3.0459 13.1705 3.0459C13.851 3.0459 14.4025 3.59749 14.4025 4.27791C14.4025 4.95834 13.851 5.50993 13.1705 5.50993C12.49 5.50993 11.9385 4.95834 11.9385 4.27791ZM11.9385 9.20597C11.9385 8.52554 12.49 7.97396 13.1705 7.97396C13.851 7.97396 14.4025 8.52554 14.4025 9.20597C14.4025 9.8864 13.851 10.438 13.1705 10.438C12.49 10.438 11.9385 9.8864 11.9385 9.20597ZM11.9385 14.134C11.9385 13.4536 12.49 12.902 13.1705 12.902C13.851 12.902 14.4025 13.4536 14.4025 14.134C14.4025 14.8145 13.851 15.366 13.1705 15.366C12.49 15.366 11.9385 14.8145 11.9385 14.134Z"
                                fill="#6B7280"
                              />
                            </svg>
                          </div>

                          {/* Module Icon */}
                          <div className="flex-shrink-0">{moduleIcon}</div>

                          {/* Module Number */}
                          <span className="flex-shrink-0 text-xs text-gray-500 font-medium min-w-[24px]">
                            #{index + 1}
                          </span>

                          {/* Module Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-x-2 mb-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link
                                    href={`/courses/${courseId}/chapters/${chapterID}/${module.fileUrl}/update-video`}
                                    className="text-gray-900 hover:text-blue-600 transition-colors duration-200 font-medium truncate flex-1"
                                  >
                                    {module.title || "مادة بدون عنوان"}
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{module.title}</p>
                                </TooltipContent>
                              </Tooltip>
                              <ExternalLink className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Module Metadata */}
                            <div className="flex items-center gap-x-2 text-xs text-gray-500">
                              {duration && (
                                <div className="flex items-center gap-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{duration}</span>
                                </div>
                              )}
                              {module.size && (
                                <span>
                                  {(module.size / 1024 / 1024).toFixed(1)} MB
                                </span>
                              )}
                              {module.views && (
                                <span>{module.views} مشاهدة</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right side - Badges and actions */}
                        <div className="flex items-center gap-x-2 flex-shrink-0">
                          {/* Status Badge */}
                          {statusBadge}

                          {/* Loading Indicator */}
                          {(updateOrderMutation.isLoading ||
                            toggleModuleVisibility?.isLoading) && (
                            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                          )}

                          {/* Actions Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                disabled={isDragDisabled}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">فتح القائمة</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/courses/${courseId}/chapters/${chapterID}/${module.fileUrl}/update-video`}
                                  className="flex items-center justify-end w-full"
                                >
                                  تعديل المادة
                                </Link>
                              </DropdownMenuItem>

                              {toggleModuleVisibility && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleVisibilityToggle(
                                        module.id,
                                        module.isPublished
                                      )
                                    }
                                    className="flex items-center justify-end gap-x-2"
                                  >
                                    {module.isPublished ? (
                                      <>
                                        <EyeOff className="h-4 w-4" />
                                        إخفاء المادة
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="h-4 w-4" />
                                        نشر المادة
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                </>
                              )}

                              {module.fileUrl && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem asChild>
                                    <a
                                      href={module.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center justify-end gap-x-2"
                                    >
                                      <Download className="h-4 w-4" />
                                      تحميل الملف
                                    </a>
                                  </DropdownMenuItem>
                                </>
                              )}

                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 hover:bg-red-50 flex items-center justify-end">
                                حذف المادة
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
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
    </TooltipProvider>
  );
};

export default ModulesList;
