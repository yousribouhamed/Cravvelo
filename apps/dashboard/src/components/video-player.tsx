"use client";

import React, { useState, useCallback } from "react";
import { Skeleton } from "@ui/components/ui/skeleton";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface EmbeddedVideoProps {
  videoId: string;
  className?: string;
  height?: number;
  autoplay?: boolean;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

export const EmbeddedVideo: React.FC<EmbeddedVideoProps> = ({
  videoId,
  className = "",
  height = 500,
  autoplay = false,
  onLoad,
  onError,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleLoad = useCallback(() => {
    setLoading(false);
    setError(null);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    const errorMessage =
      "Failed to load video. Please check your connection and try again.";
    setLoading(false);
    setError(errorMessage);
    onError?.(errorMessage);
  }, [onError]);

  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    setRetryCount((prev) => prev + 1);
  }, []);

  const videoLibrary = process.env["NEXT_PUBLIC_VIDEO_LIBRARY"];

  if (!videoLibrary) {
    return (
      <div
        className={`w-full ${className} flex items-center justify-center bg-muted rounded-lg`}
        style={{ height }}
      >
        <div className="text-center p-6">
          <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Video library configuration is missing. Please check your
            environment variables.
          </p>
        </div>
      </div>
    );
  }

  if (!videoId) {
    return (
      <div
        className={`w-full ${className} flex items-center justify-center bg-muted rounded-lg`}
        style={{ height }}
      >
        <div className="text-center p-6">
          <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Video ID is required to display the video.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full relative ${className}`} style={{ height }}>
      {/* Loading Skeleton */}
      {loading && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="w-full h-full rounded-lg" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted rounded-lg">
          <div className="text-center p-6">
            <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-destructive" />
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* Video Iframe */}
      <iframe
        key={`${videoId}-${retryCount}`} // Force re-render on retry
        src={`https://iframe.mediadelivery.net/embed/${videoLibrary}/${videoId}?autoplay=${autoplay}`}
        loading="lazy"
        style={{
          border: "none",
          position: "absolute",
          height: "100%",
          width: "100%",
          opacity: loading ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen={true}
        onLoad={handleLoad}
        onError={handleError}
        title={`Video ${videoId}`}
      />
    </div>
  );
};
