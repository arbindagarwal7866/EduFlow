import { useEffect, useMemo, useRef, useState } from "react";
import {
  BadgeCheck,
  Bookmark,
  BrainCircuit,
  Captions,
  CheckCircle2,
  GraduationCap,
  Bot,
  Heart,
  MessageCircle,
  PlayCircle,
  Repeat,
  Share2,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TutorChat from "./TutorChat";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type VideoItem = {
  id: string;
  title: string;
  creator: string;
  avatarColor: string;
  subject: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  aiScore: number;
  videoUrl: string;
  captions?: string;
};

function pctColor(pct: number) {
  if (pct >= 80) return "bg-emerald-500";
  if (pct >= 60) return "bg-lime-500";
  if (pct >= 40) return "bg-amber-500";
  return "bg-rose-500";
}

function useIntersectionPlay(ref: React.RefObject<HTMLVideoElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.play().catch(() => {});
          } else {
            el.pause();
          }
        });
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}

function useDataVtt(cues: string) {
  return useMemo(
    () =>
      `data:text/vtt;charset=utf-8,${encodeURIComponent(`WEBVTT\n\n${cues}`)}`,
    [cues],
  );
}

export default function VideoCard({ item }: { item: VideoItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useIntersectionPlay(videoRef);
  const [speed, setSpeed] = useState(1);
  const [liked, setLiked] = useState<boolean>(
    () => localStorage.getItem(`liked:${item.id}`) === "1",
  );
  const [saved, setSaved] = useState<boolean>(
    () => localStorage.getItem(`saved:${item.id}`) === "1",
  );
  const [showCaptions, setShowCaptions] = useState(true);
  const [openTutor, setOpenTutor] = useState(false);
  const [openQuiz, setOpenQuiz] = useState(false);

  const trackSrc = useDataVtt(
    item.captions ??
      "00:00.000 --> 00:03.000\nThis video explains core concepts.\n\n00:03.200 --> 00:07.200\nPay attention to the definition and examples.",
  );

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    if (liked) localStorage.setItem(`liked:${item.id}`, "1");
    else localStorage.removeItem(`liked:${item.id}`);
  }, [liked, item.id]);
  useEffect(() => {
    if (saved) {
      localStorage.setItem(`saved:${item.id}`, "1");
      toast("Video saved");
    } else {
      localStorage.removeItem(`saved:${item.id}`);
    }
  }, [saved, item.id]);

  return (
    <section className="relative w-full h-[calc(100dvh-56px-56px)] sm:h-[calc(100dvh-56px)] max-w-[480px] mx-auto">
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative w-full h-full bg-black rounded-none sm:rounded-2xl overflow-hidden">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src={item.videoUrl}
            controls={false}
            playsInline
            muted
            loop
            preload="metadata"
          >
            <track
              kind="subtitles"
              srcLang="en"
              label="English"
              default={showCaptions}
              src={trackSrc}
            />
          </video>

          {/* overlay top */}
          <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between text-white/95">
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="px-2 py-1 rounded-md bg-black/50 border border-white/10">
                {item.subject}
              </span>
              <span className="px-2 py-1 rounded-md bg-black/50 border border-white/10">
                {item.difficulty}
              </span>
              <button
                onClick={() =>
                  alert(
                    "Learning Path connects related videos with progressive difficulty.",
                  )
                }
                className="px-2 py-1 rounded-md bg-black/50 border border-white/10 flex items-center gap-1"
              >
                <GraduationCap className="size-3.5" /> Path
              </button>
            </div>
            <div>
              <Dialog open={openQuiz} onOpenChange={setOpenQuiz}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <PlayCircle className="mr-1 size-4" /> Quiz • Micro-Cred
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>AI Quiz & Micro-Credential</DialogTitle>
                    <DialogDescription>
                      Answer 5 AI-generated questions from this video. Pass with
                      80% to earn a verifiable micro-credential you can add to
                      your resume.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 rounded-md bg-muted">
                      Sample Q: Which of Newton\'s laws explains inertia?
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="secondary">First law</Button>
                      <Button variant="secondary">Second law</Button>
                      <Button variant="secondary">Third law</Button>
                      <Button variant="secondary">None</Button>
                    </div>
                    <div className="p-3 rounded-md border flex items-center gap-2">
                      <GraduationCap className="size-4 text-primary" /> Earn
                      credential on completion. Export to LinkedIn.
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setOpenQuiz(false)}
                    >
                      Close
                    </Button>
                    <Button>Start Quiz</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* overlay bottom info */}
          <div className="absolute left-0 right-14 bottom-0 p-4 text-white space-y-2">
            <h3 className="text-base font-semibold drop-shadow-[0_1px_1px_rgba(0,0,0,0.65)]">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 text-sm opacity-95">
              <div
                className="size-6 rounded-full"
                style={{ backgroundColor: item.avatarColor }}
              />
              <span className="font-medium">{item.creator}</span>
              <BadgeCheck className="size-4 text-sky-400" />
              <button className="px-2 py-0.5 rounded-md bg-black/50 border border-white/10 text-xs">
                Join
              </button>
            </div>
            <div className="text-xs text-white/80">128 people joined</div>
          </div>

          {/* right action rail */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 transform-gpu flex flex-col items-center gap-3 text-white">
            <button
              onClick={() => setLiked((v) => !v)}
              className={cn(
                "size-12 grid place-items-center", // no visible circle
                liked ? "text-rose-500" : "text-white",
              )}
              aria-label="Like"
            >
              <Heart
                className="size-6"
                fill={liked ? "currentColor" : "transparent"}
              />
            </button>
            <button
              className="size-12 grid place-items-center rounded-full bg-black/40 border border-white/10"
              aria-label="Comments"
            >
              <MessageCircle className="size-6" />
            </button>
            <button
              onClick={() => setSaved((v) => !v)}
              className={cn(
                "size-12 grid place-items-center",
                saved ? "text-sky-500" : "text-white",
              )}
              aria-label="Save"
            >
              <Bookmark
                className="size-6"
                fill={saved ? "currentColor" : "transparent"}
              />
            </button>
            <button
              className="size-12 grid place-items-center rounded-full bg-black/40 border border-white/10"
              aria-label="Share"
            >
              <Share2 className="size-6" />
            </button>
            <button
              onClick={() => setOpenTutor(true)}
              className="size-12 grid place-items-center rounded-full bg-black/40 border border-white/10"
              aria-label="Tutor"
            >
              <Bot className="size-6" />
            </button>
          </div>

          {/* bottom controls */}
          <div className="absolute bottom-20 right-2 sm:bottom-4 sm:right-4 flex items-center gap-2">
            <Button
              aria-label="Change speed"
              size="icon"
              variant="secondary"
              className="bg-white/90 text-black hover:bg-white"
              onClick={() =>
                setSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1))
              }
            >
              <Timer className="size-4" />
            </Button>
            <Button
              aria-label={
                showCaptions ? "Turn captions off" : "Turn captions on"
              }
              size="icon"
              variant="secondary"
              className="bg-white/90 text-black hover:bg-white"
              onClick={() => setShowCaptions((v) => !v)}
            >
              <Captions className="size-4" />
            </Button>
            <Button
              aria-label="Replay"
              size="icon"
              variant="secondary"
              className="bg-white/90 text-black hover:bg-white"
              onClick={() =>
                videoRef.current?.currentTime &&
                (videoRef.current.currentTime = 0)
              }
            >
              <Repeat className="size-4" />
            </Button>
          </div>

          <TutorChat
            open={openTutor}
            onOpenChange={setOpenTutor}
            subject={item.subject}
          />
        </div>
      </div>
    </section>
  );
}
