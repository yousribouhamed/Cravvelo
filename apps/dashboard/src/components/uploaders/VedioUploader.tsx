"use client";

import type { FC } from "react";
import Dropzone from "react-dropzone";
import { Cloud, File, Upload, VideoIcon } from "lucide-react";
import { Progress } from "@ui/components/ui/progress";
import { useState } from "react";
import { VideoUploader } from "@api.video/video-uploader";
import { XCircle } from "lucide-react";

interface VedioUploaderProps {
  onChange: (onChange: string) => void;
}

const VedioUploader: FC<VedioUploaderProps> = ({ onChange }) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  // const [videoId, setVideoId] = useState<string | undefined>(undefined);
  const [isError, setIsError] = useState<boolean>(false);

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFile) => {
        try {
          setIsUploading(true);

          const videoUploader = new VideoUploader({
            uploadToken: process.env["NEXT_PUBLIC_UPLOAD_TOKEN"] ?? "",
            file: acceptedFile[0],
          });
          videoUploader.onProgress((e) =>
            setProgress(Math.round((e.uploadedBytes * 100) / e.totalBytes))
          );
          videoUploader.onPlayable((e) => {
            console.log(e);
            onChange(e.videoId);
          });

          await videoUploader.upload();
        } catch (error) {
          console.error("Error trying to upload a video:", error);
          setIsError(true);
        } finally {
          setIsUploading(false);
        }
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-white hover:bg-gray-200"
            >
              {isError && (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <XCircle className="h-8 w-8 text-red-500 mb-2" />
                  <p className="mb-2 text-sm text-zinc-700">
                    <span className="font-semibold mx-2 text-red-500">
                      هناك خطأ ما
                    </span>
                    يرجى إعادة المحاولة مرة أخرى
                  </p>
                </div>
              )}

              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    //@ts-ignore
                    indicatorColor={progress === 100 ? "bg-green-500" : ""}
                    value={progress}
                    className="h-1 w-full bg-[#EFEFEF]"
                  />
                  {progress === 100 ? (
                    <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                      تم تحميل الملف
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="w-full mt-4 max-w-xs mx-auto flex flex-col items-center justify-center gap-4">
                  <Upload className="w-5 h-5" />
                  <span className="text-xl font-semibold text-center text-gray-500">
                    قم بسحب وإسقاط الفيديو الخاص بك هنا
                  </span>
                </div>
              )}
              {progress === 100 ? (
                <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                  <VideoIcon className="w-6 h-6 mx-4 " />
                  <span className="text-lg  font-semibold">
                    {" "}
                    تم تحميل الملف
                  </span>
                </div>
              ) : null}
              <input
                {...getInputProps()}
                type="file"
                disabled={isUploading}
                id="dropzone-file"
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default VedioUploader;
