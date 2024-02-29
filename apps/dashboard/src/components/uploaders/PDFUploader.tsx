"use client";

import * as React from "react";
import Dropzone from "react-dropzone";
import { Progress } from "@ui/components/ui/progress";
import { useUploadThing } from "@/src/lib/uploadthing";
import { cn, toast } from "@ui/lib/utils";
import { XCircle } from "lucide-react";
import { formatBytes } from "@/src/lib/utils";
import PdfRenderer from "../pdf-renderer";
import Image from "next/image";
import { Button } from "@ui/components/ui/button";
import { X } from "lucide-react";
import PdfDisplayModal from "../models/pdf-display";

export const PDFUploader = ({
  onChnage,
  fileUrl,
  className = "",
}: {
  fileUrl: string;
  onChnage: (value: any) => void;
  className?: string;
}) => {
  const [progress, setProgress] = React.useState<number>(0);
  const [status, setStatus] = React.useState<
    "WAITING" | "ERROR" | "COMPLETE" | "LOADING"
  >("WAITING");

  const [open, setOpen] = React.useState<boolean>(false);

  const { startUpload } = useUploadThing("imageUploader");

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
        return prevProgress + 5;
      });
    }, 500);

    return interval;
  };

  return (
    <>
      <PdfDisplayModal isOpen={open} setIsOpen={setOpen} fileUrl={fileUrl} />
      <Dropzone
        multiple={false}
        accept={{ "application/pdf": [".pdf"] }}
        onDrop={async (acceptedFile) => {
          if (acceptedFile.length === 0) {
            setStatus("ERROR");
            return;
          }
          setStatus("LOADING");

          const progressInterval = startSimulatedProgress();

          startUpload(acceptedFile)
            .then((res) => {
              if (!res) {
                setStatus("ERROR");
                toast("Something went wrong");
                return;
              }
              onChnage(res[0]?.serverData?.file?.url);
              clearInterval(progressInterval);
              setProgress(100);
              setStatus("COMPLETE");
            })
            .catch((err) => {
              console.error(err);

              setStatus("ERROR");
            });
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
              "group relative  my-8 grid h-48  w-full cursor-pointer  place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition bg-white hover:bg-muted/25",
              "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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
                          alt="pdf uploder"
                          src={"/pdf-uploader.png"}
                        />
                        <p className="mt-2 text-base font-medium text-muted-foreground">
                          اسحب و الملف المسقط هنا، أو انقر لتحديد الملف
                        </p>
                        <p className="text-sm text-slate-500">
                          يرجى تحميل الملف بحجم أقل من
                          {formatBytes(1024 * 1024 * 20)}
                        </p>
                      </div>
                    );
                  case "LOADING":
                    return (
                      <div className="w-full mt-4 flex flex-col mx-auto px-4 gap-y-4">
                        <Image
                          width={100}
                          height={100}
                          alt="pdf uploder"
                          src={"/pdf-uploader.png"}
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
                          alt="pdf uploder"
                          src={"/pdf-uploader.png"}
                        />
                        <p>تم تحميل الملف الخاص بك</p>
                        <span
                          onClick={() => setOpen(true)}
                          className="text-xl font-bold text-red-500"
                        >
                          {acceptedFiles[0]?.name}
                        </span>
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
    </>
  );
};
