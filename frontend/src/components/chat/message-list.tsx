"use client";

import React, { useRef, useEffect } from "react";
import { MessageBubble } from "./message-bubble";
import { ChatMessage } from "@/types/chat";
import { Loader2 } from "lucide-react";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSpeak: (text: string) => void;
  onQuickPrompt?: (prompt: string) => void;
}

export function MessageList({
  messages,
  isLoading,
  onSpeak,
  onQuickPrompt,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div
      id="messages"
      className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-4 sm:space-y-5 min-h-[340px] max-h-[58vh] bg-[#0b0b0d] dark:bg-[#0b0b0d] bg-white transition-colors"
    >
      {/* Messages */}
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onSpeak={message.role === "assistant" ? onSpeak : undefined}
        />
      ))}

      {/* Loading state indicator */}
      {isLoading && (
        <div className="flex items-center gap-3 mr-auto max-w-[85%] text-xs text-indigo-400 bg-[#141417] dark:bg-[#141417] bg-slate-100 border border-[#25252b] dark:border-[#25252b] border-slate-200 rounded-2xl px-4 py-3">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
          <span>Searching knowledge base and consulting medical guidance...</span>
        </div>
      )}

      {/* Suggested prompts if only initial message is present */}
      {messages.length === 1 && onQuickPrompt && (
        <div className="pt-4 border-t border-zinc-800/60 dark:border-zinc-800/60 border-slate-100">
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-2 font-medium">
            Suggested clinical education inquiries:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "What are the warning signs of severe dehydration?",
              "First aid steps for minor thermal burns",
              "Differentiating migraine from tension headache",
              "Common cold vs influenza symptom comparison",
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => onQuickPrompt(prompt)}
                className="text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white dark:bg-[#161620] dark:hover:bg-[#20202e] dark:text-zinc-300 dark:border-[#2c2c3d] border border-zinc-800 rounded-lg px-3 py-1.5 transition-colors text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

