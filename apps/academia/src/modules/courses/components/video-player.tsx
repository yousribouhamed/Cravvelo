"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

interface VideoPlayerProps {
  videoId: string;
  title?: string;
  className?: string;
  height?: number;
  autoplay?: boolean;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

const SAFE_VIDEO_ID_REGEX = /^[a-zA-Z0-9_-]+$/;

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId: rawVideoId,
  title,
  className = "",
  height,
  autoplay = false,
  onLoad,
  onError,
}) => {
  const t = useTranslations("watch.video");
  const fillContainer = height === undefined;
  const containerHeight = fillContainer ? "100%" : (height ?? 500);
  const videoId = typeof rawVideoId === "string" && SAFE_VIDEO_ID_REGEX.test(rawVideoId)
    ? rawVideoId
    : "";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isPlaybackAllowed, setIsPlaybackAllowed] = useState<boolean>(true);

  const handleLoad = useCallback(() => {
    setLoading(false);
    setError(null);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    const errorMessage = t("loadError");
    setLoading(false);
    setError(errorMessage);
    onError?.(errorMessage);
  }, [onError, t]);

  const handleRetry = useCallback(() => {
    setError(null);
    setLoading(true);
    setRetryCount((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let active = true;

    const verifyPlaybackAccess = async () => {
      if (!videoId) return;
      try {
        const response = await fetch("/api/video/playback-access", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoId }),
        });

        if (!active) return;
        if (response.ok) {
          setIsPlaybackAllowed(true);
          return;
        }

        if (response.status === 403) {
          setIsPlaybackAllowed(false);
          setLoading(false);
          setError(t("bandwidthLimitReached"));
          return;
        }

        setIsPlaybackAllowed(true);
      } catch (requestError) {
        console.warn("Playback access validation failed", requestError);
      }
    };

    void verifyPlaybackAccess();

    return () => {
      active = false;
    };
  }, [videoId, t]);

  const videoLibrary = process.env["NEXT_PUBLIC_VIDEO_LIBRARY"];

  if (!videoLibrary) {
    return (
      <div
        className={`w-full ${className} ${fillContainer ? "h-full" : ""} flex items-center justify-center bg-muted rounded-lg`}
        style={fillContainer ? undefined : { height: containerHeight }}
      >
        <div className="text-center p-6">
          <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("configMissing")}</p>
        </div>
      </div>
    );
  }

  if (!videoId) {
    return (
      <div
        className={`w-full ${className} ${fillContainer ? "h-full" : ""} flex items-center justify-center bg-muted rounded-lg`}
        style={fillContainer ? undefined : { height: containerHeight }}
      >
        <div className="text-center p-6">
          <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("videoIdRequired")}</p>
        </div>
      </div>
    );
  }

  if (!isPlaybackAllowed) {
    return (
      <div
        className={`w-full ${className} ${fillContainer ? "h-full" : ""} flex items-center justify-center bg-muted rounded-lg`}
        style={fillContainer ? undefined : { height: containerHeight }}
      >
        <div className="text-center p-6">
          <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("bandwidthLimitReached")}</p>
        </div>
      </div>
    );
  }

  const blockContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div
      className={fillContainer ? "w-full h-full" : "w-full"}
      onContextMenu={blockContextMenu}
      style={{ userSelect: "none", WebkitUserDrag: "none" } as React.CSSProperties}
    >
      {title && !fillContainer && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        </div>
      )}

      <div
        className={`w-full relative ${className} rounded-lg overflow-hidden`}
        style={{ height: containerHeight }}
      >
        {/* Loading Skeleton */}
        {loading && (
          <div className="absolute inset-0 z-10">
            <Skeleton className="w-full h-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">{t("loading")}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted">
            <div className="text-center p-6">
              <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-destructive" />
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
              >
                <RefreshCw className="h-4 w-4" />
                <span>{t("retry")}</span>
              </button>
            </div>
          </div>
        )}

        {/* Video Iframe */}
        <iframe
          key={`${videoId}-${retryCount}`}
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
          allow="accelerometer; gyroscope; autoplay; encrypted-media"
          sandbox="allow-scripts allow-same-origin"
          referrerPolicy="no-referrer"
          allowFullScreen={true}
          onLoad={handleLoad}
          onError={handleError}
          title={title || `Video ${videoId}`}
        />
      </div>
    </div>
  );
};
