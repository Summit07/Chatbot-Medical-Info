"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, Copy, Volume2, BookOpen, ExternalLink, Bot, User } from "lucide-react";
import { ChatMessage } from "@/types/chat";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: ChatMessage;
  onSpeak?: (text: string) => void;
}

export function MessageBubble({ message, onSpeak }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article
      className={cn(
        "flex gap-3 text-sm leading-relaxed max-w-[90%] sm:max-w-[85%] transition-all",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      {/* Avatar Icon */}
      <div
        className={cn(
          "h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center shrink-0 text-xs shadow-sm",
          isUser
            ? "bg-gradient-to-tr from-indigo-500 to-purple-600 text-white"
            : "bg-zinc-800 dark:bg-[#1f1f2b] border border-zinc-700/50 dark:border-[#2f2f3d] text-indigo-400"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Bubble Content */}
      <div className="space-y-2">
        <div
          className={cn(
            "rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 shadow-sm transition-colors",
            isUser
              ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-xs"
              : "bg-[#141417] dark:bg-[#141417] bg-slate-100/90 text-zinc-100 dark:text-[#f5f5f7] text-slate-800 border border-[#25252b] dark:border-[#25252b] border-slate-200 rounded-tl-xs"
          )}
        >
          {/* User image preview inside user bubble if sent */}
          {message.imageData && (
            <div className="mb-2.5 overflow-hidden rounded-lg border border-white/20 max-w-[240px]">
              <img
                src={message.imageData}
                alt="Uploaded medical query visual"
                className="w-full h-auto object-cover max-h-48"
              />
            </div>
          )}

          {/* Message Text formatted */}
          <div className="whitespace-pre-line break-words text-[13.5px] sm:text-[14px]">
            {message.content}
          </div>

          {/* Sources List if available */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-zinc-700/40 dark:border-zinc-800/80 text-xs text-zinc-400">
              <span className="font-semibold text-indigo-300 dark:text-indigo-400 flex items-center gap-1 mb-1.5">
                <BookOpen className="h-3.5 w-3.5" /> Cited Sources:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {message.sources.map((src, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800/80 dark:bg-[#1c1c28] border border-zinc-700/50 dark:border-[#2e2e42] text-[11px] text-zinc-300"
                  >
                    {src.type === "pdf" ? (
                      `PDF p.${src.page ?? "N"}`
                    ) : (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline text-indigo-300 flex items-center gap-1"
                      >
                        {src.title || "Web Link"}
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Message Footnotes & Actions */}
        {!isUser && (
          <div className="flex items-center gap-3 px-1 text-xs text-zinc-500">
            <span>{message.timestamp}</span>
            <button
              onClick={handleCopy}
              className="hover:text-zinc-300 flex items-center gap-1 transition-colors"
              title="Copy message"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" /> Copy
                </>
              )}
            </button>
            {onSpeak && (
              <button
                onClick={() => onSpeak(message.content)}
                className="hover:text-zinc-300 flex items-center gap-1 transition-colors"
                title="Read aloud"
              >
                <Volume2 className="h-3 w-3" /> Read
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

