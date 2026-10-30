"use client";

import React from "react";
import { Plus, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { ConnectionStatus } from "@/types/chat";

interface ChatHeaderProps {
  status: ConnectionStatus;
  statusText: string;
  onReset: () => void;
}

export function ChatHeader({ status, statusText, onReset }: ChatHeaderProps) {
  const getBadgeVariant = () => {
    switch (status) {
      case "connected":
        return "statusConnected";
      case "warning":
        return "statusWarning";
      case "offline":
        return "statusOffline";
      default:
        return "statusChecking";
    }
  };

  return (
    <header className="px-5 py-4 sm:px-7 sm:py-6 bg-[#08080a] dark:bg-[#08080a] bg-slate-900 border-b border-zinc-800/80 dark:border-[#29292f] border-slate-200 flex flex-wrap items-center justify-between gap-4 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
          <Plus className="h-6 w-6 stroke-[3]" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white dark:text-white flex items-center gap-2">
            Medical Chatbot
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 dark:text-zinc-400">
            Medical education • Knowledge base + web research
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Badge
          variant={getBadgeVariant()}
          className="text-xs px-3 py-1 font-medium tracking-wide transition-all shadow-sm"
        >
          {statusText}
        </Badge>

        <ThemeToggle />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-zinc-400 hover:text-white dark:hover:text-white hover:bg-zinc-800/60 dark:hover:bg-zinc-800 transition-colors"
          onClick={onReset}
          title="Reset conversation"
          aria-label="Reset conversation"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

