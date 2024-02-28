"use client";

import type { FC } from "react";
import Dropzone from "react-dropzone";
import { Progress } from "@ui/components/ui/progress";
import React, { useState } from "react";
import { VideoUploader } from "@api.video/video-uploader";
import { XCircle } from "lucide-react";
import { trpc } from "@/src/app/_trpc/client";
import { cn } from "@ui/lib/utils";
import Image from "next/image";
import ApiVideoPlayer from "@api.video/react-player";

interface VedioUploaderProps {
  onChange: (onChange: string) => void;
  className?: string;
}

const VedioUploader: FC<VedioUploaderProps> = ({ onChange, className }) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  // const [videoId, setVideoId] = useState<string | undefined>(undefined);

  const [status, setStatus] = React.useState<
    "WAITING" | "ERROR" | "COMPLETE" | "LOADING"
  >("WAITING");

  const [isError, setIsError] = useState<boolean>(false);

  const [videoId, setVideoId] = useState<string>("");

  const mutation = trpc.onVedioUpload.useMutation({
    onSuccess: ({ success, videoId }) => {
      if (success) {
        onChange(videoId);
        setVideoId(videoId);
        setStatus("COMPLETE");

        console.log("this is the video player");
        console.log(videoId);
      }
    },
    onError: () => {
      setIsError(true);
    },
  });

  return (
    <Dropzone
      multiple={false}
      accept={{ "video/mp4": [".mp4", ".mpeg", ".quicktime"] }}
      onDrop={async (acceptedFile) => {
        try {
          if (acceptedFile.length === 0) {
            setStatus("ERROR");
            return;
          }
          setStatus("LOADING");
          setIsUploading(true);

          const videoUploader = new VideoUploader({
            uploadToken: process.env["NEXT_PUBLIC_UPLOAD_TOKEN"] ?? "",
            file: acceptedFile[0],
          });
          videoUploader.onProgress((e) =>
            setProgress(Math.round((e.uploadedBytes * 100) / e.totalBytes))
          );
          videoUploader.onPlayable(async (e) => {
            await mutation.mutateAsync({
              videoId: e.videoId,
            });
            onChange(e.videoId);
          });

          await videoUploader.upload();
        } catch (error) {
          console.error("Error trying to upload a video:", error);
          setIsError(true);
          setStatus("ERROR");
        } finally {
          setIsUploading(false);
        }
      }}
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
            "group relative  my-8 grid h-[250px]  w-full cursor-pointer  place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition bg-white hover:bg-muted/25",
            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-300",
            isDragActive && "border-muted-foreground/50",
            isFocused && "border-blue-500",
            isDragReject && "border-red-500",
            className
          )}
        >
          <input {...getInputProps()} className="hidden" />
          {isDragReject || fileRejections?.length > 0 ? (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <XCircle className="h-8 w-8 text-red-500 mb-2" />
              <p className="mb-2 text-sm text-zinc-700 dark:text-zinc-50">
                <span className="font-semibold mx-2 text-red-500">
                  هذا الملف غير مقبول
                </span>
                <br />
                الرجاء ادخال ملفات بصيغة pdf
              </p>
            </div>
          ) : (
            (() => {
              switch (status) {
                case "WAITING":
                  return (
                    <div className="grid place-items-center gap-1 sm:px-5">
                      <Image
                        width={100}
                        height={100}
                        alt="video uploder"
                        src={"/video.png"}
                      />
                      <p className="mt-2 text-base font-medium text-muted-foreground">
                        اسحب و اسقط الملف هنا او اضغط لاختيار الملف
                      </p>
                      <p className="text-sm text-slate-500">
                        يرجى تحميل الملف بحجم أقل من 1G
                      </p>
                    </div>
                  );
                case "LOADING":
                  return (
                    <div className="w-full mt-4 flex flex-col mx-auto px-4 gap-y-4">
                      <Image
                        width={100}
                        height={100}
                        alt="video uploder"
                        src={"/video.png"}
                      />
                      <p className="text-xl font-bold ">تحميل...</p>
                      <Progress
                        value={progress}
                        className="h-1 w-full bg-[#EFEFEF]"
                      />
                    </div>
                  );
                case "COMPLETE":
                  return (
                    <div>
                      {videoId && (
                        <ApiVideoPlayer
                          video={{
                            id: videoId,
                          }}
                          style={{ width: "100%", height: "100%" }}
                          // theme={{
                          //   text: "#ffffff",
                          //   link: "#ffffff",
                          //   linkHover: "#3b82f6",
                          //   trackPlayed: "#3b82f6",
                          //   trackUnplayed: "#ffffff",
                          //   trackBackground: "#3b82f6",
                          //   backgroundTop: "#3b82f6",
                          //   backgroundBottom: "#3b82f6",
                          //   backgroundText: "#ffffff",
                          // }}
                        />
                      )}
                    </div>
                  );

                case "ERROR":
                  return (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <XCircle className="h-8 w-8 text-red-500 mb-2" />
                      <p className="mb-2 text-sm text-zinc-700 dark:text-zinc-50">
                        <span className="font-semibold mx-2 text-red-500">
                          هناك خطأ ما
                        </span>
                        يرجى إعادة المحاولة مرة أخرى
                      </p>
                    </div>
                  );
                default:
                  return <div>Default case</div>;
              }
            })()
          )}
        </div>
      )}
    </Dropzone>
  );
};

export default VedioUploader;
