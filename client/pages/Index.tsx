"use client";
import { useMemo, useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import VideoCard, { type VideoItem } from "@/components/eduflow/VideoCard";

gsap.registerPlugin(Observer);

const FEED: VideoItem[] = [
  {
    id: "v1",
    title: "Newton's Laws in 60 seconds",
    creator: "Dr. Maya Patel",
    avatarColor: "#7c3aed",
    subject: "Physics",
    difficulty: "Beginner",
    aiScore: 86,
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    id: "v2",
    title: "Spanish: 5 phrases for travel",
    creator: "Ana Torres",
    avatarColor: "#06b6d4",
    subject: "Languages",
    difficulty: "Beginner",
    aiScore: 78,
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: "v3",
    title: "Binary Search explained",
    creator: "Alex Chen",
    avatarColor: "#22c55e",
    subject: "Computer Science",
    difficulty: "Intermediate",
    aiScore: 91,
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
];

export default function Index() {
  const feed = useMemo(() => FEED, []);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isAnimating = useRef(false); // 🚀 lock flag

  // autoplay handling
 // autoplay handling (always restart when revisiting)
useEffect(() => {
  videoRefs.current.forEach((video, i) => {
    if (!video) return;

    if (i === activeIndex) {
      video.pause();
      video.currentTime = 0;  // ⏪ restart
      video.play().catch(() => {}); // 🔊 safe play
    } else {
      video.pause();
      video.currentTime = 0;
    }
  });
}, [activeIndex]);



  // scroll/swipe observer
  useEffect(() => {
    if (!containerRef.current) return;

    const obs = Observer.create({
      target: window, // use window for global scroll/swipe
      type: "wheel,touch,pointer",
      wheelSpeed: -2,
      tolerance: 20, // prevent micro scroll noise
      onUp: () => {
        if (activeIndex < feed.length - 1 && !isAnimating.current) {
          goTo(activeIndex + 1);
        }
      },
      onDown: () => {
        if (activeIndex > 0 && !isAnimating.current) {
          goTo(activeIndex - 1);
        }
      },
    });

    return () => obs.kill();
  }, [activeIndex]);

  const goTo = (index: number) => {
    if (!containerRef.current) return;
    const slides = gsap.utils.toArray<HTMLElement>(
      containerRef.current.querySelectorAll(".short")
    );

    const current = slides[activeIndex];
    const next = slides[index];
    if (!current || !next) return;

    const direction = index > activeIndex ? 1 : -1;

    isAnimating.current = true; // 🔒 lock transition

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveIndex(index);
        isAnimating.current = false; // 🔓 unlock when done
      },
    });

    tl.to(current, {
      yPercent: -100 * direction,
      duration: 0.6,
      ease: "power2.inOut",
    }).fromTo(
      next,
      { yPercent: 100 * direction },
      { yPercent: 0, duration: 0.6, ease: "power2.inOut" },
      "<"
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-dvh overflow-hidden bg-black"
    >
     {feed.map((item, idx) => (
  <div
    key={item.id}
    className={`short absolute inset-0`}
    style={{ zIndex: feed.length - idx }}
  >
    <VideoCard
      key={`${item.id}-${activeIndex === idx}`} // 🔑 force re-mount
      item={item}
      ref={(el: HTMLVideoElement) => (videoRefs.current[idx] = el)}
    />
  </div>
))}

    </div>
  );
}
