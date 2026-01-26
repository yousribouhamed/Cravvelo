"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("courses.videoUploader");
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
            setDragError(t("errors.fileTooLarge"));
          } else if (
            rejection.errors.some((e) => e.code === "file-invalid-type")
          ) {
            setDragError(t("errors.invalidType"));
          } else {
            setDragError(t("errors.fileError"));
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
            "group relative my-8 grid h-[250px] w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition bg-card hover:bg-muted/25 dark:hover:bg-muted/50",
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
                  {dragError || t("errors.fileNotAccepted")}
                </span>
                <br />
                {t("errors.pleaseEnterValid")}
              </p>
            </div>
          ) : (
            (() => {
              if (isGeneratingUrl) {
                return (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-blue-500 dark:text-blue-400 dark:group-hover:text-white animate-pulse transition-colors duration-200" />
                    <p className="text-base font-medium text-muted-foreground">
                      {t("preparing")}
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
                      <p className="text-lg font-bold text-foreground">{t("uploading")}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedVideo.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">
                        {formatFileSize(selectedVideo.file.size)}
                      </p>
                    </div>
                    <div className="w-full">
                      <Progress
                        value={uploadProgress}
                        className="h-2 w-full bg-gray-200 dark:bg-gray-700"
                      />
                      <p className="text-center text-sm mt-1 text-foreground">
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
                      className="absolute top-0 right-0 text-foreground rounded-full bg-card dark:bg-gray-800 shadow border dark:border-gray-700 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onRemove();
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>

                    <CheckCircle className="w-12 h-12 text-green-500 dark:text-green-400 mb-2" />
                    <p className="text-green-600 dark:text-green-400 font-semibold">
                      {t("videoSelected")}
                    </p>

                    <div className="text-center space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {selectedVideo.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-gray-400">
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
                      {t("previewVideo")}
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
                    {t("dragDropText")}
                  </p>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    {t("fileSizeNote")}
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-gray-500">
                    {t("supportedFormats")}
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
