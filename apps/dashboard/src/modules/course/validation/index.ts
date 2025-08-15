export const VideoValidation = {
  MAX_FILE_SIZE: 1024 * 1024 * 1024, // 1GB
  ALLOWED_TYPES: ["video/mp4", "video/quicktime", "video/x-msvideo"],

  validateFile(file: File): { valid: boolean; error?: string } {
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `حجم الملف كبير جداً. الحد الأقصى ${
          this.MAX_FILE_SIZE / (1024 * 1024 * 1024)
        }GB`,
      };
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: "نوع الملف غير مدعوم. يرجى استخدام MP4, MOV, أو AVI",
      };
    }

    return { valid: true };
  },

  getVideoDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };

      video.onerror = () => {
        window.URL.revokeObjectURL(video.src);
        reject(new Error("Failed to load video metadata"));
      };

      video.src = window.URL.createObjectURL(file);
    });
  },
};
