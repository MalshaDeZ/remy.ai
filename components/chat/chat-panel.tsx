"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, MicOff, Send, Volume2, VolumeX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { listen, speak, stopSpeaking, voiceInputSupported, voiceOutputSupported, type ListenHandle } from "@/lib/services/voice";
import type { ChatContext, ChatMessage, Recipe } from "@/types";

const SUGGESTIONS = [
  "Help! Something went wrong.",
  "Explain this step.",
  "Suggest a substitute.",
  "How do I know it's ready?",
  "Can I adjust this recipe?",
];

interface Props {
  recipe: Recipe;
  currentStep: number;
  completedSteps: number[];
  servings: number;
  messages: ChatMessage[];
  onMessages: (messages: ChatMessage[]) => void;
  onClose: () => void;
}

export function ChatPanel({ recipe, currentStep, completedSteps, servings, messages, onMessages, onClose }: Props) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readAloud, setReadAloud] = useState(false);
  const [listening, setListening] = useState(false);
  const [micNote, setMicNote] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const listenRef = useRef<ListenHandle | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  useEffect(() => () => {
    listenRef.current?.stop();
    stopSpeaking();
  }, []);

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading) return;
    setError(null);
    setInput("");
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: question, timestamp: new Date().toISOString() };
    const history = [...messages, userMsg];
    onMessages(history);
    setLoading(true);
    try {
      const context: ChatContext = { recipe, currentStep, completedSteps, servings, history: messages };
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Remy couldn't answer.");
      const reply: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: data.reply, timestamp: new Date().toISOString() };
      onMessages([...history, reply]);
      if (readAloud) speak(data.reply);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function toggleMic() {
    setMicNote(null);
    if (listening) {
      listenRef.current?.stop();
      return;
    }
    const handle = listen({
      onResult: (t) => { if (t) void send(t); },
      onEnd: () => setListening(false),
      onError: () => { setListening(false); setMicNote("I couldn't hear you. Please try again or type your question."); },
    });
    if (!handle) {
      setMicNote("Voice input isn't supported in this browser. Please type your question.");
      return;
    }
    listenRef.current = handle;
    setListening(true);
  }

  function toggleReadAloud() {
    if (readAloud) stopSpeaking();
    setReadAloud(!readAloud);
  }

  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-40 flex h-[80vh] flex-col rounded-t-3xl border border-border bg-card shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:h-auto md:w-[26rem] md:rounded-none md:rounded-l-3xl"
      aria-label="Ask Remy"
    >
      <header className="flex items-center justify-between border-b border-border p-4">
        <div>
          <h2 className="font-serif text-xl font-bold">Ask Remy</h2>
          <p className="text-xs text-muted">Step {currentStep + 1} of {recipe.instructions.length} · {recipe.title}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleReadAloud} aria-pressed={readAloud} aria-label={readAloud ? "Turn off read aloud" : "Read answers aloud"} title={voiceOutputSupported() ? "Read answers aloud" : "Read aloud isn't supported in this browser"} disabled={!voiceOutputSupported()}>
            {readAloud ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close chat"><X className="h-5 w-5" /></Button>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto p-4" role="log" aria-live="polite">
        {messages.length === 0 && (
          <p className="rounded-2xl bg-primary-soft/60 p-4 text-sm">
            Hi, I&apos;m Remy! Ask me anything about <strong>{recipe.title}</strong> — substitutions, techniques, or fixing a mistake. I won&apos;t move you to the next step until you&apos;re ready.
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={cn("max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[15px]", m.role === "user" ? "ml-auto bg-primary text-white" : "bg-primary-soft/70")}>
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="flex w-fit items-center gap-2 rounded-2xl bg-primary-soft/70 px-4 py-3 text-sm" role="status">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Remy is thinking…
          </div>
        )}
        {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
        <div ref={endRef} />
      </div>

      <div className="space-y-3 border-t border-border p-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" disabled={loading} onClick={() => send(s)} className="shrink-0 cursor-pointer rounded-full border border-border bg-background px-3 py-1.5 text-sm hover:bg-primary-soft disabled:opacity-50">
              {s}
            </button>
          ))}
        </div>
        {(listening || micNote) && (
          <p className="text-sm text-muted" role="status">{listening ? "Listening… speak now" : micNote}</p>
        )}
        <form onSubmit={(e) => { e.preventDefault(); void send(input); }} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Remy a question…"
            aria-label="Your question"
            maxLength={500}
            className="h-12 min-w-0 flex-1 rounded-full border border-border bg-background px-4 focus:border-primary focus:outline-none"
          />
          <Button variant={listening ? "primary" : "outline"} size="icon" className="h-12 w-12" onClick={toggleMic} aria-pressed={listening} aria-label={listening ? "Stop listening" : "Speak your question"} title={voiceInputSupported() ? undefined : "Voice input isn't supported in this browser"}>
            {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button type="submit" size="icon" className="h-12 w-12" disabled={!input.trim() || loading} aria-label="Send"><Send className="h-5 w-5" /></Button>
        </form>
      </div>
    </aside>
  );
}
