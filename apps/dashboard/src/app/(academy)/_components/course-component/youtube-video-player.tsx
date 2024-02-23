"use client";
import YouTube, { YouTubeProps } from "react-youtube";

import type { FC } from "react";

interface YoutubeVideoPlayerProps {
  url: string;
}

const YoutubeVideoPlayer: FC<YoutubeVideoPlayerProps> = ({ url }) => {
  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  const opts: YouTubeProps["opts"] = {
    height: "500",
    width: "1000",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };
  return (
    <YouTube
      videoId={getYouTubeVideoId(url)}
      opts={opts}
      onReady={onPlayerReady}
    />
  );
};

export default YoutubeVideoPlayer;

function getYouTubeVideoId(url) {
  // Regular expression to match YouTube video ID
  var regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
  var match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2]; // Return the YouTube video ID
  } else {
    // Handle invalid URL or no match
    console.error("Invalid YouTube URL");
    return null;
  }
}
