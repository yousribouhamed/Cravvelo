import React from "react";

interface EmbedYouTubeVideoProps {
  url: string | null;
  className?: string;
  title?: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  loop?: boolean;
}

const EmbedYouTubeVideo: React.FC<EmbedYouTubeVideoProps> = ({
  url,
  className = "w-full aspect-video",
  title = "YouTube Video",
  autoplay = false,
  muted = false,
  controls = true,
  loop = false,
}) => {
  const getYouTubeEmbedUrl = (videoUrl: string | null): string | null => {
    if (!videoUrl) return null;

    let videoId = "";

    try {
      // Handle different YouTube URL formats
      if (videoUrl.includes("youtube.com/watch?v=")) {
        videoId = videoUrl.split("v=")[1]?.split("&")[0];
      } else if (videoUrl.includes("youtu.be/")) {
        videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0];
      } else if (videoUrl.includes("youtube.com/embed/")) {
        // Already an embed URL, extract video ID and rebuild with our parameters
        videoId = videoUrl.split("embed/")[1]?.split("?")[0];
      } else if (videoUrl.includes("youtube.com/v/")) {
        videoId = videoUrl.split("v/")[1]?.split("?")[0];
      }

      if (!videoId) return null;

      // Build embed URL with parameters
      const params = new URLSearchParams();
      if (autoplay) params.append("autoplay", "1");
      if (muted) params.append("mute", "1");
      if (!controls) params.append("controls", "0");
      if (loop) {
        params.append("loop", "1");
        params.append("playlist", videoId); // Required for loop to work
      }

      const paramString = params.toString();
      return `https://www.youtube.com/embed/${videoId}${
        paramString ? `?${paramString}` : ""
      }`;
    } catch (error) {
      console.error("Error parsing YouTube URL:", error);
      return null;
    }
  };

  const embedUrl = getYouTubeEmbedUrl(url);

  if (!embedUrl) {
    return (
      <div
        className={`${className} bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center`}
      >
        <div className="text-center text-gray-400">
          <div className="w-16 h-16 mx-auto mb-4 opacity-50">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
          <p className="text-sm">No video URL provided</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full rounded-lg"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
};

export default EmbedYouTubeVideo;
