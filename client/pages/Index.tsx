import { useMemo } from "react";
import VideoCard, { type VideoItem } from "@/components/eduflow/VideoCard";

const FEED: VideoItem[] = [
  {
    id: "v1",
    title: "Newton's Laws in 60 seconds",
    creator: "Dr. Maya Patel",
    avatarColor: "#7c3aed",
    subject: "Physics",
    difficulty: "Beginner",
    aiScore: 86,
    videoUrl: "https://storage.googleapis.com/coverr-main/mp4/Mountain.mp4",
    captions:
      "00:00.000 --> 00:02.800\nFirst law: inertia. Objects stay in motion unless acted upon.\n\n00:03.000 --> 00:06.000\nSecond law: F = m a. Force equals mass times acceleration.\n\n00:06.200 --> 00:09.500\nThird law: every action has an equal and opposite reaction.",
  },
  {
    id: "v2",
    title: "Spanish: 5 phrases for travel",
    creator: "Ana Torres",
    avatarColor: "#06b6d4",
    subject: "Languages",
    difficulty: "Beginner",
    aiScore: 78,
    videoUrl: "https://storage.googleapis.com/coverr-main/mp4/Footboys.mp4",
  },
  {
    id: "v3",
    title: "Binary Search explained",
    creator: "Alex Chen",
    avatarColor: "#22c55e",
    subject: "Computer Science",
    difficulty: "Intermediate",
    aiScore: 91,
    videoUrl: "https://storage.googleapis.com/coverr-main/mp4/Take_Care.mp4",
  },
];

export default function Index() {
  const feed = useMemo(() => FEED, []);
  return (
    <div className="min-h-dvh">
      <div className="relative">
        <div className="absolute inset-0 -z-10 brand-gradient opacity-20" />
        <div className="mx-auto max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl px-0">
          {feed.map((item) => (
            <VideoCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
