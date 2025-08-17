"use client";

import * as React from "react";
import Dropzone from "react-dropzone";
import { UploadIcon, Trash2, XCircle } from "lucide-react";
import { Progress } from "@ui/components/ui/progress";
import { cn } from "@ui/lib/utils";
import { formatBytes, computeSHA256 } from "@/src/lib/utils";
import { Button } from "@ui/components/ui/button";
import { trpc } from "@/src/app/_trpc/client";

export const ImageUploaderS3 = ({
  onChnage,
  fileUrl,
  className,
}: {
  fileUrl: string;
  className?: string;
  onChnage: (value: any) => void;
}) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [progress, setProgress] = React.useState<number>(0);
  const [status, setStatus] = React.useState<
    "WAITING" | "ERROR" | "COMPLETE" | "LOADING"
  >("WAITING");

  const mutation = trpc.getSignedUrl.useMutation({
    onSuccess: async ({ success }) => {
      if (!selectedFile || !success?.url) {
        setStatus("ERROR");
        return;
      }

      await fetch(success.url, {
        method: "put",
        body: selectedFile,
        headers: {
          "content-type": selectedFile.type,
        },
      });

      onChnage(success.url.split("?")[0]);
      setProgress(100);
      setStatus("COMPLETE");
    },
    onError: (err) => {
      console.error(err);
      setStatus("ERROR");
    },
  });

  React.useEffect(() => {
    if (fileUrl) {
      setStatus("COMPLETE");
    } else {
      setStatus("WAITING");
    }
  }, [fileUrl]);

  const startSimulatedProgress = () => {
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 2.5;
      });
    }, 500);

    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      accept={{ "image/*": [".jpeg", ".png"] }}
      onDrop={async (acceptedFile) => {
        if (acceptedFile.length === 0) {
          setStatus("ERROR");
          return;
        }
        setStatus("LOADING");
        setSelectedFile(acceptedFile[0]);
        const progressInterval = startSimulatedProgress();

        const checksum = await computeSHA256(acceptedFile[0]);
        await mutation.mutateAsync({
          fileSize: acceptedFile[0].size,
          fileType: acceptedFile[0].type,
          checksum,
        });

        clearInterval(progressInterval);
      }}
    >
      {({
        getRootProps,
        getInputProps,
        fileRejections,
        isDragReject,
        isDragActive,
        isFocused,
      }) => (
        <div
          {...getRootProps()}
          className={cn(
            "group relative my-8 grid h-48 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition",
            "bg-white dark:dark:bg-[#0A0A0C] hover:bg-muted/25 text-black",
            "dark:bg-[#0A0A0C] dark:hover:bg-zinc-900 dark:text-zinc-50",
            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isDragActive && "border-muted-foreground/50",
            isFocused && "border-primary",
            isDragReject && "border-red-500",
            className
          )}
        >
          <input {...getInputProps()} className="hidden" />

          {/* === FILE REJECTED === */}
          {isDragReject || fileRejections?.length > 0 ? (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <XCircle className="h-8 w-8 text-red-500 mb-2" />
              <p className="mb-2 text-sm text-zinc-700 dark:text-zinc-200">
                <span className="font-semibold mx-2 text-red-500">
                  هذا الملف غير مقبول
                </span>
                <br />
                الرجاء ادخال ملفات بصيغة png , jpeg
              </p>
            </div>
          ) : (
            (() => {
              switch (status) {
                case "WAITING":
                  return (
                    <div className="grid place-items-center gap-1 sm:px-5">
                      <UploadIcon
                        className="h-8 w-8 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <p className="mt-2 text-base font-medium text-muted-foreground">
                        اسحب وأسقط الملف هنا، أو انقر لتحديد الملف
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        يرجى تحميل الملف بحجم أقل من{" "}
                        {formatBytes(1024 * 1024 * 2)}
                      </p>
                    </div>
                  );

                case "LOADING":
                  return (
                    <div className="w-full mt-4 flex flex-col mx-auto px-4 gap-y-4">
                      <p className="text-xl font-bold dark:text-zinc-100">
                        جاري رفع الصورة...
                      </p>
                      <Progress
                        value={progress}
                        className="h-1 w-full bg-[#EFEFEF] dark:bg-zinc-800"
                      />
                    </div>
                  );

                case "COMPLETE":
                  return (
                    <div className="relative w-full h-full flex items-center justify-center gap-x-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-0 text-black dark:text-white rounded-[50%] bg-white dark:bg-zinc-800 shadow border cursor-pointer"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setStatus("WAITING");
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-black dark:text-white" />
                      </Button>
                      <div className="w-[250px] h-[150px] border shadow rounded-xl relative bg-white dark:bg-zinc-900">
                        {fileUrl && (
                          <img
                            alt="course image"
                            className="w-full h-full object-cover rounded-xl"
                            src={fileUrl}
                          />
                        )}
                      </div>
                    </div>
                  );

                case "ERROR":
                  return (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <XCircle className="h-8 w-8 text-red-500 mb-2" />
                      <p className="mb-2 text-sm text-zinc-700 dark:text-zinc-200">
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
