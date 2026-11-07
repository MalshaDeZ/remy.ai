/**
 * Voice abstraction. The prototype uses browser speech APIs where available;
 * swap these for an AI voice service (STT/TTS) later without touching the UI.
 */

interface RecognitionResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}
interface Recognition {
  lang: string;
  interimResults: boolean;
  onresult: ((e: RecognitionResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}
type RecognitionCtor = new () => Recognition;

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export const voiceInputSupported = () => getRecognitionCtor() !== null;
export const voiceOutputSupported = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;

export interface ListenHandle {
  stop(): void;
}

export function listen(handlers: {
  onResult: (text: string) => void;
  onEnd: () => void;
  onError: () => void;
}): ListenHandle | null {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.lang = "en-US";
  rec.interimResults = false;
  rec.onresult = (e) => handlers.onResult(e.results[0]?.[0]?.transcript ?? "");
  rec.onerror = handlers.onError;
  rec.onend = handlers.onEnd;
  rec.start();
  return { stop: () => rec.stop() };
}

export function speak(text: string, onEnd?: () => void) {
  if (!voiceOutputSupported()) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.95;
  if (onEnd) {
    utter.onend = onEnd;
    utter.onerror = onEnd;
  }
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking() {
  if (voiceOutputSupported()) window.speechSynthesis.cancel();
}
