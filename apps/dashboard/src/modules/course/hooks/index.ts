import * as React from "react";

// Enhanced error handling hook
export const useVideoUploadError = () => {
  const [error, setError] = React.useState<string>("");

  const handleError = (
    error: unknown,
    defaultMessage: string = "حدث خطأ غير متوقع"
  ) => {
    console.error("Video upload error:", error);

    if (error instanceof Error) {
      setError(error.message);
    } else if (typeof error === "string") {
      setError(error);
    } else {
      setError(defaultMessage);
    }
  };

  const clearError = () => setError("");

  return { error, handleError, clearError };
};

// Progress tracking hook
export const useUploadProgress = () => {
  const [progress, setProgress] = React.useState(0);
  const [status, setStatus] = React.useState<
    "idle" | "uploading" | "completed" | "error"
  >("idle");

  const updateProgress = (value: number) => {
    setProgress(Math.min(100, Math.max(0, value)));
  };

  const setUploadStatus = (
    newStatus: "idle" | "uploading" | "completed" | "error"
  ) => {
    setStatus(newStatus);
  };

  const reset = () => {
    setProgress(0);
    setStatus("idle");
  };

  return {
    progress,
    status,
    updateProgress,
    setUploadStatus,
    reset,
  };
};
