"use client";

import * as React from "react";
import Dropzone from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import { Progress } from "@ui/components/ui/progress";
import axios from "axios";
import { cn } from "@ui/lib/utils";
import { XCircle } from "lucide-react";
import { Button } from "@ui/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";

export const NewVideoUploader = ({
  onChange,
  initialVideoId,
  className,
  open,
  setOpen,
  setVideoSize,
}: {
  onChange: (onChange: string) => void;
  className?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialVideoId?: string;
  setVideoSize?: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);

  const [message, setMessage] = React.useState<string>("");

  const [status, setStatus] = React.useState<
    "WAITING" | "ERROR" | "COMPLETE" | "LOADING"
  >("WAITING");

  const createVideo = async ({ title }: { title: string }): Promise<string> => {
    const options = {
      method: "POST",
      url: `https://video.bunnycdn.com/library/${process.env["NEXT_PUBLIC_VIDEO_LIBRARY"]}/videos`,
      headers: {
        accept: "application/json",
        "content-type": "application/*+json",
        AccessKey: process.env["NEXT_PUBLIC_BUNNY_API_KEY"],
      },
      data: '{"title":"inchalah it will work"}',
    };

    try {
      const response = await axios.request(options);
      return response.data?.guid;
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    if (initialVideoId) {
      setStatus("COMPLETE");
    } else {
      setStatus("WAITING");
    }
  }, [initialVideoId]);

  const startSimulatedProgress = () => {
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }

        return prevProgress + 2;
      });
    }, 1000);

    return interval;
  };

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

          const progressInterval = startSimulatedProgress();
          const fileReader = new FileReader();
          fileReader.onload = async () => {
            const fileBinaryData = fileReader.result as ArrayBuffer;
            setStatus("LOADING");

            const videoObjectId = await createVideo({ title: uuidv4() });

            const uploadUrl = `https://video.bunnycdn.com/library/${process.env["NEXT_PUBLIC_VIDEO_LIBRARY"]}/videos/${videoObjectId}`;
            const response = await axios.put(uploadUrl, fileBinaryData, {
              headers: {
                "Content-Type": "application/octet-stream",
                AccessKey: process.env["NEXT_PUBLIC_BUNNY_API_KEY"],
              },
            });

            clearInterval(progressInterval);
            onChange(videoObjectId);
            setProgress(100);
            setStatus("COMPLETE");
          };
          fileReader.onerror = () => {
            setStatus("ERROR");
          };
          fileReader.readAsArrayBuffer(acceptedFile[0]);
        } catch (err) {
          console.error(err);
          setStatus("ERROR");
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
            isFocused && "border-primary",
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
                الرجاء ادخال ملفات بصيغة الفيديو
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
                    <div className="w-full mt-4 flex flex-col items-center mx-auto px-4 gap-y-4">
                      <Image
                        width={100}
                        height={100}
                        alt="video uploder"
                        src={"/video.png"}
                      />
                      <p className="text-xl font-bold ">جاري رفع الفيديو...</p>
                      <Progress
                        value={progress}
                        className="h-1 w-full bg-[#EFEFEF]"
                      />
                    </div>
                  );
                case "COMPLETE":
                  return (
                    <div className="relative w-full h-full flex items-center justify-center flex-col gap-y-1 ">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-0 text-black rounded-[50%] hover:bg-black hover:text-white cursor-pointer "
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setStatus("WAITING");
                        }}
                      >
                        <X className="w-4 h-4 " />
                      </Button>

                      <Image
                        width={100}
                        height={100}
                        alt="video uploder"
                        src={"/video.png"}
                      />
                      <p>تم تحميل الفيديو الخاص بك</p>
                      <span className="text-xl font-bold text-blue-500">
                        {acceptedFiles[0] && acceptedFiles[0]?.name}
                      </span>
                      <div>
                        <span className="text-lg text-gray-500">
                          يمكنك معاينة الفيديو من{" "}
                          <span
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              setOpen(true);
                            }}
                            className="text-primary font-bold"
                          >
                            هنا
                          </span>
                        </span>
                      </div>
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
