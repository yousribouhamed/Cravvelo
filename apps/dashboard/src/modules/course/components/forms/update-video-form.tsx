"use client";

import { z } from "@/src/lib/zod-error-map";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { trpc } from "@/src/app/_trpc/client";
import { Button } from "@ui/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { Card, CardContent } from "@ui/components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import { getValueFromUrl } from "@/src/lib/utils";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { maketoast } from "@/src/components/toasts";
import { VideoPlayer } from "@/src/components/models/video-player";
import { Module } from "@/src/types";
import { EnhancedVideoUploader } from "@/src/modules/course/components/upload/video-uploader";
import { VideoValidation } from "@/src/modules/course/validation";
import { useUploadProgress } from "@/src/modules/course/hooks";
import { useVideoUploadError } from "@/src/modules/course/hooks";
import axios from "axios";

const updateVedioSchema = z.object({
  title: z.string({ required_error: "يرجى ملئ الحقل" }).min(2).max(50),
  content: z.any(),
  fileUrl: z.string({ required_error: "يرجى ملئ الحقل" }),
  videoFile: z.any().optional(),
});

interface UpdateVedioFormProps {
  material: Module;
  courseId: string;
}

function UpdateVedioForm({ material, courseId }: UpdateVedioFormProps) {
  const router = useRouter();
  const path = usePathname();
  const chapterID = getValueFromUrl(path, 4);
  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = React.useState<File | null>(null);
  const [videoDuration, setVideoDuration] = React.useState<number>(0);
  const [isReplacingVideo, setIsReplacingVideo] =
    React.useState<boolean>(false);

  const { error: uploadError, handleError, clearError } = useVideoUploadError();
  const {
    progress: uploadProgress,
    status: uploadStatus,
    updateProgress,
    setUploadStatus,
    reset: resetProgress,
  } = useUploadProgress();

  const delete_mutation = trpc.deleteMaterial.useMutation({
    onSuccess: () => {
      maketoast.success("تم حذف المادة بنجاح");
      router.back();
    },
    onError: (error) => {
      maketoast.error("فشل في حذف المادة");
      console.error(error);
    },
  });

  // Use the new update mutation
  const mutation = trpc.updateModuleVideo.useMutation({
    onSuccess: (data) => {
      maketoast.success("تم تحديث الفيديو بنجاح");
      setUploadStatus("completed");

      router.push(`/courses/${courseId}/chapters`);
    },
    onError: (error) => {
      maketoast.error("فشل في تحديث الفيديو");
      setUploadStatus("error");
      console.error(error);
    },
  });

  const form = useForm<z.infer<typeof updateVedioSchema>>({
    mode: "onChange",
    resolver: zodResolver(updateVedioSchema),
    defaultValues: {
      title: material.title,
      fileUrl: material.fileUrl,
      content: JSON.parse(material?.content || "{}"),
    },
  });

  const handleVideoSelect = async (file: File) => {
    try {
      clearError();

      // Validate file
      const validation = VideoValidation.validateFile(file);
      if (!validation.valid) {
        handleError(validation.error || "ملف غير صالح");
        return;
      }

      // Get video duration
      let duration = 0;
      try {
        duration = await VideoValidation.getVideoDuration(file);
        setVideoDuration(duration);
      } catch (durationError) {
        console.warn("Could not get video duration:", durationError);
      }

      setSelectedVideo(file);
      setIsReplacingVideo(true);
      form.setValue("videoFile", file);
    } catch (error) {
      handleError(error, "فشل في تحضير الفيديو");
      maketoast.error("فشل في تحضير الفيديو");
    }
  };

  const uploadVideoDirectly = async (
    file: File,
    title: string
  ): Promise<string> => {
    const libraryId = process.env.NEXT_PUBLIC_VIDEO_LIBRARY;
    const apiKey = process.env.NEXT_PUBLIC_BUNNY_API_KEY;

    if (!libraryId || !apiKey) {
      throw new Error("Missing Bunny CDN configuration");
    }

    updateProgress(5);

    try {
      // Step 1: Create video object
      console.log("Creating video object...");

      const createOptions = {
        method: "POST",
        url: `https://video.bunnycdn.com/library/${libraryId}/videos`,
        headers: {
          accept: "application/json",
          "content-type": "application/*+json",
          AccessKey: apiKey,
        },
        data: JSON.stringify({ title: title }),
      };

      const createResponse = await axios.request(createOptions);
      const videoId = createResponse.data?.guid;

      if (!videoId) {
        throw new Error("Failed to get video ID from create response");
      }

      console.log("Video object created successfully:", videoId);
      updateProgress(10);

      // Step 2: Convert file to ArrayBuffer
      console.log("Converting file to ArrayBuffer...");

      const fileBinaryData = await new Promise<ArrayBuffer>(
        (resolve, reject) => {
          const fileReader = new FileReader();

          fileReader.onload = () => {
            resolve(fileReader.result as ArrayBuffer);
          };

          fileReader.onerror = () => {
            reject(new Error("Failed to read file"));
          };

          fileReader.readAsArrayBuffer(file);
        }
      );

      updateProgress(15);

      // Step 3: Upload using axios
      console.log("Starting file upload with axios...");

      const uploadUrl = `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`;

      const uploadResponse = await axios.put(uploadUrl, fileBinaryData, {
        headers: {
          "Content-Type": "application/octet-stream",
          AccessKey: apiKey,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress =
              Math.round((progressEvent.loaded / progressEvent.total) * 80) +
              15; // 15-95%
            updateProgress(progress);
          }
        },
        timeout: 30 * 60 * 1000, // 30 minutes timeout
      });

      if (uploadResponse.status >= 200 && uploadResponse.status < 300) {
        console.log("Upload completed successfully");
        updateProgress(100);
        return videoId;
      } else {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }
    } catch (error) {
      console.error("Upload process error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error("Authentication failed - check your API key");
        } else if (error.response?.status === 404) {
          throw new Error("Library not found - check your library ID");
        } else {
          throw new Error(
            `Upload failed with status: ${error.response?.status}`
          );
        }
      }

      throw error;
    }
  };

  async function onSubmit(values: z.infer<typeof updateVedioSchema>) {
    if (!values.fileUrl || values.fileUrl === "") {
      maketoast.error("يرجى إضافة ملف فيديو");
      return;
    }

    try {
      clearError();

      let newVideoId = values.fileUrl;

      // If user selected a new video file, upload it first
      if (selectedVideo && isReplacingVideo) {
        resetProgress();
        setUploadStatus("uploading");
        console.log("Uploading new video...");

        newVideoId = await uploadVideoDirectly(selectedVideo, values.title);
        console.log("New video uploaded successfully:", newVideoId);
      }

      await mutation.mutateAsync({
        chapterID: chapterID,
        moduleId: material.id,
        newVideoId: newVideoId,
        title: values.title,
        content: JSON.stringify(values.content),
        duration: videoDuration || material.duration,
      });
    } catch (error) {
      console.error("Update error:", error);
      setUploadStatus("error");
      handleError(error, "فشل في تحديث الفيديو");
      maketoast.error("فشل في تحديث الفيديو");
    }
  }

  // Enhanced disable logic
  const isSubmitDisabled =
    mutation.isLoading ||
    uploadStatus === "uploading" ||
    (!form.watch("fileUrl") && !selectedVideo) ||
    uploadStatus === "error";

  // Get button text
  const getUpdateButtonText = () => {
    switch (uploadStatus) {
      case "uploading":
        return `جاري الرفع ${uploadProgress}%`;

      case "completed":
        return "تم بنجاح ✓";
      default:
        if (mutation.isLoading) {
          return "جاري التحديث...";
        }
        return "حفظ التغييرات";
    }
  };

  return (
    <>
      <VideoPlayer
        isOpen={open}
        setIsOpen={setOpen}
        videoId={form?.watch("fileUrl") ?? ""}
      />

      <div className="w-full grid grid-cols-3 gap-x-8 mb-8 ">
        <div className="col-span-2 w-full h-full">
          <Form {...form}>
            <form
              id="update-video"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      عنوان مقطع الفيديو{" "}
                      <span className="text-red-600 text-xl">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="تعلم كل ما يتعلق بتربية الكناري"
                        {...field}
                        disabled={uploadStatus === "uploading"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fileUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      استبدال ملف الفيديو{" "}
                      <span className="text-red-600 text-xl">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {/* Current video info */}
                        <div className="p-4 border rounded-lg bg-white">
                          <p className="text-sm text-gray-600 mb-2">
                            الفيديو الحالي:
                          </p>
                          <div className="flex items-center flex-col justify-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setOpen(true)}
                            >
                              معاينة الفيديو الحالي
                            </Button>
                            <span className="text-sm text-gray-500">
                              المدة: {Math.round(material.duration || 0)} ثانية
                            </span>
                          </div>
                        </div>

                        {/* New video uploader */}
                        <EnhancedVideoUploader
                          onVideoSelect={handleVideoSelect}
                          selectedVideo={
                            selectedVideo
                              ? {
                                  file: selectedVideo,
                                  videoId: "",
                                  uploadUrl: "",
                                  duration: videoDuration,
                                }
                              : null
                          }
                          isGeneratingUrl={false}
                          onPreview={() => {
                            // Preview functionality for new video if needed
                          }}
                          onRemove={() => {
                            setSelectedVideo(null);
                            setVideoDuration(0);
                            setIsReplacingVideo(false);
                            form.setValue("videoFile", undefined as any);
                            resetProgress();
                            clearError();
                          }}
                          uploadProgress={uploadProgress}
                          isUploading={uploadStatus === "uploading"}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                    {uploadError && (
                      <div className="text-red-500 text-sm mt-2">
                        {uploadError}
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <div className="col-span-1 w-full h-full ">
          <Card>
            <CardContent className="w-full h-fit flex flex-col p-6  space-y-4">
              <Button
                disabled={isSubmitDisabled}
                type="submit"
                form="update-video"
                className="w-full flex items-center gap-x-2"
                size="lg"
              >
                {(mutation.isLoading || uploadStatus === "uploading") && (
                  <LoadingSpinner />
                )}
                {getUpdateButtonText()}
              </Button>

              <Button
                disabled={
                  delete_mutation.isLoading || uploadStatus === "uploading"
                }
                onClick={async () => {
                  console.log("here are the params");
                  console.log(material.fileUrl, chapterID);
                  await delete_mutation.mutateAsync({
                    oldFileUrl: material.fileUrl,
                    chapterID,
                    fileUrl: form.watch("fileUrl"),
                  });
                }}
                type="button"
                className="w-full flex items-center gap-x-2 bg-red-500 hover:bg-red-900 transition-all duration-300"
                size="lg"
              >
                {delete_mutation.isLoading ? <LoadingSpinner /> : null}
                حذف هذه المادة
              </Button>

              <Button
                onClick={() => router.back()}
                className="w-full"
                variant="secondary"
                size="lg"
                disabled={uploadStatus === "uploading"}
              >
                العودة الى باني الدورة
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default UpdateVedioForm;
