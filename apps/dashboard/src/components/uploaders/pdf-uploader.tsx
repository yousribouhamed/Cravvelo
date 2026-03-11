"use client";

import * as React from "react";
import Dropzone from "react-dropzone";
import { UploadIcon } from "lucide-react";
import { Progress } from "@ui/components/ui/progress";
import { cn, toast } from "@ui/lib/utils";
import { XCircle } from "lucide-react";
import { formatBytes } from "@/src/lib/utils";
import { Button } from "@ui/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { computeSHA256 } from "@/src/lib/utils";
import { trpc } from "@/src/app/_trpc/client";
import { useTranslations } from "next-intl";
import { recordStorageUsed } from "@/src/actions/storage.actions";

export const PdfUploaderS3 = ({
  onChnage,
  fileUrl,
  className,
}: {
  fileUrl: string;
  className?: string;
  onChnage: (value: any) => void;
}) => {
  const t = useTranslations("productForms.pdfUploader");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const [progress, setProgress] = React.useState<number>(0);

  const [status, setStatus] = React.useState<
    "WAITING" | "ERROR" | "COMPLETE" | "LOADING"
  >("WAITING");

  const mutation = trpc.getSignedUrl.useMutation({
    onSuccess: async ({ success }) => {
      if (!selectedFile || !success?.url) {
        console.error("Missing file or signed URL");
        setStatus("ERROR");
        return;
      }

      try {
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000); // 5 minutes timeout

        const uploadResponse = await fetch(success.url, {
          method: "PUT",
          body: selectedFile,
          headers: {
            "Content-Type": selectedFile.type,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text().catch(() => "Unknown error");
          console.error("S3 upload failed:", uploadResponse.status, errorText);
          setStatus("ERROR");
          return;
        }

        // Extract public URL using proper URL parsing
        const signedUrlObj = new URL(success.url);
        const publicUrl = `${signedUrlObj.origin}${signedUrlObj.pathname}`;

        onChnage(publicUrl);
        setProgress(100);
        setStatus("COMPLETE");
        await recordStorageUsed({ fileSizeInBytes: selectedFile.size });
      } catch (error: any) {
        console.error("Upload error:", error);
        
        if (error.name === 'AbortError') {
          console.error("Upload timeout");
        }
        
        setStatus("ERROR");
      }
    },
    onError: (err) => {
      console.error("Failed to get signed URL:", err);
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
      accept={{ "application/pdf": [".pdf"] }}
      onDrop={async (acceptedFile) => {
        if (acceptedFile.length === 0) {
          setStatus("ERROR");
          return;
        }
        setStatus("LOADING");
        setSelectedFile(acceptedFile[0]);
        const progressInterval = startSimulatedProgress();
        // here hanle sending the request to s3
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
        acceptedFiles,
        fileRejections,
        isDragReject,
        isDragActive,
        isFocused,
      }) => (
        <div
          {...getRootProps()}
          className={cn(
            "group relative my-8 grid h-48 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition bg-card hover:bg-muted/25",
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
              <p className="mb-2 text-sm text-foreground">
                <span className="font-semibold mx-2 text-red-500">
                  {t("fileRejected")}
                </span>
                <br />
                {t("pleaseUploadPdf")}
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
                        {t("dragDropText")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t("fileSizeNote")} {formatBytes(1024 * 1024 * 2)}
                      </p>
                    </div>
                  );
                case "LOADING":
                  return (
                    <div className="w-full mt-4 flex flex-col mx-auto px-4 gap-y-4">
                      <p className="text-xl font-bold text-foreground">{t("uploading")}</p>
                      <Progress
                        value={progress}
                        className="h-1 w-full bg-muted"
                      />
                    </div>
                  );
                case "COMPLETE":
                  return (
                    <div className="relative w-full h-full flex items-center justify-center gap-x-4 ">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-0 text-foreground rounded-[50%] hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setStatus("WAITING");
                          setSelectedFile(null);
                          onChnage("");
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <div className="w-[140px] h-[140px] relative">
                        {fileUrl && (
                          <Image
                            fill
                            alt="PDF file"
                            src={"/pdf-image.png"}
                          />
                        )}
                      </div>
                      <div className="flex flex-col gap-y-4 items-start">
                        <span className="text-xl text-foreground">
                          {t("fileUploaded")}
                        </span>
                        {fileUrl && (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {t("viewFile")}
                          </a>
                        )}
                      </div>
                    </div>
                  );

                case "ERROR":
                  return (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <XCircle className="h-8 w-8 text-red-500 mb-2" />
                      <p className="mb-2 text-sm text-foreground">
                        <span className="font-semibold mx-2 text-red-500">
                          {t("errorOccurred")}
                        </span>
                        {t("pleaseTryAgain")}
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
