"use client";

import MuxPlayerReact from "@mux/mux-player-react";

type Props = {
  playbackId: string;
  playbackToken: string;
  thumbnailToken?: string;
  storyboardToken?: string;
  streamType?: "on-demand" | "live";
  title?: string;
  poster?: string;
  metadata?: {
    viewer_user_id?: string;
    video_title?: string;
    video_id?: string;
  };
};

/**
 * Wrapper around Mux's official React player.
 * Uses signed playback tokens — never pass raw playback IDs to the browser
 * for paid content.
 */
export default function MuxPlayer({
  playbackId,
  playbackToken,
  thumbnailToken,
  storyboardToken,
  streamType = "on-demand",
  title,
  poster,
  metadata,
}: Props) {
  return (
    <MuxPlayerReact
      playbackId={playbackId}
      tokens={{
        playback: playbackToken,
        thumbnail: thumbnailToken,
        storyboard: storyboardToken,
      }}
      streamType={streamType}
      poster={poster}
      title={title}
      accentColor="#c41e3a"
      metadata={metadata}
      style={{
        aspectRatio: "16 / 9",
        width: "100%",
        height: "auto",
      }}
    />
  );
}
