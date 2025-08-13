"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/components/ui/form";
import { Input } from "@ui/components/ui/input";
import { Button } from "@ui/components/ui/button";
import { Card, CardContent } from "@ui/components/ui/card";
import { LoadingSpinner } from "@ui/icons/loading-spinner";
import { EnhancedVideoUploader } from "@/src/modules/course/components/upload/video-uploader";
import { VideoValidation } from "@/src/modules/course/validation";
import { useUploadProgress } from "@/src/modules/course/hooks";
import { useVideoUploadError } from "@/src/modules/course/hooks";
import VideoPlayer from "../../models/video-player";
import { maketoast } from "../../toasts";
import { trpc } from "@/src/app/_trpc/client";
import axios from "axios";

const addVideoSchema = z.object({
  title: z.string().min(1, "عنوان الفيديو مطلوب"),
  content: z.any().optional(),
  videoFile: z.any().optional(),
});

interface AddVideoFormProps {
  chapterID: string;
}

function AddVideoForm({ chapterID }: AddVideoFormProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [selectedVideo, setSelectedVideo] = React.useState<File | null>(null);
  const [videoDuration, setVideoDuration] = React.useState<number>(0);
  const [videoId, setVideoId] = React.useState<string>("");

  const { error: uploadError, handleError, clearError } = useVideoUploadError();
  const {
    progress: uploadProgress,
    status: uploadStatus,
    updateProgress,
    setUploadStatus,
    reset: resetProgress,
  } = useUploadProgress();

  const createModuleMutation = trpc.createModuleWithVideo.useMutation();

  const form = useForm<z.infer<typeof addVideoSchema>>({
    resolver: zodResolver(addVideoSchema),
    defaultValues: {
      title: "",
      content: {},
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
      // Step 1: Create video object (same as your legacy createVideo function)
      console.log("Creating video object...");

      const createOptions = {
        method: "POST",
        url: `https://video.bunnycdn.com/library/${libraryId}/videos`,
        headers: {
          accept: "application/json",
          "content-type": "application/*+json",
          AccessKey: apiKey,
        },
        data: JSON.stringify({ title: title }), // Use the actual title instead of hardcoded
      };

      const createResponse = await axios.request(createOptions);
      const videoId = createResponse.data?.guid;

      if (!videoId) {
        throw new Error("Failed to get video ID from create response");
      }

      console.log("Video object created successfully:", videoId);
      updateProgress(10);

      // Step 2: Convert file to ArrayBuffer (same as legacy approach)
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

      // Step 3: Upload using axios (same as legacy approach)
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

  // Form submission with direct upload
  async function onSubmit(values: z.infer<typeof addVideoSchema>) {
    if (!selectedVideo) {
      maketoast.error("يرجى اختيار ملف فيديو");
      return;
    }

    try {
      clearError();
      resetProgress();
      setUploadStatus("uploading");

      console.log("Starting direct video upload...");

      // Upload video directly to Bunny CDN
      const uploadedVideoId = await uploadVideoDirectly(
        selectedVideo,
        values.title
      );

      console.log("Video uploaded successfully, creating module...");
      updateProgress(95);

      // Create module in database
      await createModuleMutation.mutateAsync({
        chapterID: chapterID,
        content: JSON.stringify(values.content || {}),
        fileType: "VIDEO",
        videoId: uploadedVideoId,
        title: values.title,
        duration: videoDuration,
      });

      updateProgress(100);
      setUploadStatus("completed");
      maketoast.success("تم رفع الفيديو وإنشاء الوحدة بنجاح");

      // Small delay to show completion before redirect
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      handleError(error, "فشل في رفع الفيديو");
      maketoast.error("فشل في رفع الفيديو");
    }
  }

  // Enhanced disable logic
  const isSubmitDisabled =
    createModuleMutation.isLoading ||
    uploadStatus === "uploading" ||
    !selectedVideo ||
    uploadStatus === "error";

  // Get upload button text
  const getUploadButtonText = () => {
    switch (uploadStatus) {
      case "uploading":
        return `جاري الرفع ${uploadProgress}%`;
      case "processing":
        return "جاري المعالجة...";
      case "completed":
        return "تم بنجاح ✓";
      default:
        if (createModuleMutation.isLoading) {
          return "جاري إنشاء الوحدة...";
        }
        return "رفع وحفظ";
    }
  };

  return (
    <>
      <VideoPlayer isOpen={open} setIsOpen={setOpen} videoId={videoId} />

      <div className="w-full grid grid-cols-3 gap-x-8">
        <div className="col-span-2 w-full h-full">
          <Form {...form}>
            <form
              id="add-video"
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
                        placeholder="مثال : دورة في التصميم الجرافيكي للمبتدئين"
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
                name="videoFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      إضافة ملف فيديو{" "}
                      <span className="text-red-600 text-xl">*</span>
                    </FormLabel>
                    <FormControl>
                      <EnhancedVideoUploader
                        onVideoSelect={handleVideoSelect}
                        selectedVideo={
                          selectedVideo
                            ? {
                                file: selectedVideo,
                                videoId: videoId,
                                uploadUrl: "", // Not needed for direct upload
                                duration: videoDuration,
                              }
                            : null
                        }
                        isGeneratingUrl={false} // Not needed for direct upload
                        onPreview={() => setOpen(true)}
                        onRemove={() => {
                          setSelectedVideo(null);
                          setVideoId("");
                          setVideoDuration(0);
                          form.setValue("videoFile", undefined as any);
                          resetProgress();
                          clearError();
                        }}
                        uploadProgress={uploadProgress}
                        isUploading={uploadStatus === "uploading"}
                      />
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

              <Card>
                <CardContent className="w-full h-fit flex justify-end items-center p-6 gap-x-4">
                  <Button
                    onClick={() => router.back()}
                    className="rounded-xl"
                    variant="secondary"
                    type="button"
                    disabled={uploadStatus === "uploading"}
                  >
                    إلغاء والعودة
                  </Button>
                  <Button
                    disabled={isSubmitDisabled}
                    type="submit"
                    className="flex items-center gap-x-2 rounded-xl"
                  >
                    {(createModuleMutation.isLoading ||
                      uploadStatus === "uploading") && <LoadingSpinner />}
                    {getUploadButtonText()}
                  </Button>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>

        <div className="col-span-1 w-full h-full">
          <Card>
            <CardContent className="w-full h-fit flex flex-col p-6 space-y-4">
              <Button
                disabled={isSubmitDisabled}
                type="submit"
                form="add-video"
                className="w-full flex items-center gap-x-2"
                size="lg"
              >
                {(createModuleMutation.isLoading ||
                  uploadStatus === "uploading") && <LoadingSpinner />}
                {getUploadButtonText()}
              </Button>
              <Button
                onClick={() => router.back()}
                className="w-full"
                variant="secondary"
                size="lg"
                disabled={uploadStatus === "uploading"}
              >
                إلغاء والعودة
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default AddVideoForm;
