import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type Msg = {
  role: "user" | "ai";
  text: string;
  sources?: { title: string; url: string }[];
};

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: "import.meta.env.VITE_GROQ_API_KEY",
  dangerouslyAllowBrowser: true, // ⚠️ not safe for production
});


async function searchAnswer(q: string, subject: string) {
  try {
    const prompt = `You are an AI tutor for ${subject}. The student asked: "${q}". 
Answer clearly and concisely. Use bullet points or short paragraphs for readability.`;

    const res = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // ✅ fast & cost-efficient
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const text = res.choices[0]?.message?.content?.trim() || 
      "Sorry, I couldn’t generate an answer right now.";

    return { text, sources: [] };
  } catch (e) {
    console.error("Groq error:", e);
    return {
      text: "⚠️ Sorry, something went wrong while contacting the AI tutor.",
      sources: [],
    };
  }
}


export default function TutorChat({
  open,
  onOpenChange,
  subject,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  subject: string;
}) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "ai",
      text: `Hi! I'm your AI tutor for ${subject}. Ask me anything about this video.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setLoading(true);
    try {
      const res = await searchAnswer(q, subject);
      setMessages((m) => [
        ...m,
        { role: "ai", text: res.text, sources: res.sources },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "ai", text: "Sorry, I couldn't retrieve results right now." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70dvh] p-0">
        <SheetHeader className="px-4 pt-4">
          <SheetTitle>AI Tutor</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto space-y-3 px-4 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "text-right" : "text-left"}
              >
                <div
                  className={
                    m.role === "user"
                      ? "inline-block bg-primary text-primary-foreground px-3 py-2 rounded-lg"
                      : "inline-block bg-muted px-3 py-2 rounded-lg max-w-[90%]"
                  }
                >
                  <div>{m.text}</div>
                  {m.sources?.length ? (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Sources:{" "}
                      {m.sources.map((s, idx) => (
                        <a
                          key={idx}
                          className="underline mr-2"
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {s.title}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            {loading ? (
              <div className="text-left">
                <div className="inline-block bg-muted px-3 py-2 rounded-lg">
                  Searching…
                </div>
              </div>
            ) : null}
          </div>
          <div className="border-t mb-10 p-3 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => (e.key === "Enter" ? send() : undefined)}
              placeholder="Ask about the video..."
              className="flex-1 rounded-md bg-muted px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button onClick={send} size="sm" disabled={loading}>
              Send
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}