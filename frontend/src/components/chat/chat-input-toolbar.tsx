"use client";

import React, { useRef, useState, useEffect } from "react";
import { Paperclip, Camera, Mic, MicOff, Volume2, ArrowRight, X, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ChatInputToolbarProps {
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  imageData: string | null;
  setImageData: (img: string | null) => void;
  isLoading: boolean;
  onSendMessage: () => void;
  onOpenCamera: () => void;
  onReadAnswer: () => void;
  hasLastAnswer: boolean;
  apiToken?: string;
  backendUrl?: string;
}

export function ChatInputToolbar({
  inputMessage,
  setInputMessage,
  imageData,
  setImageData,
  isLoading,
  onSendMessage,
  onOpenCamera,
  onReadAnswer,
  hasLastAnswer,
  apiToken,
  backendUrl,
}: ChatInputToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Auto-focus textarea on load
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      alert("Please upload a PNG, JPEG, or WebP image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result as string);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && (inputMessage.trim() || imageData)) {
        onSendMessage();
      }
    }
  };

  // Voice recording handler
  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    // Try Web Speech API SpeechRecognition first for instantaneous transcription
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any })
        .webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage((prev: string) => (prev ? `${prev} ${transcript}` : transcript));
        };
        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);

        recognition.start();
        return;
      } catch (e) {
        console.warn("SpeechRecognition fallback to MediaRecorder", e);
      }
    }

    // Fallback to MediaRecorder & backend /api/transcribe
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
        const formData = new FormData();
        formData.append("file", blob, "voice.webm");

        try {
          const targetUrl = backendUrl ? `${backendUrl}/api/transcribe` : "/api/transcribe";
          const headers: Record<string, string> = {};
          if (apiToken) headers["Authorization"] = `Bearer ${apiToken}`;

          const res = await fetch(targetUrl, {
            method: "POST",
            headers,
            body: formData,
          });
          if (res.ok) {
            const data = await res.json();
            if (data.text) {
              setInputMessage((prev: string) => (prev ? `${prev} ${data.text}` : data.text));
            }
          }
        } catch {
          // Fallback message if whisper API is offline
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert("Microphone permission or hardware unavailable: " + msg);
    }
  };

  return (
    <div className="space-y-3">
      {/* Attached image preview banner */}
      {imageData && (
        <div className="flex items-center gap-3 p-2 bg-zinc-900/90 dark:bg-[#15151c] rounded-xl border border-zinc-800 dark:border-[#2a2a38] w-fit">
          <img
            src={imageData}
            alt="Preview"
            className="h-14 w-14 object-cover rounded-lg border border-zinc-700/60"
          />
          <div className="text-xs">
            <p className="text-zinc-200 font-medium">Image attached</p>
            <button
              type="button"
              onClick={() => setImageData(null)}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 mt-0.5"
            >
              <X className="h-3 w-3" /> Remove image ×
            </button>
          </div>
        </div>
      )}

      {/* Main input form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isLoading && (inputMessage.trim() || imageData)) {
            onSendMessage();
          }
        }}
        className="space-y-3"
      >
        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your symptoms or ask a question..."
          rows={2}
          maxLength={4000}
          className="bg-[#141417] dark:bg-[#141417] bg-slate-50 border-[#29292f] dark:border-[#29292f] border-slate-300 text-zinc-100 dark:text-zinc-100 text-slate-900 placeholder:text-zinc-500 rounded-xl px-4 py-3 min-h-[64px] focus-visible:ring-indigo-500 shadow-inner"
        />

        {/* Toolbar Buttons Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Left Action Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
              id="medical-image-upload"
            />

            {/* Image Action Pill */}
            <Button
              type="button"
              variant="pill"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="gap-1.5 text-xs font-medium cursor-pointer"
            >
              <Paperclip className="h-3.5 w-3.5 text-zinc-400" />
              <span>Image</span>
            </Button>

            {/* Camera Action Pill */}
            <Button
              type="button"
              variant="pill"
              size="sm"
              onClick={onOpenCamera}
              className="gap-1.5 text-xs font-medium cursor-pointer"
            >
              <Camera className="h-3.5 w-3.5 text-zinc-400" />
              <span>Camera</span>
            </Button>

            {/* Voice Action Pill */}
            <Button
              type="button"
              variant="pill"
              size="sm"
              onClick={toggleRecording}
              className={
                isRecording
                  ? "bg-rose-950/80 border-rose-700 text-rose-300 animate-pulse gap-1.5 text-xs font-medium"
                  : "gap-1.5 text-xs font-medium cursor-pointer"
              }
            >
              {isRecording ? (
                <>
                  <MicOff className="h-3.5 w-3.5 text-rose-400" />
                  <span>Recording...</span>
                </>
              ) : (
                <>
                  <Mic className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Voice</span>
                </>
              )}
            </Button>

            {/* Read Answer Action Pill */}
            <Button
              type="button"
              variant="pill"
              size="sm"
              onClick={onReadAnswer}
              disabled={!hasLastAnswer}
              className="gap-1.5 text-xs font-medium cursor-pointer disabled:opacity-40"
              title={hasLastAnswer ? "Read latest medical response aloud" : "Ask a question first"}
            >
              <Volume2 className="h-3.5 w-3.5 text-zinc-400" />
              <span>Read answer</span>
            </Button>
          </div>

          {/* Right Action: Send Gradient Button */}
          <Button
            type="submit"
            variant="gradient"
            size="default"
            disabled={isLoading || (!inputMessage.trim() && !imageData)}
            className="rounded-xl px-6 py-2.5 font-medium flex items-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-95 transition-all text-xs sm:text-sm cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span>Send</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
