import React, { forwardRef } from "react";

export type VideoItem = {
  id: string;
  title: string;
  creator: string;
  avatarColor: string;
  subject: string;
  difficulty: string;
  aiScore: number;
  videoUrl: string;
};

const VideoCard = forwardRef<HTMLVideoElement, { item: VideoItem }>(
  ({ item }, ref) => {
    return (
      <div className="relative w-full h-full">
        <video
          ref={ref}
          src={item.videoUrl}
          className="w-full h-full object-cover"
          muted
          playsInline
          loop
        />
        {/* Overlay */}
        <div className="absolute bottom-5 left-5 text-white">
          <h2 className="text-xl font-bold">{item.title}</h2>
          <p className="text-sm opacity-80">{item.creator}</p>
        </div>
      </div>
    );
  }
);

VideoCard.displayName = "VideoCard";
export default VideoCard;
