"use client";

import * as React from "react";
import Dropzone from "react-dropzone";
import { Progress } from "@ui/components/ui/progress";
import { cn } from "@ui/lib/utils";
import { Trash2, XCircle, Eye, Upload, CheckCircle } from "lucide-react";
import { Button } from "@ui/components/ui/button";
import Image from "next/image";

interface VideoUploadData {
  file: File;
  videoId: string;
  uploadUrl: string;
  duration?: number;
}

interface EnhancedVideoUploaderProps {
  onVideoSelect: (file: File) => void;
  selectedVideo: VideoUploadData | null;
  isGeneratingUrl: boolean;
  onPreview: () => void;
  onRemove: () => void;
  uploadProgress: number;
  isUploading: boolean;
  className?: string;
}

export const EnhancedVideoUploader: React.FC<EnhancedVideoUploaderProps> = ({
  onVideoSelect,
  selectedVideo,
  isGeneratingUrl,
  onPreview,
  onRemove,
  uploadProgress,
  isUploading,
  className,
}) => {
  const [dragError, setDragError] = React.useState<string>("");

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dropzone
      multiple={false}
      accept={{
        "video/mp4": [".mp4"],
        "video/quicktime": [".mov"],
        "video/x-msvideo": [".avi"],
      }}
      maxSize={1024 * 1024 * 1024} // 1GB
      onDrop={async (acceptedFiles, rejectedFiles) => {
        setDragError("");

        if (rejectedFiles.length > 0) {
          const rejection = rejectedFiles[0];
          if (rejection.errors.some((e) => e.code === "file-too-large")) {
            setDragError("حجم الملف كبير جداً. الحد الأقصى 1GB");
          } else if (
            rejection.errors.some((e) => e.code === "file-invalid-type")
          ) {
            setDragError("نوع الملف غير مدعوم. يرجى استخدام MP4, MOV, أو AVI");
          } else {
            setDragError("هناك خطأ في الملف المحدد");
          }
          return;
        }

        if (acceptedFiles.length > 0) {
          onVideoSelect(acceptedFiles[0]);
        }
      }}
      disabled={isGeneratingUrl || isUploading}
    >
      {({
        getRootProps,
        getInputProps,
        acceptedFiles,
        fileRejections,
        isDragReject,
        isDragActive,
        isFocused,
      }) => (
        <div
          {...getRootProps()}
          className={cn(
            "group relative my-8 grid h-[250px] w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition bg-white hover:bg-muted/25",
            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300",
            isDragActive && "border-muted-foreground/50",
            isFocused && "border-primary",
            (isDragReject || dragError) && "border-red-500",
            (isGeneratingUrl || isUploading) && "cursor-not-allowed opacity-50",
            className
          )}
        >
          <input {...getInputProps()} className="hidden" />

          {isDragReject || dragError ? (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <XCircle className="h-8 w-8 text-red-500 mb-2" />
              <p className="mb-2 text-sm text-zinc-700 dark:text-zinc-50">
                <span className="font-semibold mx-2 text-red-500">
                  {dragError || "هذا الملف غير مقبول"}
                </span>
                <br />
                الرجاء ادخال ملفات فيديو صحيحة
              </p>
            </div>
          ) : (
            (() => {
              if (isGeneratingUrl) {
                return (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-blue-500 animate-pulse" />
                    <p className="text-base font-medium text-muted-foreground">
                      جاري تحضير رفع الفيديو...
                    </p>
                  </div>
                );
              }

              if (isUploading && selectedVideo) {
                return (
                  <div className="w-full mt-4 flex flex-col items-center mx-auto px-4 gap-y-4">
                    <Image
                      width={80}
                      height={80}
                      alt="video upload"
                      src="/video.png"
                    />
                    <div className="text-center">
                      <p className="text-lg font-bold">جاري رفع الفيديو...</p>
                      <p className="text-sm text-gray-600">
                        {selectedVideo.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(selectedVideo.file.size)}
                      </p>
                    </div>
                    <div className="w-full">
                      <Progress
                        value={uploadProgress}
                        className="h-2 w-full bg-gray-200"
                      />
                      <p className="text-center text-sm mt-1">
                        {uploadProgress}%
                      </p>
                    </div>
                  </div>
                );
              }

              if (selectedVideo && !isUploading) {
                return (
                  <div className="relative w-full h-full flex items-center justify-center flex-col gap-y-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 text-black rounded-full bg-white shadow border cursor-pointer hover:bg-red-50"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onRemove();
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>

                    <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
                    <p className="text-green-600 font-semibold">
                      تم اختيار الفيديو
                    </p>

                    <div className="text-center space-y-1">
                      <p className="text-sm font-medium text-gray-700">
                        {selectedVideo.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(selectedVideo.file.size)}
                        {selectedVideo.duration &&
                          ` • ${formatDuration(selectedVideo.duration)}`}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onPreview();
                      }}
                      className="mt-2"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      معاينة الفيديو
                    </Button>
                  </div>
                );
              }

              return (
                <div className="grid place-items-center gap-1 sm:px-5">
                  <Image
                    width={100}
                    height={100}
                    alt="video uploader"
                    src="/video.png"
                  />
                  <p className="mt-2 text-base font-medium text-muted-foreground">
                    اسحب و اسقط الملف هنا او اضغط لاختيار الملف
                  </p>
                  <p className="text-sm text-slate-500">
                    يرجى تحميل الملف بحجم أقل من 1GB
                  </p>
                  <p className="text-xs text-slate-400">
                    الصيغ المدعومة: MP4, MOV, AVI
                  </p>
                </div>
              );
            })()
          )}
        </div>
      )}
    </Dropzone>
  );
};
