"use client";

import * as React from "react";
import Dropzone from "react-dropzone";
import { Cloud, File } from "lucide-react";
import { Progress } from "@ui/components/ui/progress";
import { useUploadThing } from "@/src/lib/uploadthing";
import { toast } from "@ui/lib/utils";
import { XCircle } from "lucide-react";

export const ImageUploader = ({
  onChnage,
  fileUrl,
}: {
  fileUrl: string;
  onChnage: (value: any) => void;
}) => {
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState<number>(0);
  const [isError, setIsError] = React.useState<boolean>(false);

  const { startUpload } = useUploadThing("imageUploader");

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
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFile) => {
        setIsUploading(true);

        const progressInterval = startSimulatedProgress();

        startUpload(acceptedFile)
          .then((res) => {
            if (!res) {
              setIsError(true);
              toast("Something went wrong");
              return;
            }
            onChnage(res[0]?.serverData?.file?.url);
            clearInterval(progressInterval);
            setProgress(100);
          })
          .catch((err) => {
            console.error(err);
            setIsError(true);
          });
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64  border-dashed border-gray-300 dark:border-black rounded-lg  overflow-hidden"
        >
          <div className="flex items-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col  items-center justify-center w-full h-full rounded-lg cursor-pointer bg-white hover:bg-gray-200 dark:bg-black hover:bg-white/10"
            >
              {isError && (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <XCircle className="h-8 w-8 text-red-500 mb-2" />
                  <p className="mb-2 text-sm text-zinc-700 dark:text-zinc-50">
                    <span className="font-semibold mx-2 text-red-500">
                      هناك خطأ ما
                    </span>
                    يرجى إعادة المحاولة مرة أخرى
                  </p>
                </div>
              )}

              {!isError && (
                <>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Cloud className="text-zinc-700  dark:text-zinc-50 w-8 h-8 mb-12" />
                    <p className="mb-2 text-sm text-zinc-700 dark:text-zinc-50">
                      <span className="font-semibold">انقر للتحميل</span> أو
                      اسحب وإسقاط
                    </p>
                  </div>

                  {acceptedFiles && acceptedFiles[0] ? (
                    <div className="max-w-xs bg-white dark:bg-black flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                      <div className="px-3 py-2 h-full grid place-items-center">
                        <File className="h-4 w-4 text-orange-500" />
                      </div>
                      <div className="px-3 py-2 h-full text-sm truncate">
                        {acceptedFiles[0].name}
                      </div>
                    </div>
                  ) : null}

                  {isUploading ? (
                    <div className="w-full mt-4  mx-auto">
                      <Progress
                        value={progress}
                        className="h-1 w-full bg-[#EFEFEF]"
                      />
                    </div>
                  ) : null}

                  {progress === 100 ? (
                    <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 dark:text-zinc-50 text-center pt-2">
                      <img
                        className="w-full object-cover m-4 "
                        src={URL.createObjectURL(acceptedFiles[0])}
                      />
                      <p className="text-xl font-bold my-2 text-center ">
                        {" "}
                        تم تحميل الملف
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 dark:text-zinc-50 text-center w-full relative pt-2">
                      <img
                        className="w-full object-contain m-4 "
                        src={fileUrl}
                      />
                    </div>
                  )}

                  <input
                    {...getInputProps()}
                    type="file"
                    id="dropzone-file"
                    className="hidden"
                  />
                </>
              )}
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};
