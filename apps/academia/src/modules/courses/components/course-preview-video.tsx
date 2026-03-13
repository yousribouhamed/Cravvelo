import EmbedYouTubeVideo from "./yotube-player";

interface CoursePreviewVideoProps {
  previewVideo: string | null;
  youtubeUrl: string | null;
  className?: string;
}

export function CoursePreviewVideo({
  previewVideo,
  youtubeUrl,
  className = "w-full aspect-video",
}: CoursePreviewVideoProps) {
  const videoLibrary = process.env.NEXT_PUBLIC_VIDEO_LIBRARY;

  // Bunny (preview_video) takes precedence over YouTube when both exist.
  if (previewVideo && videoLibrary) {
    return (
      <div className={className}>
        <iframe
          src={`https://iframe.mediadelivery.net/embed/${videoLibrary}/${previewVideo}?autoplay=false`}
          className="w-full h-full rounded-lg border-0"
          allow="accelerometer; gyroscope; encrypted-media; picture-in-picture"
          allowFullScreen
          title="Course preview"
        />
      </div>
    );
  }

  // Uploaded Bunny video exists but video library env is missing — don't fall back to YouTube.
  if (previewVideo && !videoLibrary) {
    return (
      <div
        className={`${className} bg-muted rounded-lg flex items-center justify-center border border-border`}
      >
        <p className="text-muted-foreground text-sm">
          Preview video is not configured
        </p>
      </div>
    );
  }

  if (youtubeUrl) {
    return <EmbedYouTubeVideo url={youtubeUrl} className={className} />;
  }

  return (
    <div
      className={`${className} bg-muted rounded-lg flex items-center justify-center border border-border`}
    >
      <p className="text-muted-foreground text-sm">No video provided</p>
    </div>
  );
}
